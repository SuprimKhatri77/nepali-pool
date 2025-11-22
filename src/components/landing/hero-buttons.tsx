"use client";

import { authClient } from "../../../server/lib/auth/auth-client";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const HeroButtons = () => {
  const { data: session, isPending } = authClient.useSession();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[52px] min-w-[200px] w-full sm:w-auto"></div>;
  }

  if (isPending) return <Spinner className="w-full mx-auto"/>;

  if (!session) {
    return (
      <>
        <Link
          href="/sign-up?role=mentor"
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl text-base sm:text-lg"
        >
          Start as a Mentor
        </Link>
        <Link
          href="/sign-up?role=student"
          className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl border-2 border-emerald-600 text-base sm:text-lg"
        >
          Start as a Student
        </Link>
      </>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="w-full sm:w-auto px-8 py-4 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border-2 border-emerald-400 shadow-lg hover:shadow-xl text-base sm:text-lg"
    >
      Go to Dashboard
    </Link>
  );
};

export default HeroButtons;
