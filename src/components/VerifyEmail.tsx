"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "../../server/lib/auth/auth-client"
import { useState } from "react"
import { toast } from "sonner"

export default function VerifyEmail() {
    const params = useSearchParams()
    const router = useRouter()
    const email = params.get("email") as string
    const from = params.get("from")
    const [message, setMessage] = useState("A verification link has been sent to your email.")
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        if (!email) {
            toast.error("Email not found. Please try logging in again.")
            router.push("/login")
            return
        }

        setIsLoading(true)
        try {
            await authClient.sendVerificationEmail({
                email,
                callbackURL: "/sign-up/onboarding",
            })
            toast.success("Verification email sent!")
            setMessage("Verification email sent! Please check your inbox.")
        } catch (error) {
            toast.error("Failed to send verification email. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (from === "signup") {
        return (
            <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
                <h1 className="text-xl font-bold">Verification email sent! 🎉</h1>
                <p>
                    We've sent a link to <strong>{email}</strong>. Please check your inbox and click the link to continue.
                </p>
                <p className="text-sm text-muted-foreground">Didn't get the email?</p>
                <Button onClick={handleClick} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
            <h1 className="text-xl font-bold">Email verification required</h1>
            <p>
                Your email <strong>{email}</strong> is not verified. Please check your inbox and click the verification link.
            </p>
            <p className="text-sm text-muted-foreground">Didn't get the email?</p>
            <Button onClick={handleClick} disabled={isLoading}>
                {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/login")}>
                Back to Login
            </Button>
        </div>
    )
}
