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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomProfileUploader from "./CustomImageButton";
import { useActionState, useEffect, useState } from "react";
import { getNames } from "country-list";
import MultiSelectCountries from "./multi-select-countires";
import studentOnboarding, {
  type FormState,
} from "../../server/actions/onboarding/onboardingStudent";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StudentOnboardingFormType } from "../../types/all-types";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Spinner } from "./ui/spinner";

export default function StudentOnboardingForm({
  className,
  currentUserId,
  ...props
}: StudentOnboardingFormType) {
  const initialState: FormState = {
    errors: {},
  } as FormState;

  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const countries = getNames();
  const [gender, setGender] = useState<string>("");

  // Form data state to persist across steps
  const [formData, setFormData] = useState({
    bio: "",
    district: "",
    city: "",
    phoneNumber: "",
  });

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    studentOnboarding,
    initialState
  );
  const router = useRouter();

  const params = useSearchParams();

  const message = params.get("message");

  useEffect(() => {
    if (message) {
      toast.info(decodeURIComponent(message), { position: "top-right" });

      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState(null, "", url.toString());
    }
  }, [message]);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setTimeout(() => {
        router.replace("/dashboard/student");
      }, 1100);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, router, state.timestamp, state.message]);

  const canProceedStep1 = profilePicture && formData.bio.trim().length > 0;
  const canProceedStep2 =
    formData.district.trim().length > 0 &&
    formData.city.trim().length > 0 &&
    formData.phoneNumber.trim().length > 0 &&
    gender.length > 0;

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Profile" },
    { number: 2, title: "Details" },
    { number: 3, title: "Preferences" },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-6 max-w-[700px] mx-auto justify-center min-h-screen py-12 px-4",
        className
      )}
      {...props}
    >
      <div className="space-y-2 text-center mb-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Welcome aboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Let&apos;s get your profile set up in just a few steps
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                  currentStep > step.number
                    ? "bg-green-600 text-white"
                    : currentStep === step.number
                      ? "bg-green-600 text-white ring-4 ring-green-100"
                      : "bg-gray-100 text-gray-400"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  currentStep >= step.number
                    ? "text-green-600"
                    : "text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-2 transition-colors duration-300",
                  currentStep > step.number ? "bg-green-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Progress value={progress} className="h-1.5 bg-gray-100" />

      <Card className="border-green-100 shadow-lg shadow-green-50">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl">
            {currentStep === 1 && "Your Profile"}
            {currentStep === 2 && "Personal Details"}
            {currentStep === 3 && "Travel Preferences"}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStep === 1 && "Upload a photo and tell us about yourself"}
            {currentStep === 2 && "Share your contact information and location"}
            {currentStep === 3 && "Let us know where you'd love to explore"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="space-y-6">
              {/* Step 1: Profile Picture & Bio */}
              <div
                className={cn(
                  "space-y-6 animate-in fade-in duration-300",
                  currentStep === 1 ? "block" : "hidden"
                )}
              >
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="space-y-3 w-full">
                    <Label
                      htmlFor="profile-picture"
                      className="text-base font-medium"
                    >
                      Profile Picture
                    </Label>
                    <div className="flex justify-center">
                      <CustomProfileUploader
                        imageUploadName="Profile Picture"
                        onUploadComplete={(url: string) =>
                          setProfilePicture(url)
                        }
                        currentImage={profilePicture}
                      />
                    </div>
                    <input
                      type="hidden"
                      name="imageUrl"
                      value={profilePicture}
                    />
                    {state.errors?.imageUrl && (
                      <p className="text-sm text-red-600 text-center">
                        {state.errors.imageUrl[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 w-full">
                    <Label htmlFor="bio" className="text-base font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself, your interests, and what drives you..."
                      required
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="min-h-[120px] resize-none focus-visible:ring-green-600"
                    />
                    {state.errors?.bio && (
                      <p className="text-sm text-red-600">
                        {state.errors.bio[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Location & Contact */}
              <div
                className={cn(
                  "space-y-6 animate-in fade-in duration-300",
                  currentStep === 2 ? "block" : "hidden"
                )}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="district" className="text-base font-medium">
                      District
                    </Label>
                    <Input
                      type="text"
                      id="district"
                      name="district"
                      placeholder="e.g., Rupandehi"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      required
                      className="focus-visible:ring-green-600"
                    />
                    {state.errors?.district && (
                      <p className="text-sm text-red-600">
                        {state.errors.district[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-base font-medium">
                      City
                    </Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="e.g., Butwal"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                      className="focus-visible:ring-green-600"
                    />
                    {state.errors?.city && (
                      <p className="text-sm text-red-600">
                        {state.errors.city[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number
                    </Label>
                    <Input
                      type="text"
                      id="phone"
                      name="phoneNumber"
                      placeholder="e.g., 9800000000"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      required
                      className="focus-visible:ring-green-600"
                    />
                    {state.errors?.phoneNumber && (
                      <p className="text-sm text-red-600">
                        {state.errors.phoneNumber[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="sex" className="text-base font-medium">
                      Gender
                    </Label>
                    <Select
                      defaultValue={state.inputs?.sex}
                      onValueChange={(value) => setGender(value)}
                      value={gender}
                    >
                      <SelectTrigger className="w-full focus:ring-green-600">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent id="gender">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.sex && (
                      <p className="text-sm text-red-600">
                        {state.errors.sex[0]}
                      </p>
                    )}
                    <input type="hidden" name="sex" value={gender} />
                  </div>
                </div>
              </div>

              {/* Step 3: Destinations */}
              <div
                className={cn(
                  "space-y-6 animate-in fade-in duration-300",
                  currentStep === 3 ? "block" : "hidden"
                )}
              >
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Favorite Destinations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select the countries you dream of exploring
                  </p>
                  <MultiSelectCountries
                    countries={countries}
                    selectedCountries={selectedCountries}
                    onSelectionChange={setSelectedCountries}
                    placeholder="Search for countries you'd like to visit..."
                  />

                  {selectedCountries.map((country, index) => (
                    <input
                      key={`${country}-${index}`}
                      type="hidden"
                      name="favoriteDestination"
                      value={country}
                      // defaultValue={state.inputs?.favoriteDestination}
                    />
                  ))}
                  {state.errors?.favoriteDestination && (
                    <p className="text-sm text-red-600">
                      {state.errors.favoriteDestination[0]}
                    </p>
                  )}
                </div>

                {selectedCountries.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-2">
                      Selected destinations ({selectedCountries.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountries.map((country) => (
                        <span
                          key={country}
                          className="px-3 py-1 bg-white text-green-700 rounded-full text-sm font-medium border border-green-200"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="group"
                >
                  <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !canProceedStep1) ||
                      (currentStep === 2 && !canProceedStep2) ||
                      isPending
                    }
                    className="bg-green-600 hover:bg-green-700 group disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending || !profilePicture}
                    className="bg-green-600 hover:bg-green-700 min-w-[120px]"
                  >
                    {isPending ? <Spinner /> : "Complete Setup"}
                  </Button>
                )}
              </div>

              {state.message && !state.success && (
                <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {state.message}
                </p>
              )}
            </div>
            <input type="hidden" name="userId" value={currentUserId} />
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
