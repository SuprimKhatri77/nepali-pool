import z from "zod";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getSchool } from "../../../../server/lib/dal/get-school";
import { School } from "@/modules/schools/school";

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
