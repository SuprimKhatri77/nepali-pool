"use server";

import z from "zod";
import { getCurrentAdmin } from "../../lib/auth/helpers/getCurrentAdmin";
import { db } from "../../../lib/db";
import { sendEmail } from "../../lib/send-email";

export type SendSessionLinkFormstate = {
  errors?: {
    meetingLink?: string[];
  };
  message: string;
  success: boolean;
  timestamp: number;
  inputs?: {
    meetingLink?: string;
  };
};

export async function sendSessionLink(
  prevState: SendSessionLinkFormstate,
  formData: FormData
): Promise<SendSessionLinkFormstate> {
  const result = await getCurrentAdmin();
  if (!result.success) {
    return {
      success: false,
      message: result.message,
      timestamp: Date.now(),
    };
  }

  const linkSchema = z.object({
    meetingLink: z.string().trim().min(10).nonempty(),
  });

  const validateField = linkSchema.safeParse({
    meetingLink: formData.get("meetingLink") as string,
  });

  if (!validateField.success) {
    return {
      success: false,
      message: "Validation Failed",
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
      errors: validateField.error.flatten().fieldErrors,
    };
  }

  const { meetingLink } = validateField.data;

  try {
    const allSessionUsers = await db.query.meetingSession.findMany();
    if (allSessionUsers.length === 0) {
      return {
        success: false,
        message: "There is no attendee for the session yet",
        timestamp: Date.now(),
      };
    }

    await Promise.all(
      allSessionUsers.map((user) =>
        sendEmail({
          to: user.email,
          subject: "Zoom Meeting Link",
          html: `Click on the link to join the meeting: ${meetingLink}`,
        })
      )
    );

    return {
      success: true,
      message: "Meeting Link sent to all the meeting attendee's",
      timestamp: Date.now(),
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      message: "Something went wrong",
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData),
    };
  }
}
