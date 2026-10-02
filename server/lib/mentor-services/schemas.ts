import { z } from "zod";
import { isOwnUploadUrl } from "./is-own-upload-url";

export const MAX_ACTIVE_SERVICES = 20;

// Form posts send newlines as CRLF while textarea maxLength counts them as one
// character; normalise first so both sides agree on the length.
const text = () => z.string().transform((v) => v.replace(/\r\n/g, "\n").trim());

const optionalText = (max: number, label: string) =>
  text()
    .pipe(z.string().max(max, `${label} must be ${max} characters or less`))
    .transform((value) => (value === "" ? null : value));

const uploadUrl = (message: string) =>
  z.string().trim().refine(isOwnUploadUrl, message);

export const mentorServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be 120 characters or less"),
  description: text().pipe(
    z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be 1000 characters or less"),
  ),
  priceNpr: z
    .string()
    .trim()
    .regex(/^\d+$/, "Price must be a whole number in NPR")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(1, "Price must be at least NPR 1")
        .max(1_000_000, "Price must be NPR 10,00,000 or less"),
    ),
  durationMinutes: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d+$/.test(v), "Duration must be in minutes")
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(
      z
        .number()
        .min(5, "Duration must be at least 5 minutes")
        .max(600, "Duration must be 600 minutes or less")
        .nullable(),
    ),
});

export const paymentDetailsSchema = z.object({
  paymentInstructions: optionalText(1000, "Payment instructions"),
  paymentQrUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || isOwnUploadUrl(v), "Invalid QR code image")
    .transform((v) => (v === "" ? null : v)),
});

export const createBookingSchema = z.object({
  serviceId: z.uuid("Invalid service"),
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name must be 100 characters or less"),
  email: z
    .string()
    .trim()
    .max(255, "Email is too long")
    .pipe(z.email("Please enter a valid email address")),
  whatsappNumber: z
    .string()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(
      z
        .string()
        .regex(
          /^\+[1-9]\d{6,14}$/,
          "Enter your WhatsApp number with country code, e.g. +9779812345678",
        ),
    ),
  message: optionalText(1000, "Notes"),
  paymentReference: optionalText(100, "Transaction ID"),
  paymentProofUrl: uploadUrl("Please upload your payment screenshot"),
});

export const rejectBookingSchema = z.object({
  bookingId: z.uuid("Invalid booking"),
  reason: z
    .string()
    .trim()
    .min(5, "Please give the student a reason (at least 5 characters)")
    .max(500, "Reason must be 500 characters or less"),
});
