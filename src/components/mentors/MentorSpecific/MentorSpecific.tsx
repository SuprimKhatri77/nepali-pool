"use client";

import { useRouter } from "next/navigation";
import { MentorProfileWithUser, MentorProfileWithUserAndChat } from "../../../../types/all-types";
import MentorList from "../MentorList";
// import Achievements from "./ACHIEVEMENTS";
import MentorProfile from "./MentorProfile";
import { ChevronRightCircleIcon } from "lucide-react";



export default function MentorSpecific({
  mentorDetail,
  matchingMentors
}: Readonly<{
  mentorDetail: MentorProfileWithUser;
  matchingMentors: MentorProfileWithUser[]
}>) {
  const router = useRouter()
  return (
    <main className=" mb-4">
      <div className="text-xs font-semibold text-[#1D293D] mt-4 ml-6 xl:ml-28 mb-2 flex items-center gadiv-2">
        <p onClick={() => router.push("/mentors")} className="cursor-pointer p-2 rounded-[6px] hover:bg-emerald-400 hover:text-white transition-colors duration-150 ease-initial">Mentors</p> <ChevronRightCircleIcon /> <p className="p-2 rounded-[4px]">{mentorDetail?.user?.name}</p>
      </div>
      <MentorProfile mentorDetail={mentorDetail} />
      {/* <Achievements /> */}
      <MentorList mentors={matchingMentors}/>
    </main>
  );
}
