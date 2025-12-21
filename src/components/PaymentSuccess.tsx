"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentType = searchParams.get("payment_type");
  const [loading, setLoading] = useState(true);
  // const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      setTimeout(() => {
        setLoading(false)
      }, 0);;
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Processing Payment...
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Please wait while we confirm your transaction
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Payment Successful! 🎉
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Your payment has been processed successfully. You can now access
            your purchased features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentType === "video_call" && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Next Steps
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    We&apos;ll send you an email confirmation shortly. You&apos;ll receive
                    another email once your mentor schedules the video call.
                    Please check your inbox regularly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentType === "chat_subscription" && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Chat Access Activated
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    You can now start chatting with your mentor. Click the
                    button below to begin your conversation.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Link href="/dashboard/student">Go to Dashboard</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link
                href={
                  paymentType === "video_call"
                    ? "/video-call"
                    : paymentType === "chat_subscription"
                      ? "/chats"
                      : "/"
                }
              >
                {paymentType === "video_call"
                  ? "View Video Call Details"
                  : paymentType === "chat_subscription"
                    ? "Start Chatting with Mentor"
                    : "Back to Home"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
