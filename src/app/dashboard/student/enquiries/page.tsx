import { StudentEnquiries } from "@/components/dashboard/student/student-enquiries";
import { requireStudent } from "../../../../../server/lib/auth/guards";
import { ownEnquiryReference } from "../../../../../server/lib/student-dashboard/own-reference";

export const metadata = {
  title: "Enquiries | NepaliPool",
};

export default async function StudentEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ enquired?: string | string[] }>;
}) {
  const { studentRecord } = await requireStudent();
  const { enquired } = await searchParams;

  return (
    <StudentEnquiries
      justEnquired={await ownEnquiryReference(studentRecord.userId, enquired)}
    />
  );
}
