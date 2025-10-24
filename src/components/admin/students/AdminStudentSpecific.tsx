"use client";

import { useRouter } from "next/navigation";
import {  StudentProfileWithUser } from "../../../../types/all-types";
// import Achievements from "./ACHIEVEMENTS";
import { ChevronRightCircleIcon } from "lucide-react";
import AdminStudentProfile from "./AdminStudentProfile";



export default function AdminStudentSpecific({
  studentDetail,
  
}: 
  {studentDetail: StudentProfileWithUser}
) {
  const router = useRouter()
  return (
    <main className=" mb-4">
      <div className="text-xs font-semibold text-[#1D293D] mt-4 ml-6 xl:ml-28 mb-2 flex items-center gadiv-2">
        <p onClick={() => router.push("/admin/students")} className="cursor-pointer p-2 rounded-[6px] hover:bg-emerald-400 hover:text-white transition-colors duration-150 ease-initial">Students</p> <ChevronRightCircleIcon /> <p className="p-2 rounded-[4px]">{studentDetail?.user?.name}</p>
      </div>
      <AdminStudentProfile studentDetail={studentDetail} />
    </main>
  );
}
