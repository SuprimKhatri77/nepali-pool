"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../../../lib/db";
import { mentorPaymentDetails, mentorService } from "../../../lib/db/schema";
import { getCurrentMentor } from "../../lib/auth/guards";
import {
  MAX_ACTIVE_SERVICES,
  mentorServiceSchema,
  paymentDetailsSchema,
} from "../../lib/mentor-services/schemas";

export type ServiceFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    priceNpr?: string[];
    durationMinutes?: string[];
  };
  message?: string;
  success?: boolean;
  inputs?: {
    title?: string;
    description?: string;
    priceNpr?: string;
    durationMinutes?: string;
  };
  timestamp?: number;
};

export type PaymentDetailsFormState = {
  errors?: { paymentInstructions?: string[]; paymentQrUrl?: string[] };
  message?: string;
  success?: boolean;
  inputs?: { paymentInstructions?: string };
  timestamp?: number;
};

export type ActionResult = { success: boolean; message: string };

function revalidateServicePages(mentorId: string) {
  revalidatePath("/dashboard/mentor/services");
  revalidatePath(`/mentors/${mentorId}`);
}

async function countActiveServices(mentorId: string) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(mentorService)
    .where(
      and(eq(mentorService.mentorId, mentorId), eq(mentorService.isActive, true)),
    );
  return total;
}

export async function saveMentorService(
  prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const inputs = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    priceNpr: String(formData.get("priceNpr") ?? ""),
    durationMinutes: String(formData.get("durationMinutes") ?? ""),
  };
  const serviceId = String(formData.get("serviceId") ?? "");

  const parsed = mentorServiceSchema.safeParse(inputs);
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Please fix the highlighted fields",
      success: false,
      inputs,
      timestamp: Date.now(),
    };
  }

  try {
    const result = await getCurrentMentor();
    if (!result.success) {
      return { message: result.message, success: false, inputs, timestamp: Date.now() };
    }
    const mentorId = result.mentorRecord.userId;

    if (serviceId) {
      if (!z.uuid().safeParse(serviceId).success) {
        return { message: "Service not found", success: false, inputs, timestamp: Date.now() };
      }
      const [updated] = await db
        .update(mentorService)
        .set(parsed.data)
        .where(
          and(eq(mentorService.id, serviceId), eq(mentorService.mentorId, mentorId)),
        )
        .returning({ id: mentorService.id });
      if (!updated) {
        return { message: "Service not found", success: false, inputs, timestamp: Date.now() };
      }
    } else {
      if ((await countActiveServices(mentorId)) >= MAX_ACTIVE_SERVICES) {
        return {
          message: `You can have at most ${MAX_ACTIVE_SERVICES} active services. Deactivate one first.`,
          success: false,
          inputs,
          timestamp: Date.now(),
        };
      }
      await db.insert(mentorService).values({ ...parsed.data, mentorId });
    }

    revalidateServicePages(mentorId);
    return {
      message: serviceId ? "Service updated" : "Service added",
      success: true,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("saveMentorService failed:", error);
    return {
      message: "Something went wrong. Please try again.",
      success: false,
      inputs,
      timestamp: Date.now(),
    };
  }
}

export async function setMentorServiceActive(
  serviceId: string,
  isActive: boolean,
): Promise<ActionResult> {
  if (!z.uuid().safeParse(serviceId).success || typeof isActive !== "boolean") {
    return { success: false, message: "Invalid request" };
  }

  try {
    const result = await getCurrentMentor();
    if (!result.success) return { success: false, message: result.message };
    const mentorId = result.mentorRecord.userId;

    if (isActive && (await countActiveServices(mentorId)) >= MAX_ACTIVE_SERVICES) {
      return {
        success: false,
        message: `You can have at most ${MAX_ACTIVE_SERVICES} active services.`,
      };
    }

    const [updated] = await db
      .update(mentorService)
      .set({ isActive })
      .where(
        and(eq(mentorService.id, serviceId), eq(mentorService.mentorId, mentorId)),
      )
      .returning({ id: mentorService.id });
    if (!updated) return { success: false, message: "Service not found" };

    revalidateServicePages(mentorId);
    return {
      success: true,
      message: isActive ? "Service is now visible to students" : "Service hidden from students",
    };
  } catch (error) {
    console.error("setMentorServiceActive failed:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function saveMentorPaymentDetails(
  prevState: PaymentDetailsFormState,
  formData: FormData,
): Promise<PaymentDetailsFormState> {
  const raw = {
    paymentInstructions: String(formData.get("paymentInstructions") ?? ""),
    paymentQrUrl: String(formData.get("paymentQrUrl") ?? ""),
  };
  // Echoed back on failure so React's form reset doesn't wipe the mentor's edits.
  const inputs = { paymentInstructions: raw.paymentInstructions };
  const parsed = paymentDetailsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Please fix the highlighted fields",
      success: false,
      inputs,
      timestamp: Date.now(),
    };
  }

  try {
    const result = await getCurrentMentor();
    if (!result.success) {
      return { message: result.message, success: false, inputs, timestamp: Date.now() };
    }
    const mentorId = result.mentorRecord.userId;

    const details = {
      instructions: parsed.data.paymentInstructions,
      qrUrl: parsed.data.paymentQrUrl,
    };
    await db
      .insert(mentorPaymentDetails)
      .values({ mentorId, ...details })
      .onConflictDoUpdate({ target: mentorPaymentDetails.mentorId, set: details });

    revalidateServicePages(mentorId);
    return { message: "Payment details saved", success: true, timestamp: Date.now() };
  } catch (error) {
    console.error("saveMentorPaymentDetails failed:", error);
    return {
      message: "Something went wrong. Please try again.",
      success: false,
      inputs,
      timestamp: Date.now(),
    };
  }
}
