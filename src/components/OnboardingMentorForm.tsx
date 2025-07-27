"use client"

import type React from "react"

import { cn } from "@/components/lib/utils"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"



type MentorOnboardingFormProps = {
    className?: string;
    currentUserId?: string;
};

export default function MentorOnboardingForm({ className, currentUserId, ...props }: MentorOnboardingFormProps) {
    const [citizenshipPhotoUrl, setCitizenshipPhotoUrl] = useState<string>("")
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("")
    const [resumePhotoUrl, setResumePhotoUrl] = useState<string>("")
    const router = useRouter()
    const [gender, setGender] = useState<string>("")

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
                                {state.errors?.imageUrl && (
                                    <p className="text-red-400 text-sm">{state.errors.imageUrl[0]}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="bio">Bio: </Label>
                                <Textarea defaultValue="I want to be a mentor!" id="bio" name="bio" required />
                                {state.errors?.bio && (
                                    <p className="text-red-400 text-sm">{state.errors.bio[0]}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="country">Country</Label>
                                <Input defaultValue="Nepal" type="text" id="country" name="country" placeholder="eg: Nepal" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input defaultValue="Nepalese" type="text" id="nationality" name="nationality" placeholder="eg: Nepalese" required />
                                {state.errors?.nationality && (
                                    <p className="text-red-400 text-sm">{state.errors.nationality[0]}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="city">City</Label>
                                <Input defaultValue="Kathmandu" type="text" id="city" name="city" placeholder="eg: Kathmandu" required />
                                {state.errors?.city && (
                                    <p className="text-red-400 text-sm">{state.errors.city[0]}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="zipCode">Zip Code</Label>

                                </div>
                                <Input defaultValue="3211" id="zipCode" type="text" name="zipCode" placeholder="eg: 3211" required />
                                {state.errors?.zipcode && (
                                    <p className="text-red-400 text-sm">{state.errors.zipcode[0]}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>

                                </div>
                                <Input inputMode="numeric" defaultValue="1234567890" id="phoneNumber" type="text" name="phoneNumber" placeholder="eg: 1234567890" required />
                                {state.errors?.phoneNumber && (
                                    <p className="text-red-400 text-sm">{state.errors.phoneNumber[0]}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="sex">Gender</Label>
                                <Select name="sex" onValueChange={(value) => setGender(value)} value={gender}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="select one" />
                                    </SelectTrigger>
                                    <SelectContent id='gender'>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {state.errors?.sex && <p className="text-sm text-destructive">{state.errors.sex[0]}</p>}
                                <input type="hidden" name="sex" value={gender} />
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
                                <Button type="submit" disabled={isPending || !resumePhotoUrl || !citizenshipPhotoUrl || !profilePhotoUrl || !gender} className="w-full">
                                    {isPending ? "Submitting....." : "Submit"}
                                </Button>

                            </div>
                        </div>
                        <Input type="hidden" value={currentUserId} name="currentUserId" />

                    </form>
                </CardContent>
            </Card>
        </div >
    )
}
