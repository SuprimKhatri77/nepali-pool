import SpecificSchoolDetailServer from "@/components/SCHOOLS/SPECIFICSCHOOL/page";

export default async function SpecificSchoolView({
  params,
}: {
  readonly params: {
    readonly schoolId: string;
  };
}) {
  const { schoolId } = await params;
  return <SpecificSchoolDetailServer Id={schoolId} />;
}
