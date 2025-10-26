import { auth } from "../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MentorWaitlist() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    return redirect("/sign-up");
  }

  if (!userRecord.emailVerified) {
    return redirect("/verify-email");
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      return redirect("/onboarding/student");
    }
    return redirect("/dashboard/student");
  }

  if (userRecord.role === "none") {
    return redirect("/select-role");
  }

  const [mentorProfileRecord] = await db
    .select()
    .from(mentorProfile)
    .where(eq(mentorProfile.userId, userRecord.id));

  if (!mentorProfileRecord && userRecord.role === "mentor") {
    return redirect("/onboarding/mentor");
  }

  if (mentorProfileRecord.verifiedStatus === "rejected") {
    return redirect("/rejected");
  }

  if (mentorProfileRecord.verifiedStatus === "accepted") {
    return redirect("/dashboard/mentor");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <span className="px-4 py-1.5 text-sm font-medium text-white">
              Application Under Review
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            You&apos;re On The Waitlist! 🎉
          </h1>
          <p className="text-xl text-green-50 max-w-2xl mx-auto">
            Thank you for applying to become a mentor on Nepali Pool. Our team
            is carefully reviewing your application.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Status Card */}
        <Card className="border-green-200 shadow-lg mb-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mb-4">
              <svg
                className="h-10 w-10 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Verification In Progress
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Your application is being reviewed by our team. This typically
              takes 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
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
                    What&apos;s Next?
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    We&apos;ll send you an email once your application has been
                    reviewed. You&apos;ll be notified whether you&apos;ve been
                    approved to start mentoring or if we need additional
                    information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What We&apos;re Reviewing */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">
                  What We&apos;re Reviewing
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Your qualifications and expertise
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Profile completeness and authenticity
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Alignment with our community standards
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">In The Meantime</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Check your email for updates
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Familiarize yourself with our platform
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Prepare your mentorship approach
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Verification Timeline</CardTitle>
            <CardDescription>
              Here&apos;s what you can expect during the review process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300" />
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-gray-900">
                    Application Submitted
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your application has been received and is in our queue
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 animate-pulse">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300" />
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Our team is currently reviewing your credentials and profile
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mt-2">
                    Current Stage
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300" />
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-gray-500">Decision Email</p>
                  <p className="text-sm text-gray-600 mt-1">
                    You&apos;ll receive an email with our decision within 24-48
                    hours
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Start Mentoring</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Once approved, you&apos;ll get full access to your mentor
                    dashboard
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does verification take?
              </h3>
              <p className="text-sm text-gray-600">
                Most applications are reviewed within 24-48 hours. However,
                during peak times it may take slightly longer.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I&apos;m not approved?
              </h3>
              <p className="text-sm text-gray-600">
                If your application doesn&apos;t meet our current requirements,
                we&apos;ll send you detailed feedback. You&apos;re welcome to
                reapply after addressing the concerns.
              </p>
            </div>
            <div className="pb-2">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I update my application?
              </h3>
              <p className="text-sm text-gray-600">
                Your application is currently locked during review. If approved,
                you&apos;ll be able to update your profile from your mentor
                dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
