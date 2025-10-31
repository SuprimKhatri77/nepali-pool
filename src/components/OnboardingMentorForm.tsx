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
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { MentorOnboardingFormProps } from "../../types/all-types";
import { Spinner } from "./ui/spinner";
import { FieldError } from "./ui/field";

export default function MentorOnboardingForm({
  className,
  currentUserId,
  ...props
}: MentorOnboardingFormProps) {
  // const [citizenshipPhotoUrl, setCitizenshipPhotoUrl] = useState<string>("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [resumePhotoUrl, setResumePhotoUrl] = useState<string>("");
  const router = useRouter();
  const [gender, setGender] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const initialState: FormState = {
    errors: {},
  } as FormState;

  const params = useSearchParams();

  const message = params.get("message");

  useEffect(() => {
    if (message) {
      toast.info(decodeURIComponent(message), { position: "top-right", action:{
        label:"X",
        onClick: () => toast.dismiss()
      },
      duration: 3000});

      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState(null, "", url.toString());
    }
  }, [message]);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    OnboardingMentor,
    initialState
  );

  const [location, setLocation] = useState({
    city: "",
    country: "",
    zipCode: "",
  });

  // navigator is a browser api so, we have to run in use clinet page.
  const fillInputs = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // reverse geo coding for country, zip and city location.
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const country = data.address.country || "";
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
          const zip = data.address.postcode || "";

          setLocation({
            city: city,
            country: country,
            zipCode: zip,
          }); // to update ui state when value change i used another state location.
        } catch (err) {
          console.error("Failed to fetch location data", err);
        }
      },
      (err) => {
        console.error(err);
        alert("Could not get your location");
      }
    );
  };

  useEffect(() => {
    if (state.message) {
      toast(state.message);
    }
  }, [state.message]);

  useEffect(() => {
    fillInputs();
  }, []);

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state.redirectTo, router, state.success]);

  const canProceedStep1 = profilePhotoUrl && gender;
  const canProceedStep2 = true;
  const canSubmit = resumePhotoUrl && profilePhotoUrl && gender;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4",
        className
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Mentor Onboarding
                </CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Step {currentStep} of {totalSteps}
                </CardDescription>
              </div>
              <div className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between items-center pt-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                      currentStep >= step
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {step}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium",
                      currentStep >= step ? "text-green-600" : "text-gray-500"
                    )}
                  >
                    {step === 1 && "Personal"}
                    {step === 2 && "Location"}
                    {step === 3 && "Documents"}
                  </span>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="overflow-hidden">
            <form action={formAction}>
              <div className="relative">
                {/* Step 1: Personal Information */}
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    currentStep === 1
                      ? "opacity-100 translate-x-0"
                      : currentStep > 1
                        ? "opacity-0 -translate-x-full absolute inset-0"
                        : "opacity-0 translate-x-full absolute inset-0"
                  )}
                >
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Personal Information
                      </h3>
                      <p className="text-gray-600">
                        Tell us about yourself to get started
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <Label
                        htmlFor="profilePhotoUrl"
                        className="text-sm font-medium text-gray-700"
                      >
                        Profile Picture *
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

                    <div className="grid gap-4">
                      <Label
                        htmlFor="bio"
                        className="text-sm font-medium text-gray-700"
                      >
                        Bio *
                      </Label>
                      <Textarea
                        defaultValue={state.inputs?.bio}
                        id="bio"
                        name="bio"
                        className="min-h-[120px] resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                        placeholder="Tell us about yourself and why you want to be a mentor..."
                        required
                      />
                      {state.errors?.bio && (
                        <p className="text-red-500 text-sm">
                          {state.errors.bio[0]}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <Label
                        htmlFor="sex"
                        className="text-sm font-medium text-gray-700"
                      >
                        Gender *
                      </Label>
                      <Select
                        onValueChange={(value) => setGender(value)}
                        value={gender}
                      >
                        <SelectTrigger className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500">
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
                </div>

                {/* Step 2: Location Details */}
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    currentStep === 2
                      ? "opacity-100 translate-x-0"
                      : currentStep > 2
                        ? "opacity-0 -translate-x-full absolute inset-0"
                        : "opacity-0 translate-x-full absolute inset-0"
                  )}
                >
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Location Details
                      </h3>
                      <p className="text-gray-600">
                        Please enter your current living location, not your
                        place of origin.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label
                          htmlFor="country"
                          className="text-sm font-medium text-gray-700"
                        >
                          Country *
                        </Label>
                        <Input
                          defaultValue={location.country}
                          type="text"
                          id="country"
                          name="country"
                          placeholder="e.g., Nepal"
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                        {state.errors?.country && (
                          <FieldError>{state.errors.country[0]}</FieldError>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <Label
                          htmlFor="nationality"
                          className="text-sm font-medium text-gray-700"
                        >
                          Nationality *
                        </Label>
                        <Input
                          defaultValue={state.inputs?.nationality}
                          type="text"
                          id="nationality"
                          name="nationality"
                          placeholder="e.g., Nepalese"
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                          City *
                        </Label>
                        <Input
                          defaultValue={state.inputs?.city || location.city || ""}
                          type="text"
                          id="city"
                          name="city"
                          placeholder="e.g., Kathmandu"
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                          Zip Code *
                        </Label>
                        <Input
                          defaultValue={location.zipCode}
                          id="zipCode"
                          type="text"
                          name="zipCode"
                          placeholder="e.g., 3211"
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                        Phone Number *
                      </Label>
                      <Input
                        inputMode="numeric"
                        defaultValue={state.inputs?.phoneNumber}
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        placeholder="e.g., 1234567890"
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                      {state.errors?.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {state.errors.phoneNumber[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 3: Required Documents */}
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    currentStep === 3
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0"
                  )}
                >
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Required Documents
                      </h3>
                      <p className="text-gray-600">
                        Upload your credentials for verification
                      </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
                      <div className="flex gap-3">
                        <svg
                          className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Document Requirements
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            Please ensure all documents are clear and legible.
                            Accepted formats: JPG, PNG, PDF
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <Label
                        htmlFor="resumePhotoUrl"
                        className="text-sm font-medium text-gray-700"
                      >
                        Resume *
                      </Label>
                      <CustomProfileUploader
                        currentImage={resumePhotoUrl}
                        onUploadComplete={(url: string) =>
                          setResumePhotoUrl(url)
                        }
                        imageUploadName="Upload Resume Photo"
                      />
                      <Input
                        type="hidden"
                        name="resume"
                        value={resumePhotoUrl}
                        required
                      />
                      {state.errors?.resume && (
                        <FieldError>{state.errors.resume[0]}</FieldError>
                      )}
                    </div>

                    {/* <div className="grid gap-4">
                      <Label
                        htmlFor="citizenshipPhotoUrl"
                        className="text-sm font-medium text-gray-700"
                      >
                        Citizenship *
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
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-6"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && !canProceedStep1) ||
                      (currentStep === 2 && !canProceedStep2)
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending || !canSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Spinner />
                    ) : (
                      <>
                        Submit Application
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Input type="hidden" value={currentUserId} name="currentUserId" />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
