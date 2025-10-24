import { db } from "../../../../lib/db";
import { school, type SchoolSelectType } from "../../../../lib/db/schema";
import { MapPin, GraduationCap, Building2 } from "lucide-react";
import { count } from "drizzle-orm";

import { PaginationClient } from "@/components/PaginationClient";
import HeroSection from "@/components/schools/Hero";
import SchoolShortCard from "@/components/schools/MainContent";

export default async function AllSchools({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  let page = Number(params.page) || 1;
  const limit = 6;
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
      
      <HeroSection total={total} schools={schools} />
       
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
                  // always use / before or after for sendTo option. 
                  <SchoolShortCard sendTo="/admin/schools/" key={school.id} school={school} />
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
