import { and, count, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { db } from "../../../lib/db";
import { PublicMentor } from "../../../types/all-types";
import {
  getServiceSummaries,
  mentorsOfferingServices,
  publicMentorColumns,
  publicMentorWith,
} from "../../../server/lib/mentors/public-mentor";
import { mentorProfile } from "../../../lib/db/schema";

import { PaginationClient } from "@/components/PaginationClient";
import { getViewer } from "../../../server/lib/auth/viewer";
import SearchBelowHero from "@/components/SearchBelowHero";
import MentorCard from "@/components/MentorCard";
import { Briefcase, Sparkles, Users } from "lucide-react";
import { cn } from "@/components/lib/utils";
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
  searchParams: Promise<{ page?: string; services?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  // ?services=1 shows only mentors who offer at least one service.
  const onlyWithServices = params.services === "1";
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = 6;
  const offset = (page - 1) * limit;

  const [[totalResult], viewer, allMentors] = await Promise.all([
    db
      .select({ count: count() })
      .from(mentorProfile)
      .where(
        and(
          eq(mentorProfile.verifiedStatus, "accepted"),
          onlyWithServices
            ? inArray(mentorProfile.userId, mentorsOfferingServices)
            : undefined,
        ),
      ),
    getViewer(),
    db.query.mentorProfile
      .findMany({
        columns: publicMentorColumns,
        with: publicMentorWith,
        where: (fields, { and, eq, inArray }) =>
          and(
            eq(fields.verifiedStatus, "accepted"),
            onlyWithServices
              ? inArray(fields.userId, mentorsOfferingServices)
              : undefined,
          ),
        limit,
        offset,
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
      })
      .catch((err): PublicMentor[] => {
        console.error("Error fetching mentors:", err);
        return [];
      }),
  ]);

  const total = Number(totalResult.count);
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const currentUserId = "user" in viewer ? viewer.user.id : undefined;
  const currentUserRole = "user" in viewer ? viewer.user.role : null;
  const serviceSummaries = await getServiceSummaries(
    allMentors.map((mentor) => mentor.userId),
  );

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
                  {onlyWithServices ? "mentors offering services" : "mentors available"}
                </span>
              </div>
            </div>
          </div>

          {/* Filter */}
          <nav
            aria-label="Filter mentors"
            className="flex justify-center gap-2 -mt-4 mb-8 sm:mb-10"
          >
            <FilterChip href="/mentors" active={!onlyWithServices}>
              <Users className="w-4 h-4" />
              All mentors
            </FilterChip>
            <FilterChip href="/mentors?services=1" active={onlyWithServices}>
              <Briefcase className="w-4 h-4" />
              Offers services
            </FilterChip>
          </nav>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {allMentors.length > 0 ? (
              allMentors.map((mentor) => {
                return (
                  <MentorCard
                    key={mentor.userId}
                    mentor={mentor}
                    services={serviceSummaries.get(mentor.userId)}
                    currentUserRole={currentUserRole ?? null}
                    currentUserId={currentUserId ?? null}
                  />
                );
              })
            ) : null}
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
                {onlyWithServices
                  ? "No mentor is offering services yet."
                  : "Check back soon for available mentors"}
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

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
      )}
    >
      {children}
    </Link>
  );
}
