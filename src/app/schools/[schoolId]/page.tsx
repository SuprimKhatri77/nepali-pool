import z from "zod";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getSchool } from "../../../../server/lib/dal/get-school";
import { School } from "@/modules/schools/school";
import { Metadata } from "next";
import { getSchoolById } from "../../../../server/seo-helpers/get-school-by-id";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}): Promise<Metadata> {
  const { schoolId } = await params;
  const school = await getSchoolById(schoolId);
  if (!school) {
    return {
      title: "School Not Found | NepaliPool",
      description:
        "The school you're looking for couldn't be found. Browse our list of verified schools and universities where Nepali students can apply abroad.",
      icons: {
        icon: [
          {
            url: "/logoBgWhite.jpg",
            href: "/logoBgWhite.jpg",
          },
        ],
      },
      openGraph: {
        title: "School Not Found | NepaliPool",
        description:
          "This school profile is unavailable. Explore other schools and connect with mentors already studying abroad.",
        url: "https://nepalipool.com/schools",
        siteName: "NepaliPool",
        images: [
          {
            url: "/schools-preview.png",
            width: 1200,
            height: 630,
            alt: "Browse Schools - NepaliPool",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "School Not Found | NepaliPool",
        description:
          "This school profile is unavailable. Explore other schools and connect with mentors already studying abroad.",
        images: ["/schools-preview.png"],
      },
    };
  }

  return {
    title: `${school.name} - ${school.city} | NepaliPool`,
    description: `Learn about ${school.name} in ${school.city}, ${school.address}. Connect with Nepali students already studying there for honest insights about admissions, campus life, and costs.`,
    icons: {
      icon: [
        {
          url: "/logoBgWhite.jpg",
          href: "/logoBgWhite.jpg",
        },
      ],
    },
    openGraph: {
      title: `${school.name} - ${school.prefecture} | NepaliPool`,
      description: `Explore ${school?.name} and chat with current Nepali students. Get real insights about admissions, scholarships, and student life.`,
      url: `https://nepalipool.com/schools/${schoolId}`,
      siteName: "NepaliPool",
      images: [
        {
          url: school?.imageUrl || "/school-default-preview.png",
          width: 1200,
          height: 630,
          alt: `${school.name} - ${school.city}, ${school.prefecture}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${school.name} - ${school.prefecture} | NepaliPool`,
      description: `Explore ${school.name} and chat with current Nepali students. Get real insights about admissions and student life.`,
      images: [school.imageUrl || "/school-default-preview.png"],
    },
  };
}

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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Invalid School ID
          </h1>
          <p className="text-slate-600">The school ID provided is not valid.</p>
          <Link href="/schools">
            <Button className="bg-emerald-600 hover:bg-emerald-700 mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const school = await getSchool(parsed.data);

  if (!school.success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            School Not Found
          </h1>
          <p className="text-slate-600">
            We couldn&apos;t find any data for this school.
          </p>
          <Link href="/schools">
            <Button className="bg-emerald-600 hover:bg-emerald-700 mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <School
      school={school.school}
      recommendedSchools={school.recommendedSchools ?? []}
    />
  );
}
