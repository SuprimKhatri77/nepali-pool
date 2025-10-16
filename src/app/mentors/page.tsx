import { count, eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { MentorProfileWithUser } from "../../../types/all-types";
import { mentorProfile, user } from "../../../lib/db/schema";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Sparkles,
  Globe,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PaginationClient } from "@/components/PaginationClient";
import { auth } from "../../../server/lib/auth/auth";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  let page = Number(params.page) || 1;
  const limit = 6;
  const [totalResult] = await db
    .select({ count: count() })
    .from(mentorProfile)
    .where(eq(mentorProfile.verifiedStatus, "accepted"));

  const total = Number(totalResult.count);
  const totalPages = Math.ceil(total / limit);
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  const offset = (page - 1) * limit;
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user.id;
  let currentUserRole: string | null = null;

  if (currentUserId) {
    const [userRecord] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, currentUserId));

    currentUserRole = userRecord?.role ?? null;
  }
  const allMentors: MentorProfileWithUser[] =
    await db.query.mentorProfile.findMany({
      where: (fields, { eq }) => eq(mentorProfile.verifiedStatus, "accepted"),
      limit,
      offset,
      with: {
        user: true,
      },
      orderBy: (mentorProfile, { asc }) => [asc(mentorProfile.createdAt)],
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs sm:text-sm font-medium text-emerald-700">
              Connect with Expert Mentors
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight px-4">
            Find Your Perfect <span className="text-emerald-600">Mentor</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
            Browse through our curated list of experienced mentors ready to
            guide you on your journey to success
          </p>
        </div>

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
          {allMentors.map((mentor) => {
            const isYou =
              currentUserRole === "mentor" && mentor.userId === currentUserId;
            return (
              <Link
                href={isYou ? `/profile` : `/mentors/${mentor.userId}`}
                key={mentor.userId}
                className="group relative bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section with Overlay */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-slate-50">
                  <Image
                    width={400}
                    height={300}
                    src={
                      mentor.imageUrl ||
                      mentor.user.image ||
                      "/placeholder.svg?height=300&width=400&query=professional"
                    }
                    alt={mentor.user.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    style={{ objectPosition: "center 30%" }}
                  />
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-emerald-600/0 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Verified Badge */}
                  {mentor.verifiedStatus === "accepted" && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <Badge className="bg-emerald-500/95 backdrop-blur-sm hover:bg-emerald-600 text-white border-0 shadow-lg flex items-center gap-1 text-xs px-2.5 py-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                  )}

                  {/* Name Overlay on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-0 group-hover:translate-y-1 transition-transform duration-300">
                    <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg line-clamp-1 mb-1">
                      {mentor.user.name}
                    </h2>
                    {mentor.nationality && (
                      <div className="flex items-center gap-1.5 text-white/90">
                        <Globe className="w-3.5 h-3.5" />
                        <p className="text-xs sm:text-sm font-medium">
                          {mentor.nationality}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 space-y-3">
                  {/* Bio Preview - Fixed height */}
                  <div className="h-16">
                    {mentor.bio ? (
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {mentor.bio}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        No bio available yet.
                      </p>
                    )}
                  </div>

                  {/* Location - Fixed height */}
                  <div className="h-10 flex items-center">
                    {(mentor.city || mentor.country) && (
                      <div className="flex items-center gap-2.5 text-slate-600 w-full">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 flex-shrink-0">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-sm min-w-0 flex-1">
                          <p className="text-slate-700 font-medium line-clamp-1">
                            {mentor.city && mentor.country ? (
                              <>
                                {mentor.city}, {mentor.country}
                              </>
                            ) : (
                              mentor.country || mentor.city
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300">
                      <span className="text-sm font-semibold text-emerald-700 group-hover:text-white transition-colors">
                        View Full Profile
                      </span>
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-emerald-500/10 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl translate-y-12 -translate-x-12 group-hover:bg-emerald-500/10 transition-colors duration-500" />
              </Link>
            );
          })}
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
  );
}
