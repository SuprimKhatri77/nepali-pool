"use client"
import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import CustomProfileUploader from "./CustomImageButton"
import { useActionState, useEffect, useState } from "react"
import { getNames } from "country-list"
import MultiSelectCountries from "./multi-select-countires"
import studentOnboarding, { type FormState } from "../../server/actions/onboardingStudent"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type StudentOnboardingFormType = {
    className?: string
    currentUserId: string
}

export default function StudentOnboardingForm({ className, currentUserId, ...props }: StudentOnboardingFormType) {
    const initialState: FormState = {
        errors: {},
    } as FormState

    const [profilePicture, setProfilePicture] = useState<string>("")
    const [selectedCountries, setSelectedCountries] = useState<string[]>([])
    const countries = getNames()
    const [state, formAction, isPending] = useActionState<FormState, FormData>(studentOnboarding, initialState)
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(state.message)
            setTimeout(() => {
                router.replace("/dashboard/student")
            }, 1500)
        }
    }, [state.success, router])

    return (
        <div className={cn("flex flex-col gap-6 max-w-[700px] mx-auto justify-center min-h-screen", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Student Onboarding Form</CardTitle>
                    <CardDescription>
                        Please fill all the form fields and help us personalize the dashboard for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="profile-picture">Profile Picture</Label>
                                <CustomProfileUploader
                                    imageUploadName="Profile Picture"
                                    onUploadComplete={(url: string) => setProfilePicture(url)}
                                    currentImage={profilePicture}
                                />
                                <input type="hidden" name="imageUrl" value={profilePicture} />
                                {state.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>}
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" name="bio" placeholder="Tell us about yourself..." required />
                                {state.errors?.bio && <p className="text-sm text-destructive">{state.errors.bio[0]}</p>}
                            </div>

                            <div className="grid gap-3">
                                <Label>Favorite Destinations</Label>
                                <MultiSelectCountries
                                    countries={countries}
                                    selectedCountries={selectedCountries}
                                    onSelectionChange={setSelectedCountries}
                                    placeholder="Search for countries you'd like to visit..."
                                />

                                {selectedCountries.map((country, index) => (
                                    <input key={`${country}-${index}`} type="hidden" name="favoriteDestination" value={country} />
                                ))}
                                {state.errors?.favoriteDestination && (
                                    <p className="text-sm text-destructive">{state.errors.favoriteDestination[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={isPending || !profilePicture}>
                                    {isPending ? "Submitting...." : "Submit"}
                                </Button>
                                {state.message && !state.success && <p className="text-sm text-destructive">{state.message}</p>}
                            </div>
                        </div>
                        <input type="hidden" name="userId" value={currentUserId} />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
