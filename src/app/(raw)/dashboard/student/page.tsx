"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "../../../../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudentPage() {
    const [click, setClick] = useState(false)
    const router = useRouter()


    const handleClick = async () => {
        setClick(true)
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                }
            }
        })
        setClick(false)
    }
    return (
        <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
            Sup student!
            <Button onClick={handleClick} disabled={click}>Logout</Button>
        </div>
    )
}