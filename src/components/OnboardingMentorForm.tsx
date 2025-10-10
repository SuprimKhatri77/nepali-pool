"use client";

import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomProfileUploader from "@/components/CustomImageButton";
import { useActionState, useEffect, useState } from "react";
import {
  type FormState,
  OnboardingMentor,
} from "../../server/actions/onboarding/onboardingMentor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { MentorOnboardingFormProps } from "../../types/all-types";
import { SpinnerCustom } from "./ui/spinner";

export default function MentorOnboardingForm({
  className,
  currentUserId,
  ...props
}: MentorOnboardingFormProps) {
  const [citizenshipPhotoUrl, setCitizenshipPhotoUrl] = useState<string>("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [resumePhotoUrl, setResumePhotoUrl] = useState<string>("");
  const router = useRouter();
  const [gender, setGender] = useState<string>("");

  const initialState: FormState = {
    errors: {},
  } as FormState;

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    OnboardingMentor,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      toast(state.message);
    }
  }, [state.message]);

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state.redirectTo, router]);

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4",
        className
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold text-emerald-900">
              Mentor Onboarding
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Please fill out all the form fields to help us verify your
              candidacy as a mentor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <div className="flex flex-col gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
                    Personal Information
                  </h3>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="profilePhotoUrl"
                      className="text-sm font-medium text-gray-700"
                    >
                      Profile Picture
                    </Label>
                    <CustomProfileUploader
                      currentImage={profilePhotoUrl}
                      onUploadComplete={(url: string) =>
                        setProfilePhotoUrl(url)
                      }
                      imageUploadName="Upload Your Photo"
                    />
                    <Input
                      type="hidden"
                      name="imageUrl"
                      value={profilePhotoUrl}
                      required
                    />
                    {state.errors?.imageUrl && (
                      <p className="text-red-500 text-sm">
                        {state.errors.imageUrl[0]}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-gray-700"
                    >
                      Bio
                    </Label>
                    <Textarea
                      defaultValue="I want to be a mentor!"
                      id="bio"
                      name="bio"
                      className="min-h-[100px] resize-none"
                      placeholder="Tell us about yourself and why you want to be a mentor..."
                      required
                    />
                    {state.errors?.bio && (
                      <p className="text-red-500 text-sm">
                        {state.errors.bio[0]}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="sex"
                      className="text-sm font-medium text-gray-700"
                    >
                      Gender
                    </Label>
                    <Select
                      name="sex"
                      onValueChange={(value) => setGender(value)}
                      value={gender}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent id="gender">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.sex && (
                      <p className="text-red-500 text-sm">
                        {state.errors.sex[0]}
                      </p>
                    )}
                    <input type="hidden" name="sex" value={gender} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
                    Location Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium text-gray-700"
                      >
                        Country
                      </Label>
                      <Input
                        defaultValue="Nepal"
                        type="text"
                        id="country"
                        name="country"
                        placeholder="e.g., Nepal"
                        required
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label
                        htmlFor="nationality"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nationality
                      </Label>
                      <Input
                        defaultValue="Nepalese"
                        type="text"
                        id="nationality"
                        name="nationality"
                        placeholder="e.g., Nepalese"
                        required
                      />
                      {state.errors?.nationality && (
                        <p className="text-red-500 text-sm">
                          {state.errors.nationality[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700"
                      >
                        City
                      </Label>
                      <Input
                        defaultValue="Kathmandu"
                        type="text"
                        id="city"
                        name="city"
                        placeholder="e.g., Kathmandu"
                        required
                      />
                      {state.errors?.city && (
                        <p className="text-red-500 text-sm">
                          {state.errors.city[0]}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label
                        htmlFor="zipCode"
                        className="text-sm font-medium text-gray-700"
                      >
                        Zip Code
                      </Label>
                      <Input
                        defaultValue="3211"
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        placeholder="e.g., 3211"
                        required
                      />
                      {state.errors?.zipCode && (
                        <p className="text-red-500 text-sm">
                          {state.errors.zipCode[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      inputMode="numeric"
                      defaultValue="1234567890"
                      id="phoneNumber"
                      type="text"
                      name="phoneNumber"
                      placeholder="e.g., 1234567890"
                      required
                    />
                    {state.errors?.phoneNumber && (
                      <p className="text-red-500 text-sm">
                        {state.errors.phoneNumber[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-emerald-900 border-b border-emerald-100 pb-2">
                    Required Documents
                  </h3>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="resumePhotoUrl"
                      className="text-sm font-medium text-gray-700"
                    >
                      Resume
                    </Label>
                    <CustomProfileUploader
                      currentImage={resumePhotoUrl}
                      onUploadComplete={(url: string) => setResumePhotoUrl(url)}
                      imageUploadName="Upload Resume Photo"
                    />
                    <Input
                      type="hidden"
                      name="resume"
                      value={resumePhotoUrl}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="citizenshipPhotoUrl"
                      className="text-sm font-medium text-gray-700"
                    >
                      Citizenship
                    </Label>
                    <CustomProfileUploader
                      currentImage={citizenshipPhotoUrl}
                      onUploadComplete={(url: string) =>
                        setCitizenshipPhotoUrl(url)
                      }
                      imageUploadName="Upload Citizenship Photo"
                    />
                    <Input
                      type="hidden"
                      name="citizenshipPhotoUrl"
                      value={citizenshipPhotoUrl}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      !resumePhotoUrl ||
                      !citizenshipPhotoUrl ||
                      !profilePhotoUrl ||
                      !gender
                    }
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? <SpinnerCustom /> : "Submit Application"}
                  </Button>
                </div>
              </div>
              <Input type="hidden" value={currentUserId} name="currentUserId" />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
