import SignUpPage from "@/components/SignUpForm";
import { auth } from "../../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "../../../../../lib/db";
import { user } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function SignUp() {
    const session = await auth.api.getSession({

        headers: await headers()
    })

    if (session) {
        const [userRecord] = await db.select().from(user).where(eq(user.id, session?.user.id))

        if (!userRecord) {
            return notFound()
        }

        if (!userRecord.emailVerified) {
            return redirect(`/sign-up/verify-email?email=${encodeURIComponent(session.user.email)}`)
        }


        if ((session && userRecord.role) === "student") {
            return redirect("/dashboard/student")
        }
        else if (session && userRecord.role === "mentor") {
            return redirect("/dashboard/mentor")
        } else if (session && userRecord.role === "admin") {
            return redirect("/admin")
        } else if (session && userRecord.role === "none") {
            redirect(`/select-role?email=${encodeURIComponent(session.user.email)}`)
        }
    }



    return <SignUpPage />
}