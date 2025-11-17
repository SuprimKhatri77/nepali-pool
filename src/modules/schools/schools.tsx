"use client";

import HeroSection from "@/components/schools/Hero";
import { SchoolSelectType } from "../../../lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { Building2, GraduationCap, MapPin } from "lucide-react";
import SchoolShortCard from "@/components/schools/MainContent";
import { PaginationClient } from "@/components/PaginationClient";
import { getAllSchools } from "../../../server/lib/dal/get-all-schools";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  allSchools: SchoolSelectType[] | null;
  total: number;
  offset: number;
  page: number;
  limit: number;
  totalPages: number;
};
export function Schools({
  allSchools,
  total,
  offset,
  page,
  limit,
  totalPages,
}: Props) {
  const { data: schools, isPending } = useQuery({
    queryKey: ["schools", page],
    queryFn: () => getAllSchools(limit, offset).then((res) => res.schools),
    initialData: allSchools,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="min-h-screen bg-white">
      <HeroSection total={total} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {!schools || schools.length === 0 ? (
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
                  of <span className="font-medium text-slate-900">{total}</span>{" "}
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
                <SchoolShortCard key={school.id} school={school} />
              ))}
            </div>

            {/* Pagination */}
            <div
              id="schools-list"
              className="flex justify-center border-t border-slate-200 pt-8"
            >
              <PaginationClient
                totalPages={totalPages}
                scrollTarget="schools-list"
              />
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
                    Browse schools across all prefectures in Japan with detailed
                    location information
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
  );
}
