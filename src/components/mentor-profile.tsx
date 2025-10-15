"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  MapPin,
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { MentorProfileSelectType, UserSelectType } from "../../lib/db/schema";
import Image from "next/image";
import CustomProfileUploader from "./CustomImageButton";
import {
  FormState,
  updatePersonal,
} from "../../server/actions/profile/mentor-profile/update-personal";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import {
  ContactFormState,
  updateContact,
} from "../../server/actions/profile/mentor-profile/update-contact";
import { updatePassword } from "../../server/actions/update-password/updatePassword";

type MentorProfileProps = MentorProfileSelectType & {
  user: UserSelectType;
};

export function MentorProfile({
  mentorRecord,
}: {
  mentorRecord: MentorProfileProps;
}) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatePasswordError, setUpdatePasswordError] = useState<{
    newPassword?: string[] | undefined;
  }>({ newPassword: [""] });

  const currentProfileImage =
    uploadedImageUrl || mentorRecord.user.image || mentorRecord.user.image;

  const getVerificationBadge = () => {
    switch (mentorRecord.verifiedStatus) {
      case "accepted":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 font-medium">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
    timestamp: Date.now(),
    inputs: {},
  };

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updatePersonal,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      setIsEditingPersonal(false);
      toast.success(state.message);
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message, state.timestamp]);

  const contactInitialState: ContactFormState = {
    errors: {},
    message: "",
    success: false,
    timestamp: Date.now(),
    inputs: {},
  };
  const [contactState, contactFormAction, contactIsPending] = useActionState<
    ContactFormState,
    FormData
  >(updateContact, contactInitialState);

  useEffect(() => {
    if (contactState.success && contactState.message) {
      setIsEditingContact(false);
      toast.success(contactState.message);
    }
    if (!contactState.success && contactState.message) {
      toast.error(contactState.message);
    }
  }, [contactState.success, contactState.message, contactState.timestamp]);

  const handleUpdatePassword = async () => {
    setIsUpdating(true);
    if (newPassword !== confirmNewPassword) {
      setIsUpdating(false);
      toast.error("Password don't match");
      return;
    }

    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (!result.success && result.message) {
        setUpdatePasswordError(result.error);
        toast.error(result.message);
      }
      if (result.success && result.message) {
        setShowPasswordSection(false);
        toast.success(result.message);
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsUpdating(false);
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your professional information and credentials
          </p>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4">
              <Avatar className="h-16 w-16 sm:h-16 sm:w-16 border border-gray-200 flex-shrink-0">
                <AvatarImage
                  src={
                    mentorRecord.imageUrl ||
                    mentorRecord.user.image ||
                    undefined
                  }
                  alt={mentorRecord.user.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-medium">
                  {mentorRecord.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 w-full">
                <CardTitle className="text-lg sm:text-xl text-gray-900 mb-1 capitalize break-words">
                  {mentorRecord.user.name}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm flex items-center gap-1.5 mb-3 break-all">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{mentorRecord.user.email}</span>
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200 font-normal text-xs"
                  >
                    {mentorRecord.user.role}
                  </Badge>
                  {mentorRecord.user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 font-normal text-xs"
                    >
                      Email Verified
                    </Badge>
                  )}
                  {getVerificationBadge()}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 h-auto p-1 bg-gray-100 border border-gray-200 gap-1">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2.5 px-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Personal</span>
              <span className="sm:hidden ml-1">Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2.5 px-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden ml-1">Contact</span>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2.5 px-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden ml-1">Docs</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2.5 px-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden ml-1">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg text-gray-900">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Update your personal details and bio
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                    variant={isEditingPersonal ? "outline" : "default"}
                    size="sm"
                    className={
                      isEditingPersonal
                        ? "w-full sm:w-auto"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                    }
                    disabled={isPending || contactIsPending}
                  >
                    {isEditingPersonal ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <form className="space-y-5 sm:space-y-6" action={formAction}>
                  {/* Profile Picture Section */}
                  <Field className="space-y-3">
                    <FieldLabel className="text-sm font-medium text-gray-900">
                      Profile Picture
                    </FieldLabel>
                    {isEditingPersonal ? (
                      <div className="flex flex-col gap-3">
                        <CustomProfileUploader
                          currentImage={currentProfileImage || undefined}
                          onUploadComplete={(url: string) =>
                            setUploadedImageUrl(url)
                          }
                          imageUploadName="Profile Picture"
                        />
                        <input
                          type="hidden"
                          name="imageUrl"
                          value={
                            uploadedImageUrl || mentorRecord.imageUrl || ""
                          }
                          required
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border border-gray-200">
                          <AvatarImage
                            src={currentProfileImage || undefined}
                            alt={mentorRecord.user.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-medium">
                            {mentorRecord.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </Field>

                  <Separator />

                  {/* Name Field */}
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="name"
                      className="text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </FieldLabel>
                    <Input
                      id="name"
                      name="fullName"
                      defaultValue={
                        !state.success &&
                        state.inputs?.fullName &&
                        isEditingPersonal
                          ? state.inputs.fullName
                          : mentorRecord.user.name || ""
                      }
                      disabled={!isEditingPersonal}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {state.errors?.fullName && isEditingPersonal && (
                      <FieldError>{state.errors.fullName[0]}</FieldError>
                    )}
                  </Field>

                  {/* Email Field (Read-only) */}
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900"
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={mentorRecord.user.email}
                      disabled
                      className="bg-gray-50 border-gray-300 text-gray-500"
                    />
                    <FieldDescription className="text-xs text-gray-500">
                      Your email address cannot be changed
                    </FieldDescription>
                  </Field>

                  {/* Nationality Field */}
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="nationality"
                      className="text-sm font-medium text-gray-900"
                    >
                      Nationality
                    </FieldLabel>
                    <Input
                      id="nationality"
                      name="nationality"
                      defaultValue={
                        !state.success &&
                        state.inputs?.nationality &&
                        isEditingPersonal
                          ? state.inputs.nationality
                          : mentorRecord.nationality || ""
                      }
                      placeholder="e.g., American, British"
                      disabled={!isEditingPersonal}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {state.errors?.nationality && isEditingPersonal && (
                      <FieldError>{state.errors.nationality[0]}</FieldError>
                    )}
                  </Field>

                  {/* Bio Field */}
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="bio"
                      className="text-sm font-medium text-gray-900"
                    >
                      Professional Bio
                    </FieldLabel>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={
                        !state.success && state.inputs?.bio && isEditingPersonal
                          ? state.inputs.bio
                          : mentorRecord.bio || ""
                      }
                      placeholder="Tell students about your experience and expertise..."
                      disabled={!isEditingPersonal}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500 min-h-[120px] resize-none"
                    />
                    {state.errors?.bio && isEditingPersonal && (
                      <FieldError>{state.errors?.bio[0]}</FieldError>
                    )}
                  </Field>

                  {isEditingPersonal && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingPersonal(false)}
                        disabled={isPending}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                        disabled={isPending}
                      >
                        {isPending ? <Spinner /> : "Save Changes"}
                      </Button>
                    </div>
                  )}
                  <input
                    type="hidden"
                    name="userId"
                    value={mentorRecord.userId}
                  />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Location Tab */}
          <TabsContent value="contact">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg text-gray-900">
                      Contact & Location
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Manage your contact information
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsEditingContact(!isEditingContact)}
                    variant={isEditingContact ? "outline" : "default"}
                    size="sm"
                    className={
                      isEditingContact
                        ? "w-full sm:w-auto"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                    }
                    disabled={isPending || contactIsPending}
                  >
                    {isEditingContact ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <form action={contactFormAction} className="space-y-5">
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-900"
                    >
                      Phone Number
                    </FieldLabel>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      defaultValue={
                        !contactState.success &&
                        contactState.inputs?.phoneNumber &&
                        isEditingContact
                          ? contactState.inputs.phoneNumber
                          : mentorRecord.phoneNumber || ""
                      }
                      placeholder="+1 (555) 000-0000"
                      disabled={!isEditingContact}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {contactState.errors?.phoneNumber && isEditingContact && (
                      <FieldError>
                        {contactState.errors.phoneNumber[0]}
                      </FieldError>
                    )}
                  </Field>
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="country"
                      className="text-sm font-medium text-gray-900"
                    >
                      Country
                    </FieldLabel>
                    <Input
                      id="country"
                      name="country"
                      defaultValue={
                        !contactState.success &&
                        contactState.inputs?.country &&
                        isEditingContact
                          ? contactState.inputs.country
                          : mentorRecord.country || ""
                      }
                      placeholder="e.g., United States"
                      disabled={!isEditingContact}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {contactState.errors?.country && isEditingContact && (
                      <FieldError>{contactState.errors.country[0]}</FieldError>
                    )}
                  </Field>
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="city"
                      className="text-sm font-medium text-gray-900"
                    >
                      City
                    </FieldLabel>
                    <Input
                      id="city"
                      name="city"
                      defaultValue={
                        !contactState.success &&
                        contactState.inputs?.city &&
                        isEditingContact
                          ? contactState.inputs.city
                          : mentorRecord.city || ""
                      }
                      placeholder="e.g., New York"
                      disabled={!isEditingContact}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {contactState.errors?.city && isEditingContact && (
                      <FieldError>{contactState.errors.city[0]}</FieldError>
                    )}
                  </Field>
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="zipCode"
                      className="text-sm font-medium text-gray-900"
                    >
                      Zip Code
                    </FieldLabel>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      defaultValue={
                        !contactState.success &&
                        contactState.inputs?.zipCode &&
                        isEditingContact
                          ? contactState.inputs.zipCode
                          : mentorRecord.zipCode || ""
                      }
                      placeholder="12345"
                      disabled={!isEditingContact}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {contactState.errors?.zipCode && isEditingContact && (
                      <FieldError>{contactState.errors.zipCode[0]}</FieldError>
                    )}
                  </Field>

                  {isEditingContact && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingContact(false)}
                        disabled={contactIsPending}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                        disabled={contactIsPending}
                      >
                        {contactIsPending ? <Spinner /> : "Save Changes"}
                      </Button>
                    </div>
                  )}
                  <input
                    type="hidden"
                    name="userId"
                    value={mentorRecord.userId}
                    required
                  />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Documents Tab */}
          <TabsContent value="documents">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white">
                <CardTitle className="text-base sm:text-lg text-gray-900">
                  Professional Documents
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  View your uploaded documents and verification materials
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Resume / CV
                  </Label>
                  {mentorRecord.resume ? (
                    mentorRecord.resume.startsWith("http") ? (
                      <a
                        href={mentorRecord.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium break-all"
                      >
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span>View Resume</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {mentorRecord.resume}
                        </p>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">No resume uploaded</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Citizenship Document
                  </Label>
                  {mentorRecord.citizenshipPhotoUrl ? (
                    <div className="space-y-3">
                      <div className="relative rounded-lg border border-gray-200 w-full h-60 sm:h-80 overflow-hidden bg-gray-50">
                        <Image
                          src={
                            mentorRecord.citizenshipPhotoUrl ||
                            "/placeholder.svg"
                          }
                          fill
                          alt="Citizenship Document"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={mentorRecord.citizenshipPhotoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open in new tab
                        </a>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        <p className="text-sm text-amber-900">
                          {mentorRecord.verifiedStatus === "accepted"
                            ? "Document verified"
                            : "Document under review"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No citizenship document uploaded
                    </p>
                  )}
                </div>

                <Separator />

                {/* Account Information */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Account Information
                  </Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {new Date(mentorRecord.createdAt!).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {new Date(mentorRecord.updatedAt!).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg text-gray-900">
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Manage your password and account security
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full sm:w-auto"
                    disabled={isUpdating}
                  >
                    {showPasswordSection ? "Hide" : "Change Password"}
                  </Button>
                </div>
              </CardHeader>
              {showPasswordSection && (
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-medium text-gray-900"
                      >
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium text-gray-900"
                      >
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border-gray-300"
                      />
                    </div>
                    <Field className="space-y-2">
                      <FieldLabel
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-900"
                      >
                        Confirm New Password
                      </FieldLabel>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="border-gray-300"
                      />
                    </Field>
                    {newPassword !== confirmNewPassword && (
                      <FieldError>Password don&apos;t match</FieldError>
                    )}
                    {updatePasswordError.newPassword && (
                      <FieldError>
                        {updatePasswordError.newPassword[0]}
                      </FieldError>
                    )}
                    <Separator />
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleUpdatePassword}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Spinner /> : "Update Password"}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
