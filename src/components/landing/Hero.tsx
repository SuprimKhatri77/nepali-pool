"use client";
import Link from "next/link";
import { authClient } from "../../../server/lib/auth/auth-client";
import { Spinner } from "../ui/spinner";

export default function Hero() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-bl from-emerald-50/90 via-white to-emerald-100/80 px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto text-center w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
          Your Trusted Mentor to
          <br className="hidden sm:block" />
          <span className="block sm:inline"> Study in </span>
          <span className="text-emerald-600">Japan</span>
          <br className="sm:hidden" />
          <span className="block sm:inline"> from </span>
          <span className="text-emerald-600">Nepal</span>
        </h1>

        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Helping Nepali students choose the right college, city, and future —
          with expert guidance from someone who&apos;s been there.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 w-full max-w-sm sm:max-w-none mx-auto">
          {isPending ? (
            <div className="flex justify-center py-3">
              <Spinner />
            </div>
          ) : !session ? (
            <>
              <Link
                href="/sign-up?role=mentor"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg text-base sm:text-lg"
              >
                Start as a Mentor
              </Link>
              <Link
                href="/sign-up?role=student"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg border-2 border-emerald-600 text-base sm:text-lg"
              >
                Start as a Student
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border-2 border-emerald-400 text-base sm:text-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
