export const revalidate = 3600;

import { getStudentProfiles } from "../../../server/helper/connect-student/get-student-profile";
import { redirect } from "next/navigation";
import ConnectStudent from "@/components/students/connect-students/connect-student";


export default async function page() {
  const { hasCurrentUserProfile, hasSession, role, user } =
    await getStudentProfiles();

  //  check for user who login and ! has whatsapp number for user befoer jan 24/22 2026
    if(hasSession && user?.appliedOn && !user?.whatsAppNumber){
     return redirect("/connect-student/update/profile")
    }
    
  return (
    <ConnectStudent hasCurrentUserProfile={hasCurrentUserProfile} user={user} hasSession={hasSession} role={role} />
  );
}
