"use server";

import { and, eq, inArray } from "drizzle-orm";
import { after } from "next/server";
import { db } from "../../../lib/db";
import { mentorProfile, user } from "../../../lib/db/schema";
import { sendEmail } from "../../lib/send-email";
import { getCurrentAdmin } from "../../lib/auth/guards";

export type FormState = {
  errors?: {
    applicationId?: string;
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

type Decision = "accepted" | "rejected";

// A pending application can go either way; a rejected one can still be
// accepted later (the applications page lists both), but an accepted mentor
// isn't rejected from here.
const DECIDABLE_FROM: Record<Decision, ("pending" | "rejected")[]> = {
  accepted: ["pending", "rejected"],
  rejected: ["pending"],
};

const EMAIL: Record<Decision, { message: string; html: string }> = {
  accepted: {
    message: "Application Accepted!",
    html: "Congratulations! Your mentor application has been accepted. You can now access the mentor dashboard and its features.",
  },
  rejected: {
    message: "Application Rejected!",
    html: "Sorry, your mentor application has been rejected. Thanks for applying, keep your head up and keep working!",
  },
};

// One conditional UPDATE, so a second tab or a double click finds nothing to
// change instead of deciding (and emailing) twice. The email goes out after
// the response: a mail-server hiccup can't turn a saved decision into an
// error.
async function decide(formData: FormData, decision: Decision): Promise<FormState> {
  const applicationId = formData.get("applicationId");
  if (typeof applicationId !== "string" || !applicationId) {
    return {
      errors: { applicationId: "Application ID is required" },
      message: "Application ID not found!",
      success: false,
    };
  }

  try {
    const result = await getCurrentAdmin();
    if (!result.success) return result;

    const [updated] = await db
      .update(mentorProfile)
      .set({ verifiedStatus: decision, updatedAt: new Date() })
      .where(
        and(
          eq(mentorProfile.userId, applicationId),
          inArray(mentorProfile.verifiedStatus, DECIDABLE_FROM[decision]),
        ),
      )
      .returning({ userId: mentorProfile.userId });
    if (!updated) {
      return {
        message: "This application was already decided or no longer exists.",
        success: false,
      };
    }

    after(async () => {
      try {
        const [applicant] = await db
          .select({ email: user.email })
          .from(user)
          .where(eq(user.id, updated.userId));
        if (!applicant) return;
        await sendEmail({
          to: applicant.email,
          subject: "Mentor Application Status",
          html: EMAIL[decision].html,
        });
      } catch (error) {
        console.error("Mentor application email failed:", error);
      }
    });

    return {
      errors: {},
      message: EMAIL[decision].message,
      success: true,
      redirectTo: "/admin/mentor-applications",
    };
  } catch (error) {
    console.error(`Mentor application ${decision} failed:`, error);
    return {
      errors: { applicationId: "Invalid error!" },
      message: "Something went wrong!",
      success: false,
    };
  }
}

export async function AcceptMentorApplication(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return decide(formData, "accepted");
}

export async function RejectMentorApplication(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return decide(formData, "rejected");
}
