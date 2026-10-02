"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";
import { chats, serviceBooking, user } from "../../../lib/db/schema";
import { getCurrentMentor } from "../../lib/auth/helpers/getCurrentMentor";
import { getCurrentStudent } from "../../lib/auth/helpers/getCurrentStudent";
import { rejectBookingSchema } from "../../lib/mentor-services/schemas";
import {
  notifyStudentBookingConfirmed,
  notifyStudentBookingRejected,
} from "../../lib/mentor-services/booking-emails";

export type BookingActionResult = { success: boolean; message: string };

const bookingIdSchema = z.uuid();

// Notifications go to the student's verified account email; the email on the
// booking form is free text and only meant for the mentor to contact them.
async function getStudentAccount(studentId: string) {
  const [account] = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, studentId));
  return account;
}

function revalidateBookingPages() {
  revalidatePath("/bookings");
  revalidatePath("/dashboard/mentor");
  revalidatePath("/dashboard/mentor/bookings");
}

// All transitions below are a single conditional UPDATE (id + owner + expected
// status), so double clicks / two tabs / a student cancelling at the same time
// can't both win.

export async function confirmServiceBooking(
  bookingId: string,
): Promise<BookingActionResult> {
  if (!bookingIdSchema.safeParse(bookingId).success) {
    return { success: false, message: "Invalid booking" };
  }
  try {
    const result = await getCurrentMentor();
    if (!result.success) return { success: false, message: result.message };
    const mentor = result.mentorRecord;

    const booking = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(serviceBooking)
        .set({ status: "confirmed", verifiedAt: new Date() })
        .where(
          and(
            eq(serviceBooking.id, bookingId),
            eq(serviceBooking.mentorId, mentor.userId),
            eq(serviceBooking.status, "pending"),
          ),
        )
        .returning();
      if (!updated) return null;

      // Make sure the pair can talk in-app once the booking is confirmed,
      // including re-activating a chat that had expired.
      await tx
        .insert(chats)
        .values({
          studentId: updated.studentId,
          mentorId: updated.mentorId,
          status: "active",
        })
        .onConflictDoUpdate({
          target: [chats.studentId, chats.mentorId],
          set: { status: "active" },
        });
      return updated;
    });

    if (!booking) {
      return {
        success: false,
        message: "This booking is no longer pending.",
      };
    }

    after(async () => {
      const student = await getStudentAccount(booking.studentId);
      if (!student) return;
      await notifyStudentBookingConfirmed({
        to: student.email,
        studentName: booking.fullName,
        mentorName: mentor.user.name,
        booking,
      });
    });
    revalidateBookingPages();
    revalidatePath("/chats");
    return { success: true, message: "Payment verified and booking confirmed" };
  } catch (error) {
    console.error("confirmServiceBooking failed:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function rejectServiceBooking(
  bookingId: string,
  reason: string,
): Promise<BookingActionResult> {
  const parsed = rejectBookingSchema.safeParse({ bookingId, reason });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid request",
    };
  }
  try {
    const result = await getCurrentMentor();
    if (!result.success) return { success: false, message: result.message };
    const mentor = result.mentorRecord;

    const [booking] = await db
      .update(serviceBooking)
      .set({
        status: "rejected",
        rejectionReason: parsed.data.reason,
        verifiedAt: new Date(),
      })
      .where(
        and(
          eq(serviceBooking.id, parsed.data.bookingId),
          eq(serviceBooking.mentorId, mentor.userId),
          eq(serviceBooking.status, "pending"),
        ),
      )
      .returning();
    if (!booking) {
      return {
        success: false,
        message: "This booking is no longer pending.",
      };
    }

    after(async () => {
      const student = await getStudentAccount(booking.studentId);
      if (!student) return;
      await notifyStudentBookingRejected({
        to: student.email,
        studentName: booking.fullName,
        mentorName: mentor.user.name,
        reason: parsed.data.reason,
        booking,
      });
    });
    revalidateBookingPages();
    return { success: true, message: "Booking rejected" };
  } catch (error) {
    console.error("rejectServiceBooking failed:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function completeServiceBooking(
  bookingId: string,
): Promise<BookingActionResult> {
  if (!bookingIdSchema.safeParse(bookingId).success) {
    return { success: false, message: "Invalid booking" };
  }
  try {
    const result = await getCurrentMentor();
    if (!result.success) return { success: false, message: result.message };

    const [booking] = await db
      .update(serviceBooking)
      .set({ status: "completed", completedAt: new Date() })
      .where(
        and(
          eq(serviceBooking.id, bookingId),
          eq(serviceBooking.mentorId, result.mentorRecord.userId),
          eq(serviceBooking.status, "confirmed"),
        ),
      )
      .returning({ id: serviceBooking.id });
    if (!booking) {
      return {
        success: false,
        message: "Only confirmed bookings can be marked as completed.",
      };
    }

    revalidateBookingPages();
    return { success: true, message: "Booking marked as completed" };
  } catch (error) {
    console.error("completeServiceBooking failed:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function cancelServiceBooking(
  bookingId: string,
): Promise<BookingActionResult> {
  if (!bookingIdSchema.safeParse(bookingId).success) {
    return { success: false, message: "Invalid booking" };
  }
  try {
    const result = await getCurrentStudent();
    if (!result.success) return { success: false, message: result.message };

    const [booking] = await db
      .update(serviceBooking)
      .set({ status: "cancelled", cancelledAt: new Date() })
      .where(
        and(
          eq(serviceBooking.id, bookingId),
          eq(serviceBooking.studentId, result.studentRecord.userId),
          eq(serviceBooking.status, "pending"),
        ),
      )
      .returning({ id: serviceBooking.id });
    if (!booking) {
      return {
        success: false,
        message: "Only bookings that are still pending can be cancelled.",
      };
    }

    revalidateBookingPages();
    return { success: true, message: "Booking cancelled" };
  } catch (error) {
    console.error("cancelServiceBooking failed:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
