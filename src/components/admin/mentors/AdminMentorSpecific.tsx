import { MentorProfileWithUser } from "../../../../types/all-types";
import AdminMentorProfile from "./AdminMentorProfile";
import MentorList from "@/components/mentors/MentorList";

// The dashboard header already shows where you are (Mentors), so no
// breadcrumb of its own here.
export default function AdminMentorSpecific({
  mentorDetail,
  matchingMentors,
}: Readonly<{
  mentorDetail: MentorProfileWithUser;
  matchingMentors: MentorProfileWithUser[];
}>) {
  return (
    <main className="mb-4">
      <AdminMentorProfile mentorDetail={mentorDetail} />
      <MentorList mentors={matchingMentors} />
    </main>
  );
}
