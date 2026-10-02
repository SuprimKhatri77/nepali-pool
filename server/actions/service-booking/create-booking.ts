"use server";

import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "../../../lib/db";
import { mentorService, serviceBooking } from "../../../lib/db/schema";
import { getCurrentStudent } from "../../lib/auth/helpers/getCurrentStudent";
import { createBookingSchema } from "../../lib/mentor-services/schemas";
import { isUniqueViolation } from "../../lib/mentor-services/pg-error";
import { notifyMentorOfNewBooking } from "../../lib/mentor-services/booking-emails";

type BookingField =
  | "fullName"
  | "email"
  | "whatsappNumber"
  | "message"
  | "paymentReference"
  | "paymentProofUrl";

export type BookingFormState = {
  errors?: Partial<Record<BookingField | "serviceId", string[]>>;
  message?: string;
  success?: boolean;
  inputs?: Partial<Record<BookingField, string>>;
  timestamp?: number;
};

// No 0/O/1/I so codes are easy to read out over the phone.
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateReferenceCode() {
  let code = "NPB-";
  for (let i = 0; i < 8; i++) code += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return code;
}

export async function createServiceBooking(
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const inputs = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
    message: String(formData.get("message") ?? ""),
    paymentReference: String(formData.get("paymentReference") ?? ""),
    paymentProofUrl: String(formData.get("paymentProofUrl") ?? ""),
  };
  const fail = (message: string): BookingFormState => ({
    message,
    success: false,
    inputs,
    timestamp: Date.now(),
  });

  const parsed = createBookingSchema.safeParse({
    ...inputs,
    serviceId: String(formData.get("serviceId") ?? ""),
  });
  if (!parsed.success) {
    return {
      ...fail("Please fix the highlighted fields"),
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const data = parsed.data;

  let referenceCode = "";
  try {
    const result = await getCurrentStudent();
    if (!result.success) return fail("Please log in with a student account to book.");
    const student = result.studentRecord;

    const service = await db.query.mentorService.findFirst({
      where: eq(mentorService.id, data.serviceId),
      with: { mentorProfile: { with: { user: true, paymentDetails: true } } },
    });
    const mentor = service?.mentorProfile;
    if (!service || !service.isActive || mentor?.verifiedStatus !== "accepted") {
      return fail("This service is no longer available.");
    }
    if (!mentor.paymentDetails?.instructions && !mentor.paymentDetails?.qrUrl) {
      return fail("This mentor isn't accepting bookings right now.");
    }

    // Retry only on the (astronomically unlikely) reference code collision.
    for (let attempt = 0; attempt < 3 && !referenceCode; attempt++) {
      const candidate = generateReferenceCode();
      try {
        await db.insert(serviceBooking).values({
          referenceCode: candidate,
          serviceId: service.id,
          mentorId: mentor.userId,
          studentId: student.userId,
          serviceTitle: service.title,
          priceNpr: service.priceNpr,
          fullName: data.fullName,
          email: data.email,
          whatsappNumber: data.whatsappNumber,
          message: data.message,
          paymentReference: data.paymentReference,
          paymentProofUrl: data.paymentProofUrl,
        });
        referenceCode = candidate;
      } catch (error) {
        if (isUniqueViolation(error, "unique_pending_booking_per_service")) {
          return fail(
            "You already have a pending booking for this service. Wait for the mentor to verify it, or cancel it from My Bookings.",
          );
        }
        if (!isUniqueViolation(error, "service_booking_reference_code_unique")) {
          throw error;
        }
      }
    }
    if (!referenceCode) throw new Error("Could not generate a unique reference code");

    // Send after the response so SMTP latency doesn't slow the form down.
    after(() =>
      notifyMentorOfNewBooking({
        to: mentor.user.email,
        mentorName: mentor.user.name,
        studentName: data.fullName,
        booking: {
          referenceCode,
          serviceTitle: service.title,
          priceNpr: service.priceNpr,
        },
      }),
    );

    revalidatePath("/bookings");
    revalidatePath("/dashboard/mentor");
    revalidatePath("/dashboard/mentor/bookings");
  } catch (error) {
    console.error("createServiceBooking failed:", error);
    return fail("Something went wrong. Please try again.");
  }

  // Redirect from the action (outside try: redirect() throws) so the client
  // never re-renders this booking page, which would now show "Already booked".
  redirect(`/bookings?booked=${referenceCode}`);
}
