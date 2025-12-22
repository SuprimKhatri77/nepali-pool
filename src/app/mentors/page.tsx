import { count, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { MentorProfileWithUser } from "../../../types/all-types";
import { mentorProfile, user } from "../../../lib/db/schema";

import { PaginationClient } from "@/components/PaginationClient";
import { auth } from "../../../server/lib/auth/auth";
import { headers } from "next/headers";
import SearchBelowHero from "@/components/SearchBelowHero";
import MentorCard from "@/components/MentorCard";
import { Sparkles } from "lucide-react";
import MentorHero from "@/components/mentors/MentorHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Verified Mentors Abroad | NepaliPool",
  description:
    "Connect with verified Nepali mentors living abroad. Get guidance on applications, visa processes, and real insights about countries, cities, and student life from those who've been there.",
  icons: {
    icon: [
      {
        url: "https://nepalipool.com/logoBgWhite.jpg",
        href: "https://nepalipool.com/logoBgWhite.jpg",
      },
    ],
  },
  openGraph: {
    title: "Find Verified Mentors Abroad | NepaliPool",
    description:
      "Browse verified Nepali mentors from different countries. Chat with them to learn about applications, life abroad, and get honest guidance before you go.",
    url: "https://nepalipool.com/mentors",
    siteName: "NepaliPool",
    images: [
      {
        url: "https://nepalipool.com/mentor-default-preview.png",
        width: 1200,
        height: 630,
        alt: "Find Verified Mentors Abroad - NepaliPool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Verified Mentors Abroad | NepaliPool",
    description:
      "Browse verified Nepali mentors from different countries. Chat with them to learn about applications, life abroad, and get honest guidance before you go.",
    images: ["https://nepalipool.com/mentor-default-preview.png"],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const page =
    Number((await searchParams).page) > 0
      ? Number((await searchParams).page)
      : 1;
  const limit = 6;
  const [totalResult] = await db
    .select({ count: count() })
    .from(mentorProfile)
    .where(eq(mentorProfile.verifiedStatus, "accepted"));

  const total = Number(totalResult.count);
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const offset = (page - 1) * limit;
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user.id;
  let currentUserRole: "none" | "student" | "mentor" | "admin" | null = null;

  if (currentUserId) {
    const [userRecord] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, currentUserId));
    if (userRecord.role) {
      currentUserRole = userRecord.role || null;
    }
  }
  let allMentors: MentorProfileWithUser[] = [];
  try {
    allMentors = await db.query.mentorProfile.findMany({
      where: (fields, { eq }) => eq(fields.verifiedStatus, "accepted"),
      limit,
      offset,
      with: { user: true },
      orderBy: (fields, { asc }) => [asc(fields.createdAt)],
    });
  } catch (err) {
    console.error("Error fetching mentors:", err);
  }

  if (!allMentors || allMentors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-700">
          No mentors found
        </h1>
      </div>
    );
  }

  return (
    <main className="overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-green-100" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Radial Gradient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-100/40 via-transparent to-transparent blur-3xl" />
      <div className="min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 ">
          {/* Hero Section */}
          <MentorHero />

          <SearchBelowHero mentors={allMentors} />

          {/* Stats Bar */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{total}</span>{" "}
                  mentors available
                </span>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {allMentors.length > 0 ? (
              allMentors.map((mentor) => {
                return (
                  <MentorCard
                    key={mentor.userId}
                    mentor={mentor}
                    currentUserRole={currentUserRole ?? null}
                    currentUserId={currentUserId ?? null}
                  />
                );
              })
            ) : (
              <div>
                <h1>Hello</h1>
              </div>
            )}
          </div>

          {/* Empty State */}
          {allMentors.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Sparkles className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No mentors found
              </h3>
              <p className="text-slate-600">
                Check back soon for available mentors
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              id="mentors-list"
              className="flex justify-center pt-8 border-t border-slate-200"
            >
              <PaginationClient
                totalPages={totalPages}
                scrollTarget="mentors-list"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
