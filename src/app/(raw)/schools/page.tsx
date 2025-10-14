import Image from "next/image";
import { db } from "../../../../lib/db";
import { school, type SchoolSelectType } from "../../../../lib/db/schema";
import { MapPin, GraduationCap, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { count } from "drizzle-orm";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

export default async function AllSchools({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  let params = await searchParams;
  let page = Number(params.page) || 1;
  const limit = 3;
  const [totalResult] = await db.select({ count: count() }).from(school);

  const total = Number(totalResult.count);
  const totalPages = Math.ceil(total / limit);

  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const offset = (page - 1) * limit;

  const schools: SchoolSelectType[] = await db.query.school.findMany({
    limit,
    offset,
    orderBy: (school, { asc }) => [asc(school.id)],
  });

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center space-y-4">
              <Badge
                variant="outline"
                className="border-emerald-200 text-emerald-700 bg-emerald-50/50"
              >
                <GraduationCap className="w-3 h-3 mr-1" />
                Education Directory
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Discover Schools
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Explore our comprehensive directory of educational institutions
                across Japan. Find the perfect school for your educational
                journey.
              </p>
              <div className="flex items-center justify-center gap-6 pt-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>{total} Schools</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>All Prefectures</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {schools.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No schools found
              </h3>
              <p className="text-slate-600 mb-8">
                Check back later for new additions to our directory.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">
                    Showing{" "}
                    <span className="font-medium text-slate-900">
                      {offset + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-slate-900">
                      {Math.min(offset + limit, total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-900">{total}</span>{" "}
                    schools
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </div>
              </div>

              {/* School Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {schools.map((school) => (
                  <Link
                    href={`/schools/${school.id}`}
                    key={school.id}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden bg-slate-100">
                      <Image
                        width={400}
                        height={200}
                        src={
                          school.imageUrl ||
                          "/placeholder.svg?height=200&width=400&query=school building"
                        }
                        alt={school.name || "School"}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 leading-snug">
                          {school.name}
                        </h2>
                      </div>

                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                        <div className="text-sm space-y-0.5 min-w-0">
                          <p className="font-medium text-slate-700 line-clamp-1">
                            {school.address}
                          </p>
                          <p className="text-slate-500">
                            {school.city}, {school.prefecture}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm font-medium text-emerald-700 group-hover:text-emerald-800 pt-2">
                        <span>View details</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center border-t border-slate-200 pt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        disabled={page === 1}
                        className="disabled:opacity-50"
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
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-300"
                                : "hover:bg-slate-50"
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
                        className="disabled:opacity-50"
                      >
                        <PaginationNext
                          href={
                            page === totalPages
                              ? undefined
                              : `?page=${page + 1}`
                          }
                        />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* Info Section */}
              <div className="mt-16 pt-16 border-t border-slate-200">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Quality Education
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Discover institutions committed to academic excellence and
                      student development
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Nationwide Coverage
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Browse schools across all prefectures in Japan with
                      detailed location information
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Verified Listings
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      All schools in our directory are verified to provide
                      accurate information
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
