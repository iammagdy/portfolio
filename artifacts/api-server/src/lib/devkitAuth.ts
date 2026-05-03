import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "devkit_session";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// Derive an HMAC key from the password using a fixed app salt, so the cookie
// signing key is not the raw password (offline brute force still requires the
// secret, but at least it's a separate derived value).
const HMAC_SALT = "magdysaber.devkit.v1";
let cachedKey: { pw: string; key: Buffer } | null = null;
const getSecret = (): Buffer => {
  const pw = process.env.DEVKIT_PASSWORD;
  if (!pw) throw new Error("DEVKIT_PASSWORD not set");
  if (cachedKey && cachedKey.pw === pw) return cachedKey.key;
  const key = crypto.createHmac("sha256", HMAC_SALT).update(pw).digest();
  cachedKey = { pw, key };
  return key;
};

const sign = (payload: string): string => {
  const h = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${h}`;
};

const verify = (token: string): boolean => {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(payload.split(":")[1]);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return true;
};

// When the API runs on a different origin than the website (e.g. api.example.com
// vs example.com), the cookie must be SameSite=None + Secure to be sent on
// cross-site requests. Set COOKIE_CROSS_SITE=1 in production for that case.
const isProd = process.env.NODE_ENV === "production";
const crossSite = process.env.COOKIE_CROSS_SITE === "1";
const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

export const issueDevkitCookie = (res: Response) => {
  const exp = Date.now() + MAX_AGE_MS;
  const token = sign(`devkit:${exp}`);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd || crossSite,
    sameSite: crossSite ? "none" : "lax",
    maxAge: MAX_AGE_MS,
    path: "/",
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });
};

export const clearDevkitCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    sameSite: crossSite ? "none" : "lax",
    secure: isProd || crossSite,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });
};

export const isDevkitAuthed = (req: Request): boolean => {
  const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[COOKIE_NAME];
  if (!token) return false;
  try {
    return verify(token);
  } catch {
    return false;
  }
};

export const requireDevkitAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!isDevkitAuthed(req)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
};
