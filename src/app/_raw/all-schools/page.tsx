import Image from "next/image";
import { db } from "../../../../lib/db";
import type { SchoolSelectType } from "../../../../lib/db/schema";
import { ExternalLink, MapPin, Mail } from "lucide-react";
import Link from "next/link";

export default async function AllSchools() {
  const schools: SchoolSelectType[] = await db.query.school.findMany();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Schools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive directory of educational institutions
            across Japan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schools.map((school, idx) => (
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

        {schools.length === 0 && (
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
  );
}
