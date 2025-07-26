import { headers } from "next/headers"
import { auth } from "../../../../server/lib/auth/auth"
import { redirect } from "next/navigation"
import { db } from "../../../../lib/db"
import { studentProfile, user } from "../../../../lib/db/schema"
import { eq } from "drizzle-orm"

export default async function StudentDashboard() {
    const session = await auth.api.getSession({
        headers : await headers()
    })
    if(!session){
        return redirect("/login")
    }

    const [userRecord]= await db.select().from(user).where(eq(user.id, session.user.id))
    const [studentProfileRecord] = await db.select().from(studentProfile).where(eq(studentProfile.userId, userRecord.id))

    if(!userRecord){
        return redirect("/sign-up")
    }

    if(userRecord.role === "mentor"){
        return redirect("/dashboard/mentor")
    }

    if(userRecord.role === "admin"){
        return redirect("/admin")
    }

    if(userRecord.role === 'student'){
        if(!studentProfileRecord){
            return redirect("/sign-up/onboarding/student")
        }
    }
    




    return (
        <div>
            <h1>student Dashboard</h1>
        </div>
    )
}