import ResetPassword from "@/components/ResetPassword"
import { redirect } from "next/navigation"

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


    return <ResetPassword token={token} />
}
