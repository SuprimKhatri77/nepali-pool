"use client"

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { authClient } from "../../../../../../server/lib/auth/auth-client";

export default function VerifyEmail() {
    const params = useSearchParams()
    const email = params.get("email") as string;
    const handleClick = async () => {
        await authClient.sendVerificationEmail({
            email,
            callbackURL: "/sign-up/onboarding"
        })
    }
    return (
        <div className="flex flex-col gap-2 justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold">A verificaiton link has been sent to your email.</h1>
            <p className="text-xl font-medium">Please click on the link and verify your email to continue.</p>
            <p className="text-lg font-medium">Didn't get a email verificaiton link?</p>
            <p className="font-medium">Don't worry we gotchu, you can resend it!</p>
            <Button variant="link" onClick={handleClick}>Resend Verification Link</Button>
        </div>
    )
}