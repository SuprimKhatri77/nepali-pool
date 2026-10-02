"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";
import { mentorEnquiry, mentorProfile } from "../../../lib/db/schema";
import { getCurrentStudent } from "../../lib/auth/helpers/getCurrentStudent";
import { createEnquirySchema } from "../../lib/mentor-services/schemas";
import { isUniqueViolation } from "../../lib/mentor-services/pg-error";
import { generateReferenceCode } from "../../lib/mentor-services/reference-code";
import { notifyMentorOfNewEnquiry } from "../../lib/mentor-services/enquiry-emails";

// Each enquiry emails the mentor, so cap how often a student can send them
// (create → withdraw → create would otherwise be unlimited).
const PER_MENTOR_LIMIT = { max: 3, windowMs: 7 * 24 * 60 * 60 * 1000 };
const DAILY_LIMIT = { max: 10, windowMs: 24 * 60 * 60 * 1000 };

async function countRecentEnquiries(
  studentId: string,
  windowMs: number,
  mentorId?: string,
) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(mentorEnquiry)
    .where(
      and(
        eq(mentorEnquiry.studentId, studentId),
        mentorId ? eq(mentorEnquiry.mentorId, mentorId) : undefined,
        gte(mentorEnquiry.createdAt, new Date(Date.now() - windowMs)),
      ),
    );
  return total;
}

const FIELDS = [
  "fullName",
  "email",
  "whatsappNumber",
  "question",
  "qualification",
  "targetCourse",
  "englishLevel",
  "englishTestScore",
  "intakeMonth",
  "intakeYear",
  "budgetReadiness",
  "goals",
] as const;
export type EnquiryField = (typeof FIELDS)[number];

// The form submits without React's automatic reset, so typed values stay put
// and don't need to be echoed back.
export type EnquiryFormState = {
  errors?: Partial<Record<EnquiryField | "mentorId", string[]>>;
  message?: string;
  success?: boolean;
  timestamp?: number;
};

export async function createMentorEnquiry(
  prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const inputs = Object.fromEntries(
    FIELDS.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as Record<EnquiryField, string>;
  const fail = (message: string): EnquiryFormState => ({
    message,
    success: false,
    timestamp: Date.now(),
  });

  const parsed = createEnquirySchema.safeParse({
    ...inputs,
    mentorId: String(formData.get("mentorId") ?? ""),
  });
  if (!parsed.success) {
    return {
      ...fail("Please fix the highlighted fields"),
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { mentorId, ...data } = parsed.data;

  let referenceCode = "";
  try {
    const result = await getCurrentStudent();
    if (!result.success)
      return fail("Please log in with a student account to ask a question.");
    const student = result.studentRecord;

    const mentor = await db.query.mentorProfile.findFirst({
      where: and(
        eq(mentorProfile.userId, mentorId),
        eq(mentorProfile.verifiedStatus, "accepted"),
      ),
      with: { user: { columns: { name: true, email: true } } },
    });
    if (!mentor) return fail("This mentor isn't available right now.");

    const [toThisMentor, today] = await Promise.all([
      countRecentEnquiries(
        student.userId,
        PER_MENTOR_LIMIT.windowMs,
        mentor.userId,
      ),
      countRecentEnquiries(student.userId, DAILY_LIMIT.windowMs),
    ]);
    if (toThisMentor >= PER_MENTOR_LIMIT.max) {
      return fail(
        "You've sent this mentor several enquiries this week. Please wait for a reply or try again in a few days.",
      );
    }
    if (today >= DAILY_LIMIT.max) {
      return fail(
        "You've reached today's enquiry limit. Please try again tomorrow.",
      );
    }

    // Retry only on the (astronomically unlikely) reference code collision.
    for (let attempt = 0; attempt < 3 && !referenceCode; attempt++) {
      const candidate = generateReferenceCode("NPE");
      try {
        await db.insert(mentorEnquiry).values({
          ...data,
          referenceCode: candidate,
          mentorId: mentor.userId,
          studentId: student.userId,
        });
        referenceCode = candidate;
      } catch (error) {
        if (isUniqueViolation(error, "unique_open_enquiry_per_mentor")) {
          return fail(
            "You already have an open enquiry with this mentor. Wait for their reply, or withdraw it from My Bookings.",
          );
        }
        if (!isUniqueViolation(error, "mentor_enquiry_reference_code_unique")) {
          throw error;
        }
      }
    }
    if (!referenceCode)
      throw new Error("Could not generate a unique reference code");

    after(() =>
      notifyMentorOfNewEnquiry({
        to: mentor.user.email,
        mentorName: mentor.user.name,
        studentName: data.fullName,
        referenceCode,
        question: data.question,
      }),
    );

    revalidatePath("/bookings");
    revalidatePath("/dashboard/mentor");
    revalidatePath("/dashboard/mentor/enquiries");
  } catch (error) {
    console.error("createMentorEnquiry failed:", error);
    return fail("Something went wrong. Please try again.");
  }

  // Redirect from the action (outside try: redirect() throws) so the enquiry
  // page isn't re-rendered into its "already asked" state first.
  redirect(`/bookings?enquired=${referenceCode}`);
}
