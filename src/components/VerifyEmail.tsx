"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { resendEmailVerification } from "../../server/actions/email-verification/resendEmailVerification";
import { authClient } from "../../server/lib/auth/auth-client";
import { Spinner } from "./ui/spinner";

export default function VerifyEmail({ email }: { email: string }) {
  const params = useSearchParams();
  const router = useRouter();

  const message = params.get("message");
  const from = params.get("from");
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);

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
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (message) {
      toast.info(decodeURIComponent(message), { position: "top-right", action:{
        label:"X",
        onClick: () => toast.dismiss()
      },
      duration: 3000, // 3 seconds
    });

      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState(null, "", url.toString());
    }
  }, [message]);

  const handleLogout = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });

    setIsPending(false);
  };

  if (from === "signup") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardHeader className="space-y-3 text-center">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Verification email sent! 🎉
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              We&apos;ve sent a link to{" "}
              <span className="font-medium text-green-700">{email}</span>.
              Please check your inbox and click the link to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-center text-gray-700">
                Didn&apos;t receive the email?
              </p>
            </div>
            <Button
              onClick={handleClick}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Wrong email address?
                </span>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Logout and try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Email verification required
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Your email{" "}
            <span className="font-medium text-green-700">{email}</span> is not
            verified. Please check your inbox and click the verification link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-center text-gray-700">
              Didn&apos;t receive the email?
            </p>
          </div>
          <Button
            onClick={handleClick}
            disabled={isLoading || isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Wrong email address?
              </span>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isPending || isLoading}
          >
            {isPending ? <Spinner /> : "Logout and try again"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
