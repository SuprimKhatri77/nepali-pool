import SpecificSchoolDetailServer from "@/components/SCHOOLS/SPECIFICSCHOOL/SpecificSchool";
import { db } from "../../../../../lib/db";
import { eq, ne } from "drizzle-orm";
import { school, SchoolSelectType } from "../../../../../lib/db/schema";

export default async function Page({
  params,
}: {
  readonly params: {
    readonly schoolId: string;
  };
}) {
  const { schoolId } = await params;

  const schoolDetail = await db.query.school.findFirst({
    where: eq(school.id, schoolId)
  })

  const RecommendedSchools: SchoolSelectType[] = await db.query.school.findMany({
    where: ne(school.id, schoolId),
  });
  return <SpecificSchoolDetailServer schoolDetail={schoolDetail}  recommendedSchools={RecommendedSchools}/>;
}
