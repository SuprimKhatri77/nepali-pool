"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { sendResetPasswordLink } from "../../../../server/actions/reset-password/sendResetPasswordLink";
import z from "zod";
import { Spinner } from "@/components/ui/spinner";

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
    } catch {
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
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center">
            <h1
              aria-label="go home"
              className="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors"
            >
              Nepali Pool
            </h1>
          </div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <CardTitle className="text-center text-2xl font-semibold text-gray-900">
            Recover Password
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600">
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
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
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            disabled={disableButton || !isValidEmail}
            onClick={handleClick}
          >
            {disableButton ? <Spinner /> : "Send Reset Link"}
          </Button>
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-center text-gray-700">
              We&apos;ll send you a link to reset your password.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-200 bg-gray-50 py-4">
          <p className="text-sm text-gray-600">
            Remembered your password?
            <Button
              asChild
              variant="link"
              className="px-2 text-green-600 hover:text-green-700"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
