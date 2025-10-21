import { headers } from "next/headers"
import { auth } from "../../../server/lib/auth/auth"
import { db } from "../../../lib/db"
import { studentProfile } from "../../../lib/db/schema"
import { redirect } from "next/navigation"
import SessionLandingPage from "@/components/sessions/SessionLanding"


export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session){
  return  redirect("/login")
  }


const studentProfileRecord = await db.query.studentProfile.findFirst({
    where: (fields, { eq }) => eq(studentProfile.userId, session.user.id),
    with: {
      user: true,
    },
  });
  if(!studentProfileRecord){
    return redirect("/")
  }
  console.log(studentProfileRecord)
  
  return <SessionLandingPage studentProfileRecord={studentProfileRecord} />
}
