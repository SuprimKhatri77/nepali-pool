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
import { Mail, Shield } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import MultiSelectCountries from "./multi-select-countires";
import { getNames } from "country-list";
import { StudentProfileSelectType, UserSelectType } from "../../lib/db/schema";
import CustomProfileUploader from "./CustomImageButton";
import {
  StudentProfileFormState,
  updatePersonal,
} from "../../server/actions/profile/student-profile/update-personal";
import { toast } from "sonner";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Spinner } from "./ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  StudentContactFormState,
  updateContact,
} from "../../server/actions/profile/student-profile/update-contact";
import { updatePassword } from "../../server/actions/update-password/updatePassword";

type StudentProfileProps = StudentProfileSelectType & {
  user: UserSelectType;
};

export function StudentProfile({
  studentRecord,
}: {
  studentRecord: StudentProfileProps;
}) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const countries = getNames();
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    studentRecord.favoriteDestination || []
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatePasswordError, setUpdatePasswordError] = useState<{
    newPassword?: string[] | undefined;
  }>({ newPassword: [""] });

  const currentProfileImage =
    uploadedImageUrl || studentRecord.user.image || studentRecord.user.image;

  const [sex, setSex] = useState(studentRecord.sex || "");

  const personalInitialState: StudentProfileFormState = {
    errors: {},
    message: "",
    success: false,
    inputs: {},
    timestamp: Date.now(),
  };

  const [personalState, personalFormAction, personalIsPending] = useActionState<
    StudentProfileFormState,
    FormData
  >(updatePersonal, personalInitialState);

  useEffect(() => {
    if (personalState.success && personalState.message) {
      setIsEditingPersonal(false);
      toast.success(personalState.message);
    }
    if (!personalState.success && personalState.message) {
      toast.error(personalState.message);
    }
  }, [personalState.success, personalState.message, personalState.timestamp]);

  const contactInitialState: StudentContactFormState = {
    errors: {},
    message: "",
    success: false,
    inputs: {},
    timestamp: Date.now(),
  };

  const [contactState, contactFormAction, contactIsPending] = useActionState<
    StudentContactFormState,
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
        setIsEditingSecurity(false);
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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 max-w-5xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-4 sm:mb-6 border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border border-gray-200 shrink-0">
                <AvatarImage
                  src={
                    studentRecord.imageUrl ||
                    studentRecord.user.image ||
                    undefined
                  }
                  alt={studentRecord.user.name}
                />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg sm:text-xl font-medium">
                  {studentRecord.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 w-full">
                <CardTitle className="text-lg sm:text-xl text-gray-900 mb-1 break-words">
                  {studentRecord.user.name}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm flex items-center gap-1.5 mb-3 break-all">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{studentRecord.user.email}</span>
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200 font-normal text-xs"
                  >
                    {studentRecord.user.role}
                  </Badge>
                  {studentRecord.user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-xs"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 h-auto p-1 bg-gray-100 border border-gray-200 gap-1">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Contact
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg text-gray-900">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Update your personal details
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
                  >
                    {isEditingPersonal ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <form
                  action={personalFormAction}
                  className="space-y-5 sm:space-y-6"
                >
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
                            uploadedImageUrl || studentRecord.imageUrl || ""
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border border-gray-200">
                          <AvatarImage
                            src={currentProfileImage || undefined}
                            alt={studentRecord.user.name}
                          />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-medium">
                            {studentRecord.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </Field>

                  <Separator />

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
                        !personalState.success &&
                        personalState.errors?.fullName &&
                        isEditingPersonal
                          ? personalState.inputs?.fullName
                          : studentRecord.user.name || ""
                      }
                      disabled={!isEditingPersonal}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />

                    {personalState.errors?.fullName && isEditingPersonal && (
                      <FieldError>
                        {personalState.errors.fullName[0]}
                      </FieldError>
                    )}
                  </Field>

                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900"
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={studentRecord.user.email}
                      disabled
                      className="bg-gray-50 border-gray-300 text-gray-500"
                    />
                    <FieldDescription className="text-xs text-gray-500">
                      Your email address cannot be changed
                    </FieldDescription>
                  </Field>

                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="sex"
                      className="text-sm font-medium text-gray-900"
                    >
                      Gender
                    </FieldLabel>

                    <Select
                      defaultValue={
                        !personalState.success &&
                        personalState.errors?.sex &&
                        isEditingPersonal
                          ? personalState.inputs?.sex
                          : studentRecord.sex || ""
                      }
                      onValueChange={(value) => setSex(value)}
                      disabled={!isEditingPersonal}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent id="sex">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    {personalState.errors?.sex && isEditingPersonal && (
                      <FieldError>{personalState.errors.sex[0]}</FieldError>
                    )}
                    <input type="hidden" name="sex" value={sex} />
                  </Field>

                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="bio"
                      className="text-sm font-medium text-gray-900"
                    >
                      Bio
                    </FieldLabel>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={
                        !personalState.success &&
                        personalState.errors?.bio &&
                        isEditingPersonal
                          ? personalState.inputs?.bio
                          : studentRecord.bio || ""
                      }
                      placeholder="Tell us about yourself..."
                      disabled={!isEditingPersonal}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px] resize-none"
                    />
                    {personalState.errors?.bio && isEditingPersonal && (
                      <FieldError>{personalState.errors.bio[0]}</FieldError>
                    )}
                  </Field>

                  {isEditingPersonal && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingPersonal(false)}
                        disabled={personalIsPending}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                        disabled={personalIsPending}
                      >
                        {personalIsPending ? <Spinner /> : "Save Changes"}
                      </Button>
                    </div>
                  )}
                  <input
                    type="hidden"
                    name="userId"
                    value={studentRecord.userId}
                    required
                  />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
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
                    disabled={contactIsPending || personalIsPending}
                  >
                    {isEditingContact ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
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
                        contactState.errors?.phoneNumber &&
                        isEditingContact
                          ? contactState.inputs?.phoneNumber
                          : studentRecord.phoneNumber || ""
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
                        contactState.errors?.city &&
                        isEditingContact
                          ? contactState.inputs?.city
                          : studentRecord.city || ""
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
                      htmlFor="district"
                      className="text-sm font-medium text-gray-900"
                    >
                      District
                    </FieldLabel>
                    <Input
                      id="district"
                      name="district"
                      defaultValue={
                        !contactState.success &&
                        contactState.errors?.district &&
                        isEditingContact
                          ? contactState.inputs?.district
                          : studentRecord.district || ""
                      }
                      placeholder="Your district"
                      disabled={!isEditingContact}
                      className="border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {contactState.errors?.district && isEditingContact && (
                      <FieldError>{contactState.errors.district[0]}</FieldError>
                    )}
                  </Field>

                  <Field className="space-y-2">
                    <FieldLabel className="text-sm font-medium text-gray-900">
                      Favorite Destinations
                    </FieldLabel>
                    {isEditingContact ? (
                      <MultiSelectCountries
                        countries={countries}
                        selectedCountries={selectedDestinations}
                        onSelectionChange={setSelectedDestinations}
                        placeholder="Search and select your favorite destinations..."
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[60px]">
                        {selectedDestinations.length > 0 ? (
                          selectedDestinations.map((destination) => (
                            <Badge
                              key={destination}
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                            >
                              {destination}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No destinations selected
                          </p>
                        )}
                      </div>
                    )}
                    {selectedDestinations.map((country, index) => (
                      <input
                        key={`${country}-${index}`}
                        type="hidden"
                        name="favoriteDestination"
                        value={
                          !contactState.success &&
                          contactState.errors?.favoriteDestination &&
                          isEditingContact
                            ? contactState.inputs?.favoriteDestination
                            : country || ""
                        }
                      />
                    ))}
                    {contactState.errors?.favoriteDestination &&
                      isEditingContact && (
                        <FieldError>
                          {contactState.errors.favoriteDestination[0]}
                        </FieldError>
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
                    value={studentRecord.userId}
                    required
                  />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg text-gray-900">
                  Account Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  View your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Role
                    </Label>
                    <div>
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200 text-xs"
                      >
                        {studentRecord.user.role}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">
                        Account Created
                      </Label>
                      <p className="text-sm text-gray-600">
                        {new Date(studentRecord.createdAt!).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">
                        Last Updated
                      </Label>
                      <p className="text-sm text-gray-600">
                        {new Date(studentRecord.updatedAt!).toLocaleDateString(
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

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Email Verification
                    </Label>
                    <div>
                      {studentRecord.user.emailVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                        >
                          Not Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
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
                    onClick={() => setIsEditingSecurity(!isEditingSecurity)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={isUpdating}
                  >
                    {isEditingSecurity ? "Cancel" : "Change Password"}
                  </Button>
                </div>
              </CardHeader>
              {isEditingSecurity ? (
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                  <div className="space-y-5">
                    <Field className="space-y-2">
                      <FieldLabel
                        htmlFor="currentPassword"
                        className="text-sm font-medium text-gray-900"
                      >
                        Current Password
                      </FieldLabel>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="border-gray-300"
                      />
                    </Field>

                    <Field className="space-y-2">
                      <FieldLabel
                        htmlFor="newPassword"
                        className="text-sm font-medium text-gray-900"
                      >
                        New Password
                      </FieldLabel>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border-gray-300"
                      />
                    </Field>

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
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        type="password"
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

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingSecurity(false)}
                        className="w-full sm:w-auto"
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                        disabled={isUpdating}
                        onClick={handleUpdatePassword}
                      >
                        {isUpdating ? <Spinner /> : "Update Password"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                      <Shield className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Click &quot;Change Password&quot; to update your security
                      credentials
                    </p>
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
