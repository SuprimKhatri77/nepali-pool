"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { authClient } from "../../../../../../server/lib/auth/auth-client";
import {
  FormState,
  searchUserInDB,
} from "../../../../../../server/actions/searchUserInDB";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { sendResetPasswordLink } from "../../../../../../server/actions/sendResetPasswordLink";

export default function ForgotPasswordPage() {
  const initialState: FormState = {
    errors: {},
  } as FormState;

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    searchUserInDB,
    initialState
  );
  const [email, setEmail] = useState<string>("");
  const params = useSearchParams();
  const error = params.get("error") as string;

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      setTimeout(() => {
        setEmail("");
      }, 300);
    }
    if (!state.success && state.message) {
      toast(state.message);
    }
  }, [state.message, state.success, state.timestamp]);

  const handleClick = async () => {
    if (state.success) {
      const result = await sendResetPasswordLink(email);
      if (!result.success) {
        toast.error(
          result.message ||
            "Too many reset password request. Please try again later!"
        );
      } else {
        toast.success(
          result.message || "A reset password link has been sent to your email."
        );
      }
    }
  };

  return (
    <>
      {error ? (
        <>
          {error === "invalid_token" && (
            <div className="flex flex-col min-h-screen items-center justify-center gap-5">
              <p className="text-red-500">
                Invalid token, please request a new one.
              </p>
              <Button asChild>
                <Link href="/login/forgot-password">Request new link</Link>
              </Button>
            </div>
          )}
          {error === "expired_token" && (
            <div className="flex flex-col min-h-screen items-center justify-center gap-5">
              <p className="text-red-500">This reset link has expired.</p>
              <Button asChild>
                <Link href="/login/forgot-password">Request new link</Link>
              </Button>
            </div>
          )}
          {error === "missing_token" && (
            <div className="flex flex-col min-h-screen items-center justify-center gap-5">
              <p className="text-red-500">Missing token in reset URL.</p>
              <Button asChild>
                <Link href="/login/forgot-password">Request new link</Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
          <form
            action={formAction}
            className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
          >
            <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
              <div>
                <Link
                  href="/"
                  aria-label="go home"
                  className="text-2xl font-bold"
                >
                  Nepali Pool
                </Link>
                <h1 className="mb-1 mt-4 text-lg font-semibold">
                  Recover Password
                </h1>
                <p className="text-sm">
                  Enter your email to receive a reset link
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm">
                    Email
                  </Label>
                  <Input
                    type="email"
                    required
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="name@example.com"
                  />
                </div>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={isPending}
                  onClick={handleClick}
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  We'll send you a link to reset your password.
                </p>
              </div>
            </div>

            <div className="p-3">
              <p className="text-accent-foreground text-center text-sm">
                Remembered your password?
                <Button asChild variant="link" className="px-2">
                  <Link href="/login">Log in</Link>
                </Button>
              </p>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
