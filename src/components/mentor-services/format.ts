import type {
  MentorEnquirySelectType,
  MentorEnquiryStatus,
  ServiceBookingStatus,
} from "../../../lib/db/schema";

const nprFormatter = new Intl.NumberFormat("en-IN");

export function formatNpr(amount: number) {
  return `NPR ${nprFormatter.format(amount)}`;
}

export function formatDuration(minutes: number | null) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

export const BOOKING_STATUS_META: Record<
  ServiceBookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending verification",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export const ENQUIRY_STATUS_META: Record<
  MentorEnquiryStatus,
  { label: string; className: string }
> = {
  new: {
    label: "Awaiting reply",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  declined: {
    label: "Declined",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const ENGLISH_LEVEL_LABELS: Record<
  MentorEnquirySelectType["englishLevel"],
  string
> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  fluent: "Fluent / Native",
};

export const BUDGET_READINESS_LABELS: Record<
  MentorEnquirySelectType["budgetReadiness"],
  string
> = {
  ready: "Funds are ready",
  partially_ready: "Partially arranged",
  planning: "Still planning",
};

// Onboarding stores local numbers like "9812345678"; WhatsApp links need the
// country code, so prefill Nepali mobile numbers as +977… and leave anything
// we can't interpret for the student to fill in.
export function toWhatsappPrefill(phone: string | null): string {
  const compact = phone?.replace(/[\s()-]/g, "") ?? "";
  if (/^\+[1-9]\d{6,14}$/.test(compact)) return compact;
  if (/^9\d{9}$/.test(compact)) return `+977${compact}`;
  return "";
}

// wa.me needs the number in international format, digits only.
export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}
