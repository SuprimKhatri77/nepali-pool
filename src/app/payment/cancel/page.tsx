"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <Card className="w-full max-w-md border-orange-200 shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="h-8 w-8 text-orange-600"
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
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5"
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
                <p className="text-sm font-medium text-orange-900">
                  What Happened?
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  You chose to cancel the payment process. If this was a
                  mistake, you can try again anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Link href="/dashboard/student">Back to Dashboard</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
