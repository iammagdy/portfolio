import { Router, type IRouter } from "express";
import { z } from "zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ContactRequest = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("A valid email is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

const RECIPIENT = "contact@magdysaber.com";
const FROM_FALLBACK = "Portfolio Contact <onboarding@resend.dev>";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

router.post("/contact", async (req, res) => {
  const parsed = ContactRequest.safeParse(req.body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return res
      .status(400)
      .json({ error: issue?.message ?? "Invalid request" });
  }

  const { name, email, message } = parsed.data;
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["CONTACT_FROM_EMAIL"] ?? FROM_FALLBACK;

  if (!apiKey) {
    logger.error(
      "RESEND_API_KEY is not configured — cannot send contact email",
    );
    return res.status(503).json({
      error:
        "Email service is not configured yet. Please email contact@magdysaber.com directly.",
    });
  }

  const subject = `New portfolio contact from ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="margin: 0 0 16px;">New message from your portfolio</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 6px; font-family: inherit;">${escapeHtml(message)}</pre>
    </div>
  `;
  const text = `New message from your portfolio

Name: ${name}
Email: ${email}

Message:
${message}
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [RECIPIENT],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(
        { status: response.status, body: errorBody },
        "Resend API returned an error",
      );
      return res.status(502).json({
        error:
          "Could not deliver your message right now. Please try again later or email contact@magdysaber.com directly.",
      });
    }

    logger.info({ from: email }, "Contact email sent successfully");
    return res.status(200).json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send contact email");
    return res.status(500).json({
      error:
        "Something went wrong sending your message. Please try again later.",
    });
  }
});

export default router;
