import ResetPassword from "@/components/ResetPassword"
import { redirect } from "next/navigation"
import { db } from "../../../../../../../lib/db"

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {

    const { token } = await searchParams


    if (!token) {
        console.log("No token provided in URL")
        redirect("/login/forgot-password?error=missing_token")
    }

    const resetRecord = await db.query.verification.findFirst({
        where: (fields, { eq, and }) =>
            and(
                eq(fields.identifier, "reset_password"),
                eq(fields.value, token)
            )
    })


    if (!resetRecord) {
        return redirect("/login/forgot-password?error=invalid_token")
    }

    const isExpired = new Date() > resetRecord.expiresAt

    if (isExpired) {
        return redirect("/login/forgot-password?error=expired_token")
    }


    return <ResetPassword token={token} />
}
