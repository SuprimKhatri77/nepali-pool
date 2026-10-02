import { authBaseURL } from "../auth/base-url";
import { emailLayout, safeSendEmail } from "./email-layout";
import { escapeHtml } from "./escape-html";

export function notifyMentorOfNewEnquiry(args: {
  to: string;
  mentorName: string;
  studentName: string;
  referenceCode: string;
  question: string;
}) {
  return safeSendEmail({
    to: args.to,
    subject: `New question from ${args.studentName}`,
    html: emailLayout(
      "New student enquiry",
      `<p style="color:#374151;">Hi ${escapeHtml(args.mentorName)},</p>
       <p style="color:#374151;">${escapeHtml(args.studentName)} sent you a free enquiry (${escapeHtml(args.referenceCode)}). Their question is below; their background and goals are on your Enquiries page.</p>
       <blockquote style="color:#374151;border-left:3px solid #10b981;margin:12px 0;padding:4px 12px;white-space:pre-line;">${escapeHtml(args.question)}</blockquote>`,
      {
        href: `${authBaseURL}/dashboard/mentor/enquiries`,
        label: "View enquiry",
      },
    ),
  });
}

export function notifyStudentEnquiryAccepted(args: {
  to: string;
  studentName: string;
  mentorName: string;
  referenceCode: string;
  mentorNote: string | null;
}) {
  return safeSendEmail({
    to: args.to,
    subject: `${args.mentorName} accepted your enquiry`,
    html: emailLayout(
      "Your enquiry was accepted",
      `<p style="color:#374151;">Hi ${escapeHtml(args.studentName)},</p>
       <p style="color:#374151;">${escapeHtml(args.mentorName)} accepted your enquiry (${escapeHtml(args.referenceCode)}) and will get in touch with you. You can also message them on NepaliPool.</p>
       ${args.mentorNote ? `<p style="color:#374151;"><strong>Note from your mentor:</strong> ${escapeHtml(args.mentorNote)}</p>` : ""}`,
      { href: `${authBaseURL}/bookings#enquiries`, label: "View my enquiries" },
    ),
  });
}

export function notifyStudentEnquiryDeclined(args: {
  to: string;
  studentName: string;
  mentorName: string;
  referenceCode: string;
  mentorNote: string | null;
}) {
  return safeSendEmail({
    to: args.to,
    subject: `Update on your enquiry to ${args.mentorName}`,
    html: emailLayout(
      "Your enquiry was declined",
      `<p style="color:#374151;">Hi ${escapeHtml(args.studentName)},</p>
       <p style="color:#374151;">${escapeHtml(args.mentorName)} isn't able to take on your enquiry (${escapeHtml(args.referenceCode)}) right now. You can browse other mentors on NepaliPool.</p>
       ${args.mentorNote ? `<p style="color:#374151;"><strong>Note from the mentor:</strong> ${escapeHtml(args.mentorNote)}</p>` : ""}`,
      { href: `${authBaseURL}/mentors`, label: "Browse mentors" },
    ),
  });
}
