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
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-2xl border-green-200 shadow-lg">
        <CardHeader className="space-y-4 text-center pt-12">
          <div className="relative">
            <div className="text-[120px] md:text-[160px] font-bold text-green-600/10 leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-600/20 blur-3xl rounded-full animate-pulse" />
                <svg
                  className="h-24 w-24 md:h-32 md:w-32 text-green-600 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 pt-8">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
            Oops! The page you&apos;re looking for seems to have wandered off.
            Don&apos;t worry, we&apos;ll help you find your way back.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-12">
          {/* Helpful suggestions */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Start Fresh
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Head back to the homepage and explore from there
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Go Back</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Return to the previous page you were viewing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Common links */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 mt-6">
            <p className="text-sm font-medium text-gray-900 mb-4">
              Looking for something specific?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/student"
                className="text-sm text-gray-700 hover:text-green-600 transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Student Dashboard
              </Link>
              <Link
                href="/dashboard/mentor"
                className="text-sm text-gray-700 hover:text-green-600 transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Mentor Dashboard
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:text-green-600 transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Login
              </Link>
              <Link
                href="/sign-up"
                className="text-sm text-gray-700 hover:text-green-600 transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Sign Up
              </Link>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              asChild
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Link href="/">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Homepage
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Button onClick={handleClick}>
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </Button>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
