import MentorSpecific from "@/components/orginal-components/PUBLIC/mentors/MentorSpecific/MentorSpecific";
import { db } from "../../../../../lib/db";
import { mentorProfile } from "../../../../../lib/db/schema";
import { redirect } from "next/navigation";

export default async function MentorSpecificServer({
  params,
}: {
  readonly params: {
    readonly mentorId: string;
  };
}) {
  const { mentorId } = await params;
  if (!mentorId) return redirect("/public/mentors");
  console.log(mentorId);
  const mentorDetail = await db.query.mentorProfile.findFirst({
    where: (fields, { eq }) => eq(mentorProfile.userId, mentorId),
    with: {
      user: true,
    },
  });

  if (!mentorDetail) {
    return redirect("/public/mentors");
  }

  const mentorDetailObj = {
    mentorDetail: mentorDetail,
    user: mentorDetail.user,
  };

  return <MentorSpecific mentorDetail={mentorDetailObj} />;
}
