import { Router, type IRouter } from "express";
import crypto from "node:crypto";
import { UAParser } from "ua-parser-js";
import { logger } from "../lib/logger";
import { getPool, isDevkitConfigured } from "../lib/mysql";
import { issueDevkitCookie, clearDevkitCookie, isDevkitAuthed, requireDevkitAuth } from "../lib/devkitAuth";
import { getCountry, getClientIp } from "../lib/geoCache";
import { allow as rateLimitAllow, allowLogin } from "../lib/rateLimit";

const router: IRouter = Router();

const ALLOWED_KINDS = new Set(["pageview", "click", "session_end", "theme_change", "portal_open", "portal_close"]);

const clip = (s: unknown, max: number): string | null => {
  if (typeof s !== "string" || s.length === 0) return null;
  return s.length > max ? s.slice(0, max) : s;
};

const deviceFromUA = (ua: string): { device: string; browser: string | null; os: string | null } => {
  const parser = new UAParser(ua);
  const r = parser.getResult();
  const t = r.device.type;
  let device = "desktop";
  if (t === "mobile") device = "mobile";
  else if (t === "tablet") device = "tablet";
  return {
    device,
    browser: r.browser.name ?? null,
    os: r.os.name ?? null,
  };
};

const isAllowedOrigin = (req: { headers: Record<string, string | string[] | undefined> }): boolean => {
  const origin = req.headers["origin"];
  const referer = req.headers["referer"];
  const src = (typeof origin === "string" && origin) || (typeof referer === "string" && referer) || "";
  if (!src) return true; // same-origin requests sometimes omit origin
  try {
    const host = new URL(src).hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host.endsWith(".replit.dev") || host.endsWith(".replit.app")) return true;
    if (host === "magdysaber.com" || host.endsWith(".magdysaber.com")) return true;
    return false;
  } catch {
    return false;
  }
};

