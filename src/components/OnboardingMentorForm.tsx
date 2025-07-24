"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CustomProfileUploader from "@/components/CustomImageButton"
import { useActionState, useEffect, useState } from "react"
import { FormState, OnboardingMentor } from "../../server/actions/onboardingMentor"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Textarea } from "./ui/textarea"



type MentorOnboardingFormProps = {
    className?: string;
    currentUserId?: string;
};

export default function MentorOnboardingForm({ className, currentUserId, ...props }: MentorOnboardingFormProps) {
    const [citizenshipPhotoUrl, setCitizenshipPhotoUrl] = useState<string>("")
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("")
    const [resumePhotoUrl, setResumePhotoUrl] = useState<string>("")
    const router = useRouter()

    const initialState: FormState = {
        errors: {},

    } as FormState

    const [state, formAction, isPending] = useActionState<FormState, FormData>(OnboardingMentor, initialState)

    useEffect(() => {
        if (state.message) {
            toast(state.message)
        }

    }, [state.message])

    useEffect(() => {
        if (state.success && state.redirectTo) {
            router.replace(state.redirectTo)
        }
    }, [state.redirectTo, router])

    return (
        <div className={cn("flex flex-col gap-6 py-5 max-w-[700px] mx-auto  justify-center min-h-screen", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Mentor Onboarding Form</CardTitle>
                    <CardDescription>Please fill all the form fields and help us verify if you are a valid candidate or not.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="profilePhotoUrl">Profile Picture: </Label>

                                </div>
                                <CustomProfileUploader
                                    currentImage={profilePhotoUrl}
                                    onUploadComplete={(url: string) => setProfilePhotoUrl(url)} imageUploadName="Upload Your Photo" />
                                <Input type="hidden" name="imageUrl" value={profilePhotoUrl} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="bio">Bio: </Label>
                                <Textarea defaultValue="I want to be a mentor!" id="bio" name="bio" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="country">Country</Label>
                                <Input defaultValue="Nepal" type="text" id="country" name="country" placeholder="eg: Nepal" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input defaultValue="Nepalese" type="text" id="nationality" name="nationality" placeholder="eg: Nepalese" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="city">City</Label>
                                <Input defaultValue="Kathmandu" type="text" id="city" name="city" placeholder="eg: Kathmandu" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="zipCode">Zip Code</Label>

                                </div>
                                <Input defaultValue="3211" id="zipCode" type="text" name="zipCode" placeholder="eg: 3211" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>

                                </div>
                                <Input inputMode="numeric" defaultValue="1234567890" id="phoneNumber" type="text" name="phoneNumber" placeholder="eg: 1234567890" required />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="sex">Sex</Label>

                                </div>
                                <Input defaultValue="male" id="sex" type="text" name="sex" placeholder="eg: male" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="resumePhotoUrl">Resume</Label>

                                </div>
                                <CustomProfileUploader
                                    currentImage={resumePhotoUrl}
                                    onUploadComplete={(url: string) => setResumePhotoUrl(url)} imageUploadName="Upload Resume Photo" />
                                <Input type="hidden" name="resume" value={resumePhotoUrl} required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="citizenshipPhotoUrl">Citizenship</Label>

                                </div>
                                <CustomProfileUploader
                                    currentImage={citizenshipPhotoUrl}
                                    onUploadComplete={(url: string) => setCitizenshipPhotoUrl(url)} imageUploadName="Upload Citizenship Photo" />
                                <Input type="hidden" name="citizenshipPhotoUrl" value={citizenshipPhotoUrl} required />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button type="submit" disabled={isPending || !resumePhotoUrl || !citizenshipPhotoUrl || !profilePhotoUrl} className="w-full">
                                    {isPending ? "Submitting....." : "Submit"}
                                </Button>

                            </div>
                        </div>
                        <Input type="hidden" value={currentUserId} name="currentUserId" />

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
