"use server";

import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { mentorProfile, user } from "../../lib/db/schema";
import { sendEmail } from "../lib/send-email";

export type FormState = {
  errors?: {
    applicationId?: string;
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

export async function AcceptMentorApplication(
  prevState: FormState,
  formData: FormData
) {
  const applicationId = formData.get("applicationId") as string;
  if (!applicationId) {
    return {
      errors: {
        applicationId: "Application ID is required",
      },
      message: "Application ID not found!",
      success: false,
    };
  }

  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, applicationId));
    if (!userRecord) {
      return {
        errors: {},
        message: "User Record not found!",
        success: false,
        redirectTo: "/sign-up",
      };
    }
    await db
      .update(mentorProfile)
      .set({
        verifiedStatus: "accepted",
        updatedAt: new Date(),
      })
      .where(eq(mentorProfile.userId, applicationId));
    await sendEmail({
      to: userRecord.email,
      subject: "Mentor Application Status",
      text: "Congratulations!, Your Mentor Application has been accepted.",
      html: `You can now Access the Mentor Dashboard and Its features.`,
    });
    return {
      erros: {},
      message: "Application Accepted!",
      success: true,
      redirectTo: `/admin/mentor-applications`,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      errors: {
        applicationId: "Invalid error!",
      },
      message: "Something went wrong!",
      success: true,
    };
  }
}

export async function RejectMentorApplication(
  prevState: FormState,
  formData: FormData
) {
  const applicationId = formData.get("applicationId") as string;
  if (!applicationId) {
    return {
      errors: {
        applicationId: "Application ID is required",
      },
      message: "Application ID not found!",
      success: false,
    };
  }

  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, applicationId));
    if (!userRecord) {
      return {
        errors: {},
        message: "User Record not found!",
        success: false,
        redirectTo: "/sign-up",
      };
    }
    await db
      .update(mentorProfile)
      .set({
        verifiedStatus: "rejected",
        updatedAt: new Date(),
      })
      .where(eq(mentorProfile.userId, applicationId));
    await sendEmail({
      to: userRecord.email,
      subject: "Mentor Application Status",
      html: "Sorry!, Your Mentor Application has been rejected.Thanks for applying, Keep your head up and keep working!",
    });
    return {
      erros: {},
      message: "Application Rejected!",
      success: true,
      redirectTo: "/admin/mentor-applications",
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      errors: {
        applicationId: "Invalid error!",
      },
      message: "Something went wrong!",
      success: true,
    };
  }
}
