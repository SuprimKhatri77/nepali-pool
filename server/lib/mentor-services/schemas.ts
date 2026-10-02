import { z } from "zod";
import {
  budgetReadinessEnum,
  englishLevelEnum,
  intakeMonthEnum,
  intakeYearEnum,
} from "../../../lib/db/schema";
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

// Contact details shared by bookings and enquiries.
const contactFields = {
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name must be 100 characters or less")
    // No newlines/control characters: the name ends up in email subjects.
    .regex(/^[^\p{Cc}]+$/u, "Name contains invalid characters"),
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
};

export const createBookingSchema = z.object({
  serviceId: z.uuid("Invalid service"),
  ...contactFields,
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

const requiredText = (min: number, max: number, label: string) =>
  text().pipe(
    z
      .string()
      .min(min, `${label} must be at least ${min} characters`)
      .max(max, `${label} must be ${max} characters or less`),
  );

export const createEnquirySchema = z
  .object({
    mentorId: z.string().min(1, "Invalid mentor").max(64, "Invalid mentor"),
    ...contactFields,
    question: requiredText(10, 1000, "Your question"),
    qualification: requiredText(2, 200, "Qualification"),
    targetCourse: requiredText(2, 200, "Target course"),
    englishLevel: z.enum(englishLevelEnum.enumValues, "Select your English level"),
    englishTestScore: optionalText(50, "Test score"),
    intakeMonth: z.enum(intakeMonthEnum.enumValues, "Select an intake month"),
    intakeYear: z.enum(intakeYearEnum.enumValues, "Select an intake year"),
    budgetReadiness: z.enum(
      budgetReadinessEnum.enumValues,
      "Select how ready your finances are",
    ),
    goals: requiredText(20, 1000, "Your goals"),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const intakeIndex =
      Number(data.intakeYear) * 12 + intakeMonthEnum.enumValues.indexOf(data.intakeMonth);
    if (intakeIndex < now.getFullYear() * 12 + now.getMonth()) {
      ctx.addIssue({
        code: "custom",
        path: ["intakeMonth"],
        message: "Choose an intake that hasn't passed yet",
      });
    }
  });

export const respondEnquirySchema = z.object({
  enquiryId: z.uuid("Invalid enquiry"),
  note: optionalText(500, "Note"),
});
