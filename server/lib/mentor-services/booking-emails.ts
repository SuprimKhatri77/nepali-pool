import { emailLayout, safeSendEmail } from "./email-layout";
import { authBaseURL } from "../auth/base-url";
import { escapeHtml } from "./escape-html";

type BookingSummary = {
  referenceCode: string;
  serviceTitle: string;
  priceNpr: number;
};

function summary(booking: BookingSummary) {
  return `
    <table style="font-size:14px;color:#374151;border-collapse:collapse;">
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Reference</td><td><strong>${escapeHtml(booking.referenceCode)}</strong></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Service</td><td>${escapeHtml(booking.serviceTitle)}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Amount</td><td>NPR ${booking.priceNpr.toLocaleString("en-IN")}</td></tr>
    </table>`;
}

export function notifyMentorOfNewBooking(args: {
  to: string;
  mentorName: string;
  studentName: string;
  booking: BookingSummary;
}) {
  return safeSendEmail({
    to: args.to,
    subject: `New booking to verify: ${args.booking.serviceTitle}`,
    html: emailLayout(
      "New booking request",
      `<p style="color:#374151;">Hi ${escapeHtml(args.mentorName)},</p>
       <p style="color:#374151;">${escapeHtml(args.studentName)} booked one of your services and uploaded a payment screenshot. Please check that the payment arrived, then confirm or reject the booking.</p>
       ${summary(args.booking)}`,
      { href: `${authBaseURL}/dashboard/mentor/bookings`, label: "Review booking" },
    ),
  });
}

export function notifyStudentBookingConfirmed(args: {
  to: string;
  studentName: string;
  mentorName: string;
  booking: BookingSummary;
}) {
  return safeSendEmail({
    to: args.to,
    subject: `Booking confirmed: ${args.booking.serviceTitle}`,
    html: emailLayout(
      "Your booking is confirmed",
      `<p style="color:#374151;">Hi ${escapeHtml(args.studentName)},</p>
       <p style="color:#374151;">${escapeHtml(args.mentorName)} verified your payment and confirmed your booking. They'll reach out to you shortly, and you can also message them from NepaliPool.</p>
       ${summary(args.booking)}`,
      { href: `${authBaseURL}/bookings`, label: "View my bookings" },
    ),
  });
}

export function notifyStudentBookingRejected(args: {
  to: string;
  studentName: string;
  mentorName: string;
  reason: string;
  booking: BookingSummary;
}) {
  return safeSendEmail({
    to: args.to,
    subject: `Booking not confirmed: ${args.booking.serviceTitle}`,
    html: emailLayout(
      "Your booking could not be confirmed",
      `<p style="color:#374151;">Hi ${escapeHtml(args.studentName)},</p>
       <p style="color:#374151;">${escapeHtml(args.mentorName)} couldn't verify the payment for your booking.</p>
       <p style="color:#374151;"><strong>Reason:</strong> ${escapeHtml(args.reason)}</p>
       ${summary(args.booking)}`,
      { href: `${authBaseURL}/bookings`, label: "View my bookings" },
    ),
  });
}
