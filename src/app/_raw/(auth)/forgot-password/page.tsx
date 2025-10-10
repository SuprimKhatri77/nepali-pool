"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { sendResetPasswordLink } from "../../../../../server/actions/reset-password/sendResetPasswordLink";
import z from "zod";

const emailSchema = z.string().email("Please enter a valid email");
type EmailType = z.infer<typeof emailSchema>;
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<EmailType>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  useEffect(() => {
    try {
      emailSchema.parse(email);
      setIsValidEmail(true);
    } catch (err) {
      setIsValidEmail(false);
    }
  }, [email]);

  const handleClick = async () => {
    setDisableButton(true);
    try {
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
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Something went wrong");
    } finally {
      setEmail("");
      setDisableButton(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home" className="text-2xl font-bold">
              Nepali Pool
            </Link>
            <h1 className="mb-1 mt-4 text-lg font-semibold">
              Recover Password
            </h1>
            <p className="text-sm">Enter your email to receive a reset link</p>
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
              disabled={disableButton || !isValidEmail}
              onClick={handleClick}
            >
              {disableButton ? "Sending..." : "Send Reset Link"}
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
      </div>
    </section>
  );
}
