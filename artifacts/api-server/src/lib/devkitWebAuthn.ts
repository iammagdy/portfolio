import crypto from "node:crypto";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import type { DevkitPool } from "./mysql";
import { logger } from "./logger";

export const RP_ID   = process.env.WEBAUTHN_RP_ID   ?? "magdysaber.com";
export const RP_NAME = "Magdy Devkit";
export const ORIGIN  = process.env.WEBAUTHN_ORIGIN  ?? `https://${RP_ID}`;

// In-memory challenge store — single user, TTL 5 min
const challenges = new Map<"reg" | "auth", { challenge: string; expires: number }>();

const storeChallenge = (kind: "reg" | "auth", challenge: string) =>
  challenges.set(kind, { challenge, expires: Date.now() + 5 * 60_000 });

const popChallenge = (kind: "reg" | "auth"): string | null => {
  const e = challenges.get(kind);
  challenges.delete(kind);
  if (!e || e.expires < Date.now()) return null;
  return e.challenge;
};

// ── DB helpers ────────────────────────────────────────────────────────────────

export const ensureWebAuthnTable = async (pool: DevkitPool): Promise<void> => {
  // Try MySQL syntax first; fall back to PG if it errors (the pool wrapper
  // converts ? → $N for PG, but CREATE TABLE syntax differs).
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS devkit_webauthn (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        credential_id VARCHAR(512) NOT NULL,
        public_key TEXT NOT NULL,
        counter BIGINT UNSIGNED NOT NULL DEFAULT 0,
        transports TEXT DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_cred_id (credential_id(255))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } catch {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS devkit_webauthn (
        id SERIAL PRIMARY KEY,
        credential_id TEXT NOT NULL UNIQUE,
        public_key TEXT NOT NULL,
        counter BIGINT NOT NULL DEFAULT 0,
        transports TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }
};

interface StoredCred {
  credential_id: string;
  public_key: string;
  counter: number;
  transports: string | null;
}

const getCredential = async (pool: DevkitPool): Promise<StoredCred | null> => {
  const { rows } = await pool.query(
    "SELECT credential_id, public_key, counter, transports FROM devkit_webauthn LIMIT 1",
  );
  return (rows[0] as StoredCred | undefined) ?? null;
};

// ── Registration ──────────────────────────────────────────────────────────────

export const getRegistrationOptions = async (pool: DevkitPool) => {
  const existing = await getCredential(pool);
  const opts = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: "magdy",
    userID: new TextEncoder().encode("magdy"),
    attestationType: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      residentKey: "preferred",
    },
    excludeCredentials: existing
      ? [{ id: existing.credential_id, type: "public-key" }]
      : [],
  });
  storeChallenge("reg", opts.challenge);
  return opts;
};

export const verifyRegistration = async (
  pool: DevkitPool,
  body: unknown,
): Promise<{ ok: boolean; error?: string }> => {
  const challenge = popChallenge("reg");
  if (!challenge) return { ok: false, error: "Challenge expired or not found" };
  try {
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: body as Parameters<typeof verifyRegistrationResponse>[0]["response"],
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
    });
    if (!verified || !registrationInfo) return { ok: false, error: "Verification failed" };

    const { credential } = registrationInfo;
    const pkBase64 = Buffer.from(credential.publicKey).toString("base64url");
    const transports = (credential.transports ?? []).join(",");

    // Upsert: delete existing then insert (works on both MySQL & PG)
    await pool.execute("DELETE FROM devkit_webauthn WHERE 1=1");
    await pool.execute(
      "INSERT INTO devkit_webauthn (credential_id, public_key, counter, transports) VALUES (?, ?, ?, ?)",
      [credential.id, pkBase64, credential.counter, transports || null],
    );
    logger.info({ credId: credential.id.slice(0, 8) }, "webauthn: credential registered");
    return { ok: true };
  } catch (err) {
    logger.warn({ err }, "webauthn: registration failed");
    return { ok: false, error: (err as Error).message };
  }
};

// ── Authentication ────────────────────────────────────────────────────────────

export const getAuthOptions = async (
  pool: DevkitPool,
): Promise<{ options: unknown } | { error: string }> => {
  const cred = await getCredential(pool);
  if (!cred) return { error: "No passkey registered" };

  const opts = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: "required",
    allowCredentials: [
      {
        id: cred.credential_id,
        type: "public-key",
        transports: cred.transports
          ? (cred.transports.split(",") as AuthenticatorTransportFuture[])
          : undefined,
      },
    ],
  });
  storeChallenge("auth", opts.challenge);
  return { options: opts };
};

export const verifyAuth = async (
  pool: DevkitPool,
  body: unknown,
): Promise<{ ok: boolean; error?: string }> => {
  const challenge = popChallenge("auth");
  if (!challenge) return { ok: false, error: "Challenge expired or not found" };

  const cred = await getCredential(pool);
  if (!cred) return { ok: false, error: "No passkey registered" };

  try {
    const { verified, authenticationInfo } = await verifyAuthenticationResponse({
      response: body as Parameters<typeof verifyAuthenticationResponse>[0]["response"],
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
      credential: {
        id: cred.credential_id,
        publicKey: Buffer.from(cred.public_key, "base64url"),
        counter: Number(cred.counter),
        transports: cred.transports
          ? (cred.transports.split(",") as AuthenticatorTransportFuture[])
          : undefined,
      },
    });
    if (!verified) return { ok: false, error: "Authentication failed" };

    // Update counter
    await pool.execute(
      "UPDATE devkit_webauthn SET counter = ? WHERE credential_id = ?",
      [authenticationInfo.newCounter, cred.credential_id],
    );
    logger.info({ newCounter: authenticationInfo.newCounter }, "webauthn: authenticated");
    return { ok: true };
  } catch (err) {
    logger.warn({ err }, "webauthn: authentication failed");
    return { ok: false, error: (err as Error).message };
  }
};

export const hasPasskey = async (pool: DevkitPool): Promise<boolean> => {
  const cred = await getCredential(pool);
  return cred !== null;
};

export const removePasskey = async (pool: DevkitPool): Promise<void> => {
  await pool.execute("DELETE FROM devkit_webauthn WHERE 1=1");
};

// Random nonce so the browser knows whether to show the biometric button
// without revealing the credential ID.
export const getPasskeyNonce = (): string =>
  crypto.randomBytes(8).toString("hex");
