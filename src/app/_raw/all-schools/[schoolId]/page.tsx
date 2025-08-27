import { eq, ne } from "drizzle-orm";
import { db } from "../../../../../lib/db";
import { school, SchoolSelectType } from "../../../../../lib/db/schema";
import z from "zod";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MapPin } from "lucide-react";

const uuidCheck = z.string().uuid();

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const schoolId = (await params).schoolId;
  const parsed = uuidCheck.safeParse(schoolId);
  if (!parsed.success) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-xl font-bold">
        Invalid School Id.
      </div>
    );
  }
  console.log("Id from Params: ", schoolId);
  const [specificSchool] = await db
    .select()
    .from(school)
    .where(eq(school.id, schoolId))
    .limit(1);

  if (!specificSchool) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-xl font-bold">
        NO data for found for the school Id.
      </div>
    );
  }

  const recommendedSchools: SchoolSelectType[] = await db.query.school.findMany(
    {
      where: ne(school.id, schoolId),
      limit: 3,
    }
  );
  return (
    <div className="flex flex-col p-10 gap-7">
      <div className="">
        <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="relative overflow-hidden">
            <Image
              width={300}
              height={160}
              src={
                specificSchool.imageUrl ||
                "/placeholder.svg?height=160&width=300&query=specificSchool building"
              }
              alt={specificSchool.name || "School"}
              className="w-full h-40 object-contain object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-4 space-y-3">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {specificSchool.name}
            </h2>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium line-clamp-1">
                    {specificSchool.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    {specificSchool.city}, {specificSchool.prefecture}
                  </p>
                </div>
              </div>

              {specificSchool.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <Link
                    href={`mailto:${specificSchool.email}`}
                    className="hover:text-green-600 transition-colors duration-200 text-sm font-medium truncate"
                  >
                    {specificSchool.email}
                  </Link>
                </div>
              )}

              {specificSchool.websiteUrl && (
                <div className="pt-1">
                  <Link
                    href={specificSchool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md group/link"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7 bg-white shadow-md border px-5 py-7 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Other Recommended Schools
        </h1>
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedSchools.map((school, idx) => (
                <Link
                  href={`/all-schools/${school.id}`}
                  key={school.id || idx}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      width={300}
                      height={160}
                      src={
                        school.imageUrl ||
                        "/placeholder.svg?height=160&width=300&query=school building"
                      }
                      alt={school.name || "School"}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4 space-y-3">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                      {school.name}
                    </h2>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium line-clamp-1">
                            {school.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            {school.city}, {school.prefecture}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {recommendedSchools.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No schools found
                </h3>
                <p className="text-gray-500">
                  Check back later for new additions to our directory.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
