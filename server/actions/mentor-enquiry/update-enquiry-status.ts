"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";
import { chats, mentorEnquiry, user } from "../../../lib/db/schema";
import { getCurrentMentor } from "../../lib/auth/guards";
import { getCurrentStudent } from "../../lib/auth/guards";
import { respondEnquirySchema } from "../../lib/mentor-services/schemas";
import {
  notifyStudentEnquiryAccepted,
  notifyStudentEnquiryDeclined,
} from "../../lib/mentor-services/enquiry-emails";

export type EnquiryActionResult = {
  success: boolean;
  message: string;
  // Returned on accept so the mentor can contact the student straight away.
  contact?: { email: string; whatsappNumber: string };
};

const STALE_MESSAGE = "This enquiry has already been answered or withdrawn.";

function revalidateEnquiryPages() {
  revalidatePath("/dashboard/mentor");
  revalidatePath("/dashboard/mentor/enquiries");
}

// Notifications go to the student's verified account email, not the free-text
// contact email on the form.
async function getStudentAccountEmail(studentId: string) {
  const [account] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, studentId));
  return account?.email;
}

// Each transition is a single conditional UPDATE (id + owner + status 'new'),
// so a mentor answering while the student withdraws can't both succeed.

export async function respondToEnquiry(
  enquiryId: string,
  decision: "accepted" | "declined",
  note: string,
): Promise<EnquiryActionResult> {
  const parsed = respondEnquirySchema.safeParse({ enquiryId, note });
  if (!parsed.success || (decision !== "accepted" && decision !== "declined")) {
    return {
      success: false,
      message: parsed.error?.issues[0]?.message ?? "Invalid request",
    };
  }
  try {
    const result = await getCurrentMentor();
    if (!result.success) return { success: false, message: result.message };
    const mentor = result.mentorRecord;

    const enquiry = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(mentorEnquiry)
        .set({
          status: decision,
          mentorNote: parsed.data.note,
          respondedAt: new Date(),
        })
        .where(
          and(
            eq(mentorEnquiry.id, parsed.data.enquiryId),
            eq(mentorEnquiry.mentorId, mentor.userId),
            eq(mentorEnquiry.status, "new"),
          ),
        )
        .returning();
      if (updated && decision === "accepted") {
        // Accepting opens (or re-activates) the in-app chat for the pair.
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
      }
      return updated ?? null;
    });
    if (!enquiry) return { success: false, message: STALE_MESSAGE };

    after(async () => {
      const to = await getStudentAccountEmail(enquiry.studentId);
      if (!to) return;
      const args = {
        to,
        studentName: enquiry.fullName,
        mentorName: mentor.user.name,
        referenceCode: enquiry.referenceCode,
        mentorNote: enquiry.mentorNote,
      };
      await (decision === "accepted"
        ? notifyStudentEnquiryAccepted(args)
        : notifyStudentEnquiryDeclined(args));
    });

    revalidateEnquiryPages();
    if (decision === "accepted") revalidatePath("/chats");
    return decision === "accepted"
      ? {
          success: true,
          message: "Enquiry accepted",
          contact: {
            email: enquiry.email,
            whatsappNumber: enquiry.whatsappNumber,
          },
        }
      : { success: true, message: "Enquiry declined" };
  } catch (error) {
    console.error("respondToEnquiry failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function withdrawEnquiry(
  enquiryId: string,
): Promise<EnquiryActionResult> {
  if (!z.uuid().safeParse(enquiryId).success) {
    return { success: false, message: "Invalid enquiry" };
  }
  try {
    const result = await getCurrentStudent();
    if (!result.success) return { success: false, message: result.message };

    const [enquiry] = await db
      .update(mentorEnquiry)
      .set({ status: "withdrawn", withdrawnAt: new Date() })
      .where(
        and(
          eq(mentorEnquiry.id, enquiryId),
          eq(mentorEnquiry.studentId, result.studentRecord.userId),
          eq(mentorEnquiry.status, "new"),
        ),
      )
      .returning({ id: mentorEnquiry.id });
    if (!enquiry) return { success: false, message: STALE_MESSAGE };

    revalidateEnquiryPages();
    return { success: true, message: "Enquiry withdrawn" };
  } catch (error) {
    console.error("withdrawEnquiry failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
