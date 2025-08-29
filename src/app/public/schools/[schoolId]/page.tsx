import SpecificSchoolDetailServer from "@/components/orginal-components/PUBLIC/SCHOOLS/SPECIFICSCHOOL/page";

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
