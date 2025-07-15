import StudentPage from "@/components/Student";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import { user } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Student() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq
        (user.id, session.user.id)
    )

    if (!userRecord.emailVerified) {
        return redirect(`sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`)
    }

    if (userRecord.role === "none") {
        return redirect("/select-role")
    }

    if (userRecord.role === "admin") {
        return redirect("/admin")
    }

    if (userRecord.role === "mentor") {
        return redirect("/dashboard/mentor")
    }

    if (userRecord.role === "student") {

        return <StudentPage />
    }

    return redirect("/select-role")

}