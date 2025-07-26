// import { headers } from "next/headers"
// import { auth } from "../../../../server/lib/auth/auth"
// import { redirect } from "next/navigation"
import { db } from "../../../../lib/db"
// import { user } from "../../../../lib/db/schema"
// import { eq } from "drizzle-orm"
import MentorApplications from "@/components/orginal-components/MentorApplications"

export default async function Mentor() {

    // const session= await auth.api.getSession({
    //     headers: await headers()
    // })

    // if(!session){
    //     return redirect("/login")
    // }

    // const [userRecord]= await db.select().from(user).where(eq(user.id, session.user.id))

    // if(!userRecord){
    //     return redirect("/sign-up")
    // }

    const mentorProfileWithUser = await db.query.mentorProfile.findMany({
        where: (fields, { ne }) => ne(fields.verifiedStatus, "accepted"),
    with: {
      user: true,
    },
    })
    console.log(mentorProfileWithUser)
    return <MentorApplications mentorProfileWithUser={mentorProfileWithUser}/>
}