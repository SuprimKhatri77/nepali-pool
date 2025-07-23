import { LoginForm } from "@/components/login-form"
import { auth } from "../../../../../server/lib/auth/auth"
import { headers } from "next/headers"
import { db } from "../../../../../lib/db"
import { user } from "../../../../../lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session && session.user.emailVerified) {
        const [userRecord] = await db.select().from(user).where(eq(user.id, session?.user.id))

        if (!userRecord) {
            return notFound()
        }

        if (userRecord.emailVerified) {
            if (userRecord.role === "student") {
                return redirect("/dashboard/student")
            } else if (userRecord.role === "mentor") {
                return redirect("/dashboard/mentor")
            } else if (userRecord.role === "admin") {
                return redirect("/admin")
            } else if (userRecord.role === "none") {
                return redirect(`/select-role?email=${encodeURIComponent(session.user.email)}`)
            }
        }
    }



    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}
