import mysql from "mysql2/promise";
import { logger } from "./logger";

let pool: mysql.Pool | null = null;
let initPromise: Promise<void> | null = null;

const getConfig = () => ({
  host: process.env.HOSTINGER_DB_HOST,
  port: Number(process.env.HOSTINGER_DB_PORT ?? 3306),
  user: process.env.HOSTINGER_DB_USER,
  password: process.env.HOSTINGER_DB_PASSWORD,
  database: process.env.HOSTINGER_DB_NAME,
});

export const isDevkitConfigured = (): boolean => {
  const c = getConfig();
  return !!(c.host && c.user && c.password && c.database && process.env.DEVKIT_PASSWORD);
};

const ensureSchema = async (conn: mysql.Pool) => {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS devkit_events (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      ts DATETIME(3) NOT NULL,
      session_id CHAR(36) NOT NULL,
      visitor_id CHAR(36) NOT NULL,
      kind VARCHAR(32) NOT NULL,
      path VARCHAR(255) DEFAULT NULL,
      target VARCHAR(128) DEFAULT NULL,
      label VARCHAR(255) DEFAULT NULL,
      country CHAR(2) DEFAULT NULL,
      device VARCHAR(16) DEFAULT NULL,
      browser VARCHAR(32) DEFAULT NULL,
      os VARCHAR(32) DEFAULT NULL,
      referrer VARCHAR(512) DEFAULT NULL,
      duration_ms INT UNSIGNED DEFAULT NULL,
      PRIMARY KEY (id),
      KEY idx_ts (ts),
      KEY idx_session (session_id),
      KEY idx_kind_ts (kind, ts)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

export const getPool = async (): Promise<mysql.Pool> => {
  if (pool) return pool;
  if (initPromise) {
    await initPromise;
    return pool!;
  }
  initPromise = (async () => {
    const c = getConfig();
    const created = mysql.createPool({
      host: c.host,
      port: c.port,
      user: c.user,
      password: c.password,
      database: c.database,
      connectionLimit: 3,
      waitForConnections: true,
      connectTimeout: 10_000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 30_000,
    });
    await ensureSchema(created);
    pool = created;
    logger.info({ host: c.host, db: c.database }, "devkit mysql pool ready");
  })();
  try {
    await initPromise;
  } catch (err) {
    initPromise = null;
    throw err;
  }
  return pool!;
};
