"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/dashboard/student">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
