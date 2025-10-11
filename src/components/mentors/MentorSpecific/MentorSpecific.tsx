"use client";
import {
  MentorProfileSelectType,
  UserSelectType,
} from "../../../../../../lib/db/schema";
// import Achievements from "./ACHIEVEMENTS";
import MentorProfile from "./MentorProfile";

export type MentorProfileType = {
  mentorDetail: MentorProfileSelectType;
  user: UserSelectType;
};

export default function MentorSpecific({
  mentorDetail,
}: Readonly<{
  mentorDetail: MentorProfileType;
}>) {
  // console.log(mentorDetail);
  return (
    <main className=" mb-4">
      <p className="text-xs font-semibold text-[#1D293D] mt-4 ml-16 mb-2">
        Mentors {">"} {mentorDetail?.user?.name}
      </p>
      <MentorProfile mentorDetail={mentorDetail} />
      {/* <Achievements /> */}
      {/* <MentorList /> */}
    </main>
  );
}
