// import { db } from "../../../../../../lib/db";
// import { MentorProfileSelectType } from "../../../../../../lib/db/schema";
// import MentorCard from "../reusable/MentorCard";

import MentorListServer from "../MentorListServer";

export default async function Achievements() {
  //   const mentors: MentorProfileSelectType[] =
  //     await db.query.mentorProfile.findMany({
  //       with: {
  //         user: true,
  //       },
  //     });
  return <MentorListServer />;
}
