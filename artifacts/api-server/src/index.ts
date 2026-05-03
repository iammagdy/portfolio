import app from "./app";
import { logger } from "./lib/logger";
import { getPool, isDevkitConfigured } from "./lib/mysql";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Initialize devkit MySQL pool + schema at boot so failures surface immediately.
  if (isDevkitConfigured()) {
    getPool()
      .then(() => logger.info("Devkit MySQL: connected and schema ensured"))
      .catch((dbErr) => logger.error({ err: dbErr }, "Devkit MySQL: connection failed at boot"));
  } else {
    logger.warn("Devkit MySQL: not configured (HOSTINGER_DB_* / DEVKIT_PASSWORD missing); /api/devkit/events will silently no-op");
  }
});
