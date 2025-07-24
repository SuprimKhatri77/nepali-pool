import SelectRolePage from "@/components/SelectRole";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { user } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default async function SelectRole() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login")
    }

    const [userRecord] = await db.select().from(user).where(eq(user.id, session.user.id))

    if (userRecord.role !== "none") {
        if (userRecord.role === "admin") {
            return redirect("/admin")
        }
        return redirect(`/dashboard/${userRecord.role}`)
    }
    return <SelectRolePage />
}