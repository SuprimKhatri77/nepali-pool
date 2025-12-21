"use client";

import {
  CheckCircle,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ClickableImage } from "./ClickableImage";
import { Button } from "./ui/button";
import {
  AcceptMentorApplication,
  FormState,
  RejectMentorApplication,
} from "../../server/actions/mentor-application/mentorApplication";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MentorProfileWithUser } from "../../types/all-types";

export default function MentorApplication({
  mentorProfileRecordWithUser,
}: {
  mentorProfileRecordWithUser: MentorProfileWithUser;
}) {
  const initialState: FormState = {
    errros: {},
  } as FormState;
  const [stateAccept, formActionAccept, isPendingAccept] = useActionState<
    FormState,
    FormData
  >(AcceptMentorApplication, initialState);
  const [stateReject, formActionReject, isPendingReject] = useActionState<
    FormState,
    FormData
  >(RejectMentorApplication, initialState);
  const router = useRouter();

  useEffect(() => {
    if (stateAccept.message && stateAccept.success) {
      toast(stateAccept.message);
      setTimeout(() => {
        router.replace(stateAccept.redirectTo as string);
      }, 1500);
    }
  }, [stateAccept.message, stateAccept.redirectTo, stateAccept.success, router]);
  useEffect(() => {
    if (stateReject.message && stateReject.success) {
      toast(stateReject.message);
      setTimeout(() => {
        router.replace(stateReject.redirectTo as string);
      }, 1500);
    }
  }, [stateReject.message, stateReject.redirectTo, stateReject.success, router]);
  return (
    <div className="min-h-screen bg-gray-50 py-8 my-40 sm:my-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mentor Application Review
          </h1>
          <p className="text-gray-600">
            Review the application details and make a decision
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div>
                    <h3 className="text-xl font-semibold capitalize mb-2">
                      {mentorProfileRecordWithUser.user.name}
                    </h3>
                    <Badge variant="secondary">Mentor Applicant</Badge>
                  </div>
                  <Image
                    src={mentorProfileRecordWithUser.imageUrl!}
                    height={150}
                    width={150}
                    alt=""
                    className="rounded-full object-cover object-center ml-auto"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">
                      {mentorProfileRecordWithUser.user.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">
                      {mentorProfileRecordWithUser.phoneNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Country:</span>
                    <span className="text-sm">
                      {mentorProfileRecordWithUser.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Nationality:</span>
                    <span className="text-sm">
                      {mentorProfileRecordWithUser.nationality}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">City:</span>
                    <span className="text-sm">
                      {mentorProfileRecordWithUser.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Zip Code:</span>
                    <span className="text-sm">
                      {mentorProfileRecordWithUser.zipCode}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Bio:</span>
                  <span className="text-sm">
                    {mentorProfileRecordWithUser.bio}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Citizenship Photo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IdCard className="h-5 w-5" />
                    Citizenship Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <ClickableImage
                      src={
                        mentorProfileRecordWithUser.zyroCard! ||
                        "/placeholder.svg"
                      }
                      alt="Citizenship document - Click to view full size"
                      height={400}
                      width={400}
                      className="w-full h-auto object-contain rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Application Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <form action={formActionAccept}>
                    <input
                      type="hidden"
                      name="applicationId"
                      value={mentorProfileRecordWithUser.userId}
                    />
                    <Button
                      type="submit"
                      disabled={isPendingAccept}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isPendingAccept ? (
                        "Accepting......"
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept Application
                        </>
                      )}
                    </Button>
                  </form>

                  <form action={formActionReject}>
                    <input
                      type="hidden"
                      name="applicationId"
                      value={mentorProfileRecordWithUser.userId}
                    />

                    <Button
                      type="submit"
                      disabled={
                        isPendingReject ||
                        mentorProfileRecordWithUser.verifiedStatus ===
                          "rejected"
                      }
                      variant="destructive"
                      className="w-full"
                      size="lg"
                    >
                      {isPendingReject ? (
                        "Rejecting"
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject Application
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Review Guidelines:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Verify all personal information</li>
                    <li>• Check document authenticity</li>
                    <li>• Ensure qualifications meet requirements</li>
                    <li>• Review contact information accuracy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
