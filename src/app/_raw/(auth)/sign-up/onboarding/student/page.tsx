"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"


export default function StudentOnboardingForm({ className, ...props }: React.ComponentProps<"div">) {


    return (
        <div className={cn("flex flex-col gap-6 max-w-[700px] mx-auto  justify-center min-h-screen", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Student Onboarding Form</CardTitle>
                    <CardDescription>Please fill all the form fields and help us personalize the dashboard for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" name="bio" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="favoriteDestination">Favorite Destinations</Label>

                                </div>
                                <Input id="favoriteDestination" type="text" name="favoriteDestination" placeholder="eg: denmark,portugal" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>

                            </div>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

