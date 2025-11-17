"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SchoolSelectType } from "../../../lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { getSchool } from "../../../server/lib/dal/get-school";

type Props = {
  school: SchoolSelectType;
  recommendedSchools: SchoolSelectType[] | [];
};
type SchoolQueryData = {
  specificSchool: SchoolSelectType;
  recommendedSchools: SchoolSelectType[] | [];
};

export function School({ school, recommendedSchools }: Props) {
  const { data } = useQuery<SchoolQueryData | null>({
    queryKey: ["school", school.id],
    queryFn: async () => {
      const result = await getSchool(school.id);
      if (!result.success) return null;

      return {
        specificSchool: result.school,
        recommendedSchools: result.recommendedSchools ?? [],
      };
    },
    initialData: {
      specificSchool: school,
      recommendedSchools: recommendedSchools ?? [],
    },
    staleTime: 1000 * 60 * 60,
  });
  const specificSchool = data?.specificSchool;
  const recs = data?.recommendedSchools ?? [];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link
                href="/schools"
                className="hover:text-emerald-600 transition-colors"
              >
                Schools
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium line-clamp-1">
                {specificSchool?.name}
              </span>
            </div>
            <Link
              href={`/nearby-mentors/${specificSchool?.id}`}
              className="
        inline-block
        bg-green-600
        hover:bg-green-700
        text-white
        font-semibold
        px-6
        py-3
        rounded-lg
        shadow-lg
        transition
        duration-300
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
        focus:ring-offset-2
      "
            >
              View nearby mentors
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image & Title */}
              <div className="space-y-6">
                <Link href="/schools">
                  <Button
                    variant="ghost"
                    className="mb-4 -ml-2 text-slate-600 hover:text-emerald-600"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to all schools
                  </Button>
                </Link>

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image
                    width={800}
                    height={400}
                    src={
                      specificSchool?.imageUrl ||
                      "/placeholder.svg?height=400&width=800&query=school building"
                    }
                    alt={specificSchool?.name || "School"}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <Badge
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 bg-emerald-50/50"
                      >
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Educational Institution
                      </Badge>
                      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        {specificSchool?.name}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {specificSchool?.address}
                      </p>
                      <p className="text-sm text-slate-600">
                        {specificSchool?.city}, {specificSchool?.prefecture}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* About Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  About This School
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {specificSchool?.name} is located in {specificSchool?.city},{" "}
                    {specificSchool?.prefecture}. The institution is committed
                    to providing quality education and fostering a supportive
                    learning environment for all students. With a focus on
                    academic excellence and personal development, the school
                    offers comprehensive programs designed to prepare students
                    for their future endeavors.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Location Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Location</h2>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-1">
                            Full Address
                          </p>
                          <p className="text-slate-600">
                            {specificSchool?.address}
                          </p>
                          <p className="text-slate-600">
                            {specificSchool?.city}, {specificSchool?.prefecture}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <Card className="border-slate-200 sticky top-6">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {specificSchool?.email && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100">
                            <Mail className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 mb-1">Email</p>
                            <Link
                              href={`mailto:${specificSchool.email}`}
                              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 break-all"
                            >
                              {specificSchool.email}
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100">
                          <MapPin className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">
                            Location
                          </p>
                          <p className="text-sm font-medium text-slate-900">
                            {specificSchool?.city}
                          </p>
                          <p className="text-xs text-slate-600">
                            {specificSchool?.prefecture}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {specificSchool?.websiteUrl && (
                    <>
                      <Separator />
                      <Link
                        href={specificSchool?.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 group">
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card className="border-slate-200 bg-emerald-50/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Quick Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">City</span>
                      <span className="font-medium text-slate-900">
                        {specificSchool?.city}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prefecture</span>
                      <span className="font-medium text-slate-900">
                        {specificSchool?.prefecture}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended Schools Section */}
          {recs.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-200">
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900">
                    Other Schools You May Like
                  </h2>
                  <p className="text-slate-600">
                    Explore more educational institutions in our directory
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recs.map((school) => (
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
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {school.name}
                        </h3>

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
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Link href="/schools">
                    <Button
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      View All Schools
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
