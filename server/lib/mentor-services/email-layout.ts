import { sendEmail } from "../send-email";

export function emailLayout(
  title: string,
  body: string,
  cta: { href: string; label: string },
) {
  return `
    <div style="background:#f9fafb;padding:24px;font-family:Arial,sans-serif;">
      <div style="max-width:520px;margin:auto;background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
        <h2 style="color:#059669;margin:0 0 16px;">${title}</h2>
        ${body}
        <p style="margin:24px 0 0;">
          <a href="${cta.href}" style="background:#059669;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;display:inline-block;font-weight:bold;">${cta.label}</a>
        </p>
        <p style="font-size:12px;color:#9ca3af;margin-top:24px;">© ${new Date().getFullYear()} NepaliPool</p>
      </div>
    </div>`;
}

// Notifications are best-effort: a failed email must never fail the action
// that triggered it.
export async function safeSendEmail(args: Parameters<typeof sendEmail>[0]) {
  try {
    await sendEmail(args);
  } catch (error) {
    console.error(`Failed to send email "${args.subject}":`, error);
  }
}
