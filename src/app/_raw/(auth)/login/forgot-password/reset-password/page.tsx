"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "../../../../../../../server/lib/auth/auth-client";
import { toast } from "sonner";
import { router } from "better-auth/api";

export default function resetPassword() {
    const [isPending, setIsPending] = useState<boolean>(false)
    const [newPassword, setNewPassword] = useState<string>("")
    const [inputType, setInputType] = useState<string>("password")
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
    const params = useSearchParams()
    const token = params.get("token") as string
    const router = useRouter()

    if (!token) {
        return (
            <div>Not authorized</div>
        )
    }

    const handleClick = async () => {
        setIsPending(true)
        if (newPassword === confirmNewPassword) {
            const { data, error } = await authClient.resetPassword({
                newPassword,
                token,

            })
            toast.success("Password changed successfully, redirecting to login.....")
            setTimeout(() => {
                router.replace("/login")
            }, 1500);
        }

        setIsPending(false)
    }



    return <div className="flex flex-col gap-6 max-w-[700px] mx-auto justify-center min-h-screen">
        <Card>
            <CardHeader>
                <CardTitle>Reset your Password</CardTitle>
                <CardDescription>Enter your new password and confirm it.</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="newPassword">Password</Label>
                            <div className="relative">

                                <Input id="newPassword" type={inputType} name="newPassword" onChange={(e) => setNewPassword(e.target.value)} required />
                                {inputType === "password" ? (
                                    <div className="absolute top-1.25 right-2 hover:bg-gray-50  cursor-pointer transition-all duration-300 py-2 px-2 rounded-full" onClick={() => setInputType("text")}>

                                        <EyeOff className="w-3 h-3" />
                                    </div>
                                ) : (
                                    <div className="absolute top-1.25 right-2 hover:bg-gray-50  cursor-pointer transition-all duration-300 py-2 px-2 rounded-full" onClick={() => setInputType("password")}>

                                        <Eye className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="confirmNewPassword">Cofirm Password</Label>
                            </div>
                            <div className="relative">

                                <Input id="confirmNewPassword" type={inputType} name="confirmNewPassword" onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                                {inputType === "password" ? (
                                    <div className="absolute top-1.25 right-2 hover:bg-gray-50  cursor-pointer transition-all duration-300 py-2 px-2 rounded-full" onClick={() => setInputType("text")}>

                                        <EyeOff className="w-3 h-3" />
                                    </div>
                                ) : (
                                    <div className="absolute top-1.25 right-2 hover:bg-gray-50  cursor-pointer transition-all duration-300 py-2 px-2 rounded-full" onClick={() => setInputType("password")}>

                                        <Eye className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="submit" className="w-full" disabled={isPending} onClick={handleClick}>
                                {isPending ? "Updating..." : "Update Password"}
                            </Button>

                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    </div>
}