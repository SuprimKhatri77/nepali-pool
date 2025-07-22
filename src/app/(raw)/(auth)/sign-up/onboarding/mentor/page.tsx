"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"



type MentorOnboardingFormProps = {
    className?: string;
};

export default function MentorOnboardingForm({ className, ...props }: MentorOnboardingFormProps) {


    return (
        <div className={cn("flex flex-col gap-6 py-5 max-w-[700px] mx-auto  justify-center min-h-screen", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Mentor Onboarding Form</CardTitle>
                    <CardDescription>Please fill all the form fields and help us verify if you are a valid candidate or not.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="country">Country</Label>
                                <Input type="text" id="country" name="country" placeholder="eg: Nepal" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="city">City</Label>
                                <Input type="text" id="city" name="city" placeholder="eg: Kathmandu" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="zipCode">Zip Code</Label>

                                </div>
                                <Input id="zipCode" type="text" name="zipCode" placeholder="eg: 3211" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>

                                </div>
                                <Input id="phoneNumber" type="tel" name="phoneNumber" placeholder="eg: 1234567890" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="sex">Sex</Label>

                                </div>
                                <Input id="sex" type="text" name="sex" placeholder="eg: 1234567890" required />
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
