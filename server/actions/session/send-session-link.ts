"use server";

import { createHash } from "node:crypto";
import z from "zod";
import { getCurrentAdmin } from "../../lib/auth/guards";
import { db } from "../../../lib/db";
import { Resend } from "resend";
import { MeetingInvite } from "@/modules/email-templates/meeting-invite-email";

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
const resend = new Resend(process.env.RESEND_API_KEY as string);
const BATCH_SIZE = 100;
const RATE_LIMIT_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  // The link goes into an email to every attendee: only a real web link.
  const linkSchema = z.object({
    meetingLink: z
      .string()
      .trim()
      .pipe(
        z.url({
          protocol: /^https?$/,
          hostname: z.regexes.domain,
          error: "Enter the full meeting link, starting with https://",
        }),
      ),
  });

  const validateField = linkSchema.safeParse({
    meetingLink: formData.get("meetingLink") as string,
  });

  if (!validateField.success) {
    return {
      success: false,
      message: "Validation Failed",
      timestamp: Date.now(),
      inputs: { meetingLink: String(formData.get("meetingLink") ?? "") },
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

    // One API call per 100 attendees (Resend's batch limit), sent one after
    // another: a request per attendee in parallel runs into the rate limit.
    // Resend reports API failures in the result rather than throwing, so
    // count them instead of assuming every send worked.
    let failed = 0;
    for (let i = 0; i < allSessionUsers.length; i += BATCH_SIZE) {
      const chunk = allSessionUsers.slice(i, i + BATCH_SIZE);
      // Same link to the same people within Resend's 24h idempotency window
      // is one send: a retry (or a second click) can't email them twice.
      const idempotencyKey = `session-link:${createHash("sha256")
        .update(meetingLink)
        .update(chunk.map((attendee) => attendee.id).join(","))
        .digest("hex")}`;
      const emails = chunk.map((attendee) => ({
        from: "Nepalipool <noreply@nepalipool.com>",
        to: attendee.email,
        subject:
          "Meeting Invitation: Get to know what's It's like to be in Japan.",
        react: MeetingInvite({
          url: meetingLink,
          hostName: "Bigyan Lama",
          attendeeEmail: attendee.email,
          duration: "40minutes",
          date: "November 7 2025",
          time: "4:00 pm",
          meetingTitle: "Japan query session",
        }),
      }));

      let { error } = await resend.batch.send(emails, { idempotencyKey });
      // Back off and retry when Resend rate-limits us (2 requests/s by
      // default); anything else is a real failure.
      for (
        let attempt = 1;
        error?.name === "rate_limit_exceeded" && attempt <= RATE_LIMIT_RETRIES;
        attempt++
      ) {
        await sleep(attempt * 1000);
        ({ error } = await resend.batch.send(emails, { idempotencyKey }));
      }
      if (error) {
        console.error("sendSessionLink: batch failed:", error);
        failed += chunk.length;
      }
    }

    const total = allSessionUsers.length;
    if (failed > 0) {
      return {
        success: false,
        message: `Sent to ${total - failed} of ${total} attendees; ${failed} failed (see the server log). Sending again emails everyone.`,
        timestamp: Date.now(),
        inputs: { meetingLink },
      };
    }

    return {
      success: true,
      message: `Meeting link sent to all ${total} attendees`,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("sendSessionLink failed:", error);
    return {
      success: false,
      message: "Something went wrong",
      timestamp: Date.now(),
      inputs: { meetingLink },
    };
  }
}
