import ResetPassword from "@/components/ResetPassword";
import { db } from "../../../../lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
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
            <CardTitle className="text-center text-2xl font-semibold text-gray-900">
              Reset Link Incomplete
            </CardTitle>
            <CardDescription className="text-center text-base text-red-600">
              The password reset link you followed is missing required
              information. Please request a new reset link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const resetRecord = await db.query.verification.findFirst({
    where: (fields, { eq }) => eq(fields.identifier, `reset-password:${token}`),
  });

  if (!resetRecord) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-center text-2xl font-semibold text-gray-900">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center text-base text-red-600">
              This password reset link is not valid. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dbToken = resetRecord.identifier.split(":")[1];

  if (token !== dbToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-center text-2xl font-semibold text-gray-900">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center text-base text-red-600">
              This password reset link is not valid. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date() > resetRecord.expiresAt;

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-center text-2xl font-semibold text-gray-900">
              Link Expired
            </CardTitle>
            <CardDescription className="text-center text-base text-red-600">
              This reset link has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ResetPassword token={token} />;
}
