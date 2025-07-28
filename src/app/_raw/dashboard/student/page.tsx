import StudentPage from "@/components/Student";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";
import { favorite, mentorProfile, studentProfile, user } from "../../../../../lib/db/schema";
import { and, eq } from "drizzle-orm";

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
        return redirect(`/sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`)
    }

    if (userRecord.role === "none") {
        return redirect(`/select-role?email=${encodeURIComponent(userRecord.email)}`)
    }

    if (userRecord.role === "admin") {
        return redirect("/admin")
    }

    if (userRecord.role === "mentor") {
        const [mentorProfileRecord] = await db.select().from(mentorProfile).where(eq(mentorProfile.userId, userRecord.id))
        if (!mentorProfileRecord) {
            return redirect("/sign-up/onboarding/student")
        }
        return redirect("/dashboard/mentor")
    }

    if (userRecord.role === "student") {
        const [studentProfileRecord] = await db.select().from(studentProfile).where(eq(studentProfile.userId, userRecord.id))
        if (!studentProfileRecord) {
            return redirect("/sign-up/onboarding/student")
        }

        const mentorProfiles = await db.query.mentorProfile.findMany({
            with: {
                user: true
            }
        })

        const macthingMentors = mentorProfiles.filter((prof) => studentProfileRecord.favoriteDestination?.includes(prof.country!))


        const studentRecordWithUser = await db.query.studentProfile.findFirst({
            where: (fields, { eq }) => eq(studentProfile.userId, userRecord.id),
            with: {
                user: true
            }
        })

        if (!studentRecordWithUser) {
            return redirect("/login")
        }

        // const isFavorite = await db.select().from(favorite).where(and(eq(favorite.studentId, studentRecordWithUser.userId), eq(favorite.mentorId, macthingMentors.filter(mentor => mentor.userId === favorite.mentorId))))


        return <StudentPage matchingMentors={macthingMentors} studentRecordWithUser={studentRecordWithUser} />
    }

    return redirect(`/select-role`)

}