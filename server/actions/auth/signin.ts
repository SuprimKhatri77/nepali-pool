"use server";

import z from "zod";
import { auth } from "../../lib/auth/auth";
import { APIError } from "better-auth/api";

export type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  timestamp?: number;
  redirectTo?: string;
  inputs?: {
    email?: string;
    password?: string;
  };
};

export async function SignIn(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const userData = z.object({
    email: z.email().nonempty(),
    password: z.string().min(1, "Password is required").nonempty(),
  });

  const validateFields = userData.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Failed to login.",
      success: false,
      timestamp: Date.now(),
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  const { email, password } = validateFields.data;

  try {
    // const [userRecord] = await db
    //   .select()
    //   .from(user)
    //   .where(eq(user.email, email));

    // if (!userRecord) {
    //   return {
    //     success: false,
    //     message: "User doesn't exist",
    //     errors: {
    //       email: ["User doesn't exist"],
    //     },
    //     timestamp: Date.now(),
    //   };
    // }
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    // if (!userRecord.emailVerified) {
    //   return {
    //     redirectTo: `/verify-email`,
    //     timestamp: Date.now(),
    //   };
    // }

    // await redirectByRole(userRecord);

    return {
      success: true,
      message: "Redirecting...",
      timestamp: Date.now(),
      redirectTo: "/connect-student",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
        timestamp: Date.now(),
        inputs: Object.fromEntries(formData),
      };
    }
    throw error;
  }
}
