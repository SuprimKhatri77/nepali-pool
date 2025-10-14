import { count } from "drizzle-orm";
import { db } from "../../../lib/db";
import { MentorProfileWithUser } from "../../../types/all-types";
import { mentorProfile } from "../../../lib/db/schema";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  let params = await searchParams;
  let page = Number(params.page) || 1;
  const limit = 2;
  const [totalResult] = await db.select({ count: count() }).from(mentorProfile);

  const total = Number(totalResult.count);
  const totalPages = Math.ceil(total / limit);
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  const offset = (page - 1) * limit;
  const allMentors: MentorProfileWithUser[] =
    await db.query.mentorProfile.findMany({
      limit,
      offset,
      with: {
        user: true,
      },
      orderBy: (mentorProfile, { asc }) => [asc(mentorProfile.createdAt)],
    });
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Connect with Expert Mentors
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            Find Your Perfect <span className="text-emerald-600">Mentor</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Browse through our curated list of experienced mentors ready to
            guide you on your journey to success
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{total}</span>{" "}
                mentors available
              </span>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {allMentors.map((mentor) => (
            <Link
              href={`/mentors/${mentor.userId}`}
              key={mentor.userId}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-50 h-48">
                <Image
                  width={400}
                  height={200}
                  src={
                    mentor.imageUrl ||
                    mentor.user.image ||
                    "/placeholder.svg?height=200&width=400&query=professional"
                  }
                  alt={mentor.user.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Verified Badge */}
                {mentor.verifiedStatus === "accepted" && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg">
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
                    {mentor.user.name}
                  </h2>
                  {mentor.nationality && (
                    <p className="text-sm text-slate-500 mt-1">
                      {mentor.nationality}
                    </p>
                  )}
                </div>

                {/* Bio Preview */}
                {mentor.bio && (
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>
                )}

                {/* Location */}
                <div className="flex items-start gap-2 text-slate-600 pt-2 border-t border-slate-100">
                  <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                  <div className="text-sm min-w-0">
                    <p className="text-slate-700 line-clamp-1">
                      {mentor.city && mentor.country ? (
                        <>
                          {mentor.city}, {mentor.country}
                        </>
                      ) : (
                        mentor.country ||
                        mentor.city ||
                        "Location not specified"
                      )}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-3">
                  <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    View Profile
                  </span>
                  <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {allMentors.length === 0 && (
          <div className="text-center py-16">
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
          <div className="flex justify-center pt-8 border-t border-slate-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === 1}
                    className="disabled:opacity-50 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <PaginationPrevious
                      href={page === 1 ? undefined : `?page=${page - 1}`}
                    />
                  </Button>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={`?page=${p}`}
                        isActive={p === page}
                        className={
                          p === page
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
                            : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                        }
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === totalPages}
                    className="disabled:opacity-50 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <PaginationNext
                      href={
                        page === totalPages ? undefined : `?page=${page + 1}`
                      }
                    />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
