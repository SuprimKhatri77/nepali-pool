import {
  mentorEnquiryStatusEnum,
  type MentorEnquiryStatus,
} from "../../../../../lib/db/schema";
import { requireApprovedMentor } from "../../../../../server/lib/auth/guards";
import type { EnquiryFilter } from "../../../../../server/actions/mentor-dashboard/enquiries";
import MentorEnquiries from "@/components/mentor-services/MentorEnquiries";

export const metadata = {
  title: "Enquiries | NepaliPool",
};

function parseFilter(value: string | undefined): EnquiryFilter {
  if (value === "all") return "all";
  return mentorEnquiryStatusEnum.enumValues.includes(
    value as MentorEnquiryStatus,
  )
    ? (value as MentorEnquiryStatus)
    : "new";
}

// The enquiries load on the client (MentorEnquiries), page by page. Contact
// details are redacted server-side until the mentor accepts.
export default async function MentorEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userRecord } = await requireApprovedMentor();
  const filter = parseFilter((await searchParams).status);

  return <MentorEnquiries mentorName={userRecord.name} filter={filter} />;
}
