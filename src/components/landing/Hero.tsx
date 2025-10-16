"use client";

import Link from "next/link";
import { authClient } from "../../../server/lib/auth/auth-client";
import { Spinner } from "../ui/spinner";

export default function Hero() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-emerald-50/90 via-white to-emerald-100/80 px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-5xl mx-auto text-center w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Your Trusted Mentor to Study in{" "}
          <span className="text-emerald-600">Japan</span>
          <span className="block sm:inline"> from </span>
          <span className="text-emerald-600">Nepal</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          Helping Nepali students choose the right college, city, and future —
          with expert guidance from someone who&apos;s been there.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 w-full max-w-md sm:max-w-none mx-auto px-2">
          {isPending ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : !session ? (
            <>
              <Link
                href="/sign-up?role=mentor"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm text-base"
              >
                Start as a Mentor
              </Link>
              <Link
                href="/sign-up?role=student"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg transition-colors shadow-sm border-2 border-emerald-600 text-base"
              >
                Start as a Student
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-50 text-emerald-700 text-base font-medium rounded-md hover:bg-emerald-100 transition-colors border-1 border-emerald-400"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
