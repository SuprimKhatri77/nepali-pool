import Link from "next/link";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EnquiryForm from "@/components/mentor-services/EnquiryForm";
import Notice from "@/components/mentor-services/Notice";
import { toWhatsappPrefill } from "@/components/mentor-services/format";
import { db } from "../../../../../lib/db";
import { intakeMonthEnum, intakeYearEnum, mentorEnquiry, mentorProfile } from "../../../../../lib/db/schema";
import { requireUser } from "../../../../../server/lib/auth/guards";
import { getViewer } from "../../../../../server/lib/auth/viewer";

export const metadata = {
  title: "Ask a Mentor | NepaliPool",
};

export default async function EnquirePage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  const viewer = await getViewer();
  if (viewer.status === "anonymous") redirect("/login?message=Please+login+to+ask+a+mentor+a+question");
  if (viewer.status === "needs-onboarding" && viewer.role === "student") {
    redirect("/onboarding/student?message=Please+complete+your+profile+before+contacting+a+mentor");
  }
  if (viewer.status !== "student") {
    // Sends unverified or role-less users on to finish signing up.
    await requireUser();
    return (
      <Notice
        title="Students only"
        backHref={`/mentors/${mentorId}`}
        backLabel="Back to mentor"
      >
        Only student accounts can send enquiries to mentors.
      </Notice>
    );
  }
  const userRecord = viewer.user;
  const student = viewer.studentProfile;

  const mentor = await db.query.mentorProfile.findFirst({
    where: and(
      eq(mentorProfile.userId, mentorId),
      eq(mentorProfile.verifiedStatus, "accepted"),
    ),
    with: { user: { columns: { name: true } } },
  });
  if (!mentor) {
    return (
      <Notice
        title="Mentor unavailable"
        backHref="/mentors"
        backLabel="Browse mentors"
      >
        This mentor doesn&apos;t exist or isn&apos;t available right now.
      </Notice>
    );
  }

  const openEnquiry = await db.query.mentorEnquiry.findFirst({
    where: and(
      eq(mentorEnquiry.studentId, student.userId),
      eq(mentorEnquiry.mentorId, mentor.userId),
      eq(mentorEnquiry.status, "new"),
    ),
  });
  if (openEnquiry) {
    return (
      <Notice
        title="Already asked"
        backHref="/bookings#enquiries"
        backLabel="View my enquiries"
      >
        You already have an open enquiry ({openEnquiry.referenceCode}) with{" "}
        <span className="capitalize">{mentor.user.name}</span>. They&apos;ll
        reply soon.
      </Notice>
    );
  }

  const now = new Date();
  const currentYear = now.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href={`/mentors/${mentorId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to <span className="capitalize">{mentor.user.name}</span>
        </Link>
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Free enquiry
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Ask <span className="capitalize">{mentor.user.name}</span> a
              question
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Share a little about your background so the mentor can give you
              useful, honest guidance. This is an informal screening chat, not
              an official college interview.
            </p>
            <EnquiryForm
              mentorId={mentor.userId}
              intakeMonths={intakeMonthEnum.enumValues}
              intakeYears={intakeYearEnum.enumValues.filter(
                (year) => Number(year) >= currentYear,
              )}
              currentYear={currentYear}
              currentMonthIndex={now.getMonth()}
              defaults={{
                fullName: userRecord.name,
                email: userRecord.email,
                whatsappNumber: toWhatsappPrefill(student.phoneNumber),
              }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
