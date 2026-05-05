import { logger } from "./logger";

const WINDOW_MS = 10 * 60 * 1_000; // 10-minute rolling window
const MAX_PER_WINDOW = 5;           // up to 5 notifications per window

let windowStart = 0;
let windowCount = 0;

export interface VisitInfo {
  country: string | null;
  device: string;
  referrer: string | null;
  utmSource: string | null;
  path: string | null;
  sessionId: string;
}

function acquireCooldown(): boolean {
  const now = Date.now();
  if (now - windowStart > WINDOW_MS) {
    // New window
    windowStart = now;
    windowCount = 0;
  }
  if (windowCount >= MAX_PER_WINDOW) return false;
  windowCount++;
  return true;
}

function buildText(info: VisitInfo): string {
  return [
    "New portfolio visitor!",
    `• Country: ${info.country ?? "Unknown"}`,
    `• Device: ${info.device}`,
    `• Page: ${info.path ?? "/"}`,
    info.referrer ? `• Referrer: ${info.referrer}` : null,
    info.utmSource ? `• UTM source: ${info.utmSource}` : null,
  ].filter(Boolean).join("\n");
}

async function sendWebhook(url: string, info: VisitInfo): Promise<void> {
  const text = buildText(info);
  const isDiscord = url.includes("discord.com") || url.includes("discordapp.com");
  const body = isDiscord ? { content: text } : { text };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) {
    logger.warn({ status: res.status }, "notifier: webhook delivery failed");
  }
}

async function sendEmail(to: string, info: VisitInfo): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("notifier: RESEND_API_KEY not set — skipping email");
    return;
  }
  const from = process.env.DEVKIT_NOTIFY_FROM ?? "Magdy Portfolio <portfolio@thewise.cloud>";
  const text = buildText(info);
  logger.info({ to, from }, "notifier: sending email via Resend");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject: "New visitor on your portfolio",
      text,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  const body = await res.text().catch(() => "");
  if (!res.ok) {
    logger.warn({ status: res.status, body }, "notifier: email delivery failed");
  } else {
    logger.info({ status: res.status, body }, "notifier: email sent successfully");
  }
}

export async function maybeNotify(info: VisitInfo): Promise<void> {
  const webhookUrl = process.env.DEVKIT_NOTIFY_WEBHOOK;
  const emailTo = process.env.DEVKIT_NOTIFY_EMAIL;
  if (!webhookUrl && !emailTo) {
    logger.warn("notifier: no channels configured (DEVKIT_NOTIFY_EMAIL and DEVKIT_NOTIFY_WEBHOOK are both unset)");
    return;
  }
  if (!acquireCooldown()) {
    logger.info("notifier: skipped — within cooldown window");
    return;
  }

  const tasks: Promise<void>[] = [];
  if (webhookUrl) {
    tasks.push(
      sendWebhook(webhookUrl, info).catch((err) =>
        logger.warn({ err }, "notifier: webhook error"),
      ),
    );
  }
  if (emailTo) {
    tasks.push(
      sendEmail(emailTo, info).catch((err) =>
        logger.warn({ err }, "notifier: email error"),
      ),
    );
  }
  await Promise.allSettled(tasks);
}
