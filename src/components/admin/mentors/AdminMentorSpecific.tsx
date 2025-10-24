"use client";

import { useRouter } from "next/navigation";
import { MentorProfileWithUser } from "../../../../types/all-types";
// import Achievements from "./ACHIEVEMENTS";
import { ChevronRightCircleIcon } from "lucide-react";
import AdminMentorProfile from "./AdminMentorProfile";
import MentorList from "@/components/mentors/MentorList";



export default function AdminMentorSpecific({
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
        <p onClick={() => router.push("/admin/mentors")} className="cursor-pointer p-2 rounded-[6px] hover:bg-emerald-400 hover:text-white transition-colors duration-150 ease-initial">Mentors</p> <ChevronRightCircleIcon /> <p className="p-2 rounded-[4px]">{mentorDetail?.user?.name}</p>
      </div>
      <AdminMentorProfile mentorDetail={mentorDetail} />
      {/* <Achievements /> */}
      <MentorList mentors={matchingMentors}/>
    </main>
  );
}
