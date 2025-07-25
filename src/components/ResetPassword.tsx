"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { authClient } from "../../server/lib/auth/auth-client"
import { toast } from "sonner"

export default function ResetPassword({ token }: { token: string }) {
    const [isPending, setIsPending] = useState<boolean>(false)
    const [newPassword, setNewPassword] = useState<string>("")
    const [inputType, setInputType] = useState<string>("password")
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
    const router = useRouter()
    const params = useSearchParams()

    const tokenFromParams = params.get("token") as string;

    if (tokenFromParams !== token) {
        router.replace("/login/forgot-password?error=invalid_token")
    }

    const handleClick = async () => {
        if (!newPassword || !confirmNewPassword) {
            toast.error("Please fill in all fields")
            return
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return
        }

        setIsPending(true)

        try {
            const { data, error } = await authClient.resetPassword({
                newPassword,
                token,
            })

            if (error) {
                console.error("Reset password error:", error)
                if (
                    error.message?.includes("invalid") ||
                    error.message?.includes("expired") ||
                    error.message?.includes("token")
                ) {
                    toast.error("Reset link is invalid or expired. Please request a new one.")
                    router.replace("/login/forgot-password?error=invalid_token")
                } else {
                    toast.error(error.message || "Failed to reset password")
                }
            } else {
                toast.success("Password changed successfully, redirecting to login...")
                setTimeout(() => {
                    router.replace("/login")
                }, 1500)
            }
        } catch (error) {
            console.error("Reset password error:", error)
            toast.error("An unexpected error occurred. Please try again.")
            router.replace("/login/forgot-password?error=invalid_token")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-[700px] mx-auto justify-center min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Reset your Password</CardTitle>
                    <CardDescription>Enter your new password and confirm it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={inputType}
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setInputType(inputType === "password" ? "text" : "password")}
                                >
                                    {inputType === "password" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="confirmNewPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmNewPassword"
                                    type={inputType}
                                    name="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setInputType(inputType === "password" ? "text" : "password")}
                                >
                                    {inputType === "password" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending || !newPassword || !confirmNewPassword}
                            onClick={handleClick}
                        >
                            {isPending ? "Updating..." : "Update Password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
