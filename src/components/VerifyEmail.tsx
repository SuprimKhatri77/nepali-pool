"use client"

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../../server/lib/auth/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
    const params = useSearchParams();
    const email = params.get("email") as string;
    const from = params.get("from");
    const [message, setMessage] = useState("A verification link has been sent to your email.");


    const handleClick = async () => {
        toast(message);
        await authClient.sendVerificationEmail({
            email,
            callbackURL: "/sign-up/onboarding"
        });
    };

    return from === "signup" ? (
        <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
            <h1 className="text-xl font-bold">Verification email sent! 🎉</h1>
            <p>We've sent a link to <strong>{email}</strong>. Please check your inbox and click the link to continue.</p>
            <p className="text-sm text-muted">Didn't get the email?</p>
            <Button onClick={handleClick}>Resend Verification Email</Button>
        </div>
    ) : (
        <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
            <h1 className="text-xl font-bold">Email verification required</h1>
            <p>Your email is not verified. Please check your inbox.</p>
            <Button onClick={handleClick}>Resend Verification Email</Button>
        </div>
    );
}
