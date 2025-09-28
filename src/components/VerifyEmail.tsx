"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { resendEmailVerification } from "../../server/actions/email-verification/resendEmailVerification";

export default function VerifyEmail({ email }: { email: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const from = params.get("from");

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!email) {
      toast.error("Email not found. Please try logging in again.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resendEmailVerification();
      if (!result.success) {
        toast.error(
          result.message || "Too many request. Please try again later!"
        );
      } else {
        toast.success(result.message || "Verification email sent!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (from === "signup") {
    return (
      <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
        <h1 className="text-xl font-bold">Verification email sent! 🎉</h1>
        <p>
          We've sent a link to <strong>{email}</strong>. Please check your inbox
          and click the link to continue.
        </p>
        <p className="text-sm text-muted-foreground">Didn't get the email?</p>
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend Verification Email"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
      <h1 className="text-xl font-bold">Email verification required</h1>
      <p>
        Your email <strong>{email}</strong> is not verified. Please check your
        inbox and click the verification link.
      </p>
      <p className="text-sm text-muted-foreground">Didn't get the email?</p>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Sending..." : "Resend Verification Email"}
      </Button>
      <Button variant="outline" onClick={() => router.push("/login")}>
        Back to Login
      </Button>
    </div>
  );
}
