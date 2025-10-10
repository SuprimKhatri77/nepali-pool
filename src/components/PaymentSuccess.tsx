"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentType = searchParams.get("payment_type");
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Your payment has been processed successfully. You can now access
            your purchased features.
          </p>
          {paymentType === "video_call" && (
            <div>
              <p className="text-muted-foreground">
                We'll mail you when the time for the video call is scheduled,
                Please check your mail regularly!
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/dashboard/student">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
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
                ? "Schedule video call"
                : paymentType === "chat_subscription"
                  ? "Chat with mentor"
                  : "Back to Home"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