router.post("/devkit/events", async (req, res) => {
  if (!isDevkitConfigured()) {
    res.status(204).end();
    return;
  }
  if (!isAllowedOrigin(req)) {
    res.status(204).end();
    return;
  }
  const ipKey = getClientIp(req) ?? "unknown";
  if (!rateLimitAllow(ipKey)) {
    res.status(429).end();
    return;
  }
  try {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body) { res.status(400).json({ error: "bad request" }); return; }

    const dnt = body.dnt === true || body.dnt === "1" || req.headers["dnt"] === "1";
    if (dnt) { res.status(204).end(); return; }

    const kind = typeof body.kind === "string" ? body.kind : "";
    if (!ALLOWED_KINDS.has(kind)) { res.status(400).json({ error: "bad kind" }); return; }

    let sessionId = typeof body.sessionId === "string" && /^[0-9a-f-]{8,40}$/i.test(body.sessionId)
      ? body.sessionId : crypto.randomUUID();
    let visitorId = typeof body.visitorId === "string" && /^[0-9a-f-]{8,40}$/i.test(body.visitorId)
      ? body.visitorId : crypto.randomUUID();

    if (sessionId.length > 36) sessionId = sessionId.slice(0, 36);
    if (visitorId.length > 36) visitorId = visitorId.slice(0, 36);

    const path = clip(body.path, 255);
    if (path === "/devkit" || path?.startsWith("/devkit")) { res.status(204).end(); return; }

    const target = clip(body.target, 128);
    const label = clip(body.label, 255);
    const referrer = clip(body.referrer, 512);
    const durationMs = typeof body.durationMs === "number" && body.durationMs >= 0 && body.durationMs < 86_400_000
      ? Math.floor(body.durationMs) : null;

    const ua = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "";
    const { device, browser, os } = deviceFromUA(ua);

    const ip = getClientIp(req);
    const country = await getCountry(ip);

    const pool = await getPool();
    await pool.execute(
      `INSERT INTO devkit_events (ts, session_id, visitor_id, kind, path, target, label, country, device, browser, os, referrer, duration_ms)
       VALUES (UTC_TIMESTAMP(3), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sessionId, visitorId, kind, path, target, label, country, device, browser, os, referrer, durationMs],
    );
    res.status(204).end();
  } catch (err) {
    logger.warn({ err }, "devkit event insert failed");
    res.status(204).end();
  }
});

router.get("/devkit/session", (req, res) => {
  res.json({ authed: isDevkitAuthed(req) });
});

router.post("/devkit/login", (req, res) => {
  const ipKey = getClientIp(req) ?? "unknown";
  if (!allowLogin(ipKey)) { res.status(429).json({ error: "too many attempts" }); return; }
  const body = req.body as { password?: unknown } | undefined;
  const expected = process.env.DEVKIT_PASSWORD;
  if (!expected) { res.status(500).json({ error: "not configured" }); return; }
  const provided = typeof body?.password === "string" ? body.password : "";
  // Hash both sides to fixed length so timingSafeEqual sees equal-length buffers
  // and we don't leak the expected password length through the comparison path.
  const ha = crypto.createHash("sha256").update(provided).digest();
  const hb = crypto.createHash("sha256").update(expected).digest();
  const ok = crypto.timingSafeEqual(ha, hb);
  if (!ok) { res.status(401).json({ error: "invalid password" }); return; }
  issueDevkitCookie(res);
  res.json({ ok: true });
});

router.post("/devkit/logout", (_req, res) => {
  clearDevkitCookie(res);
  res.json({ ok: true });
});

router.get("/devkit/stats", requireDevkitAuth, async (req, res) => {
  try {
    if (!isDevkitConfigured()) { res.status(503).json({ error: "not configured" }); return; }
    const days = Math.max(1, Math.min(90, Number(req.query.days ?? 30)));
    const pool = await getPool();

    const [totals] = await pool.query(
      `SELECT
         COUNT(*) AS events,
         SUM(kind='pageview') AS pageviews,
         SUM(kind='click') AS clicks,
         COUNT(DISTINCT visitor_id) AS visitors,
         COUNT(DISTINCT session_id) AS sessions
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY`,
      [days],
    );

    // Fixed Today / 7-day / 30-day session counts (always included regardless of `days`).
    const [windows] = await pool.query(
      `SELECT
         COUNT(DISTINCT CASE WHEN ts >= UTC_TIMESTAMP() - INTERVAL 1 DAY THEN session_id END) AS sessions_24h,
         COUNT(DISTINCT CASE WHEN ts >= UTC_TIMESTAMP() - INTERVAL 7 DAY THEN session_id END) AS sessions_7d,
         COUNT(DISTINCT CASE WHEN ts >= UTC_TIMESTAMP() - INTERVAL 30 DAY THEN session_id END) AS sessions_30d,
         COUNT(DISTINCT CASE WHEN ts >= UTC_TIMESTAMP() - INTERVAL 1 DAY THEN visitor_id END) AS visitors_24h,
         COUNT(DISTINCT CASE WHEN ts >= UTC_TIMESTAMP() - INTERVAL 7 DAY THEN visitor_id END) AS visitors_7d,
         COUNT(DISTINCT CASE WHEN ts >= UTC_TIMESTAMP() - INTERVAL 30 DAY THEN visitor_id END) AS visitors_30d
       FROM devkit_events`,
    );

    const [daily] = await pool.query(
      `SELECT DATE(ts) AS day,
              SUM(kind='pageview') AS pageviews,
              COUNT(DISTINCT visitor_id) AS visitors
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
       GROUP BY day ORDER BY day ASC`,
      [days],
    );

    const [countries] = await pool.query(
      `SELECT COALESCE(country, 'Unknown') AS country, COUNT(DISTINCT visitor_id) AS visitors
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
       GROUP BY country ORDER BY visitors DESC LIMIT 15`,
      [days],
    );

    const [devices] = await pool.query(
      `SELECT COALESCE(device, 'unknown') AS device, COUNT(DISTINCT visitor_id) AS visitors
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
       GROUP BY device ORDER BY visitors DESC`,
      [days],
    );

    const [oses] = await pool.query(
      `SELECT COALESCE(os, 'unknown') AS os, COUNT(DISTINCT visitor_id) AS visitors
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
       GROUP BY os ORDER BY visitors DESC LIMIT 10`,
      [days],
    );

    const [browsers] = await pool.query(
      `SELECT COALESCE(browser, 'unknown') AS browser, COUNT(DISTINCT visitor_id) AS visitors
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
       GROUP BY browser ORDER BY visitors DESC LIMIT 10`,
      [days],
    );

    // Top events across ALL interaction kinds (clicks + theme + portal opens).
    const [topEvents] = await pool.query(
      `SELECT kind, target, label, COUNT(*) AS hits
       FROM devkit_events
       WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
         AND target IS NOT NULL
         AND kind IN ('click','theme_change','portal_open')
       GROUP BY kind, target, label ORDER BY hits DESC LIMIT 25`,
      [days],
    );

    const [sessionLen] = await pool.query(
      `SELECT AVG(duration_ms) AS avg_ms, MAX(duration_ms) AS max_ms
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY AND kind='session_end' AND duration_ms IS NOT NULL`,
      [days],
    );

    const [flowTransitions] = await pool.query(
      `SELECT from_section, to_section, COUNT(*) AS hits
       FROM (
         SELECT session_id, target AS to_section,
                LAG(target) OVER (PARTITION BY session_id ORDER BY ts, id) AS from_section
         FROM devkit_events
         WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
           AND kind = 'portal_open' AND target IS NOT NULL
       ) t
       WHERE from_section IS NOT NULL AND from_section <> to_section
       GROUP BY from_section, to_section
       ORDER BY hits DESC LIMIT 20`,
      [days],
    );

    const [flowPaths] = await pool.query(
      `SELECT path, COUNT(*) AS sessions, COUNT(DISTINCT visitor_id) AS visitors
       FROM (
         SELECT session_id, ANY_VALUE(visitor_id) AS visitor_id,
                GROUP_CONCAT(target ORDER BY ts, id SEPARATOR ' → ') AS path
         FROM devkit_events
         WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY
           AND kind = 'portal_open' AND target IS NOT NULL
         GROUP BY session_id
       ) s
       WHERE path IS NOT NULL AND path <> ''
       GROUP BY path ORDER BY sessions DESC LIMIT 10`,
      [days],
    );

    const [referrers] = await pool.query(
      `SELECT referrer, COUNT(*) AS hits FROM devkit_events
       WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY AND kind='pageview' AND referrer IS NOT NULL AND referrer <> ''
       GROUP BY referrer ORDER BY hits DESC LIMIT 10`,
      [days],
    );

    res.json({
      days,
      totals: (totals as Array<Record<string, unknown>>)[0] ?? {},
      windows: (windows as Array<Record<string, unknown>>)[0] ?? {},
      daily,
      countries,
      devices,
      oses,
      browsers,
      topEvents,
      sessionLength: (sessionLen as Array<Record<string, unknown>>)[0] ?? {},
      referrers,
      flowTransitions,
      flowPaths,
    });
  } catch (err) {
    logger.error({ err }, "devkit stats failed");
    const e = err as { message?: string; code?: string; sqlMessage?: string };
    console.error("[devkit/stats] FAILED:", e?.code, e?.message, e?.sqlMessage);
    res.status(500).json({
      error: "stats failed",
      detail: e?.message ?? null,
      code: e?.code ?? null,
      sql: e?.sqlMessage ?? null,
    });
  }
});

const csvEscape = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

router.get("/devkit/export.csv", requireDevkitAuth, async (req, res) => {
  try {
    if (!isDevkitConfigured()) { res.status(503).end("not configured"); return; }
    const days = Math.max(1, Math.min(365, Number(req.query.days ?? 30)));
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT ts, session_id, visitor_id, kind, path, target, label, country, device, browser, os, referrer, duration_ms
       FROM devkit_events WHERE ts >= UTC_TIMESTAMP() - INTERVAL ? DAY ORDER BY ts ASC LIMIT 100000`,
      [days],
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="devkit-${days}d.csv"`);
    const header = "ts,session_id,visitor_id,kind,path,target,label,country,device,browser,os,referrer,duration_ms\n";
    res.write(header);
    for (const r of rows as Array<Record<string, unknown>>) {
      res.write([
        r.ts, r.session_id, r.visitor_id, r.kind, r.path, r.target, r.label,
        r.country, r.device, r.browser, r.os, r.referrer, r.duration_ms,
      ].map(csvEscape).join(",") + "\n");
    }
    res.end();
  } catch (err) {
    logger.error({ err }, "devkit csv export failed");
    res.status(500).end("export failed");
  }
});

export default router;
