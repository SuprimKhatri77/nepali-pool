import type { ServiceBookingStatus } from "../../../lib/db/schema";

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

// wa.me needs the number in international format, digits only.
export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}
