import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "../../../server/lib/auth/auth";
import { db } from "../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../lib/db/schema";

export default async function RejectedMentor() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login?toast=Please+log+in+to+continue");
  }

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userRecord) {
    return redirect("/sign-up?toast=Please+create+an+account+to+continue");
  }

  if (!userRecord.emailVerified) {
    return redirect(`/verify-email`);
  }

  if (userRecord.role === "student") {
    const [studentProfileRecord] = await db
      .select()
      .from(studentProfile)
      .where(eq(studentProfile.userId, userRecord.id));
    if (!studentProfileRecord) {
      return redirect("/onboarding/student?toast=Please+complete+your+onboarding+to+continue");
    }
    return redirect("/dashboard/student?toast=Welcome+to+your+dashboard!");
  }

  if (userRecord.role === "none") {
    return redirect("/select-role");
  }

  const [mentorProfileRecord] = await db
    .select()
    .from(mentorProfile)
    .where(eq(mentorProfile.userId, userRecord.id));

  if (!mentorProfileRecord && userRecord.role === "mentor") {
    return redirect("/onboarding/mentor?toast=Please+complete+your+onboarding+to+continue");
  }

  if (mentorProfileRecord.verifiedStatus === "pending") {
    return redirect("/waitlist?toast=Your+mentor+profile+is+under+review");
  }

  if (mentorProfileRecord.verifiedStatus === "accepted") {
    return redirect("/dashboard/mentor?toast=Welcome+to+your+dashboard!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <span className="px-4 py-1.5 text-sm font-medium text-white">
              Application Decision
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Application Not Approved
          </h1>
          <p className="text-xl text-orange-50 max-w-2xl mx-auto">
            Thank you for your interest in becoming a mentor. Unfortunately,
            we&apos;re unable to approve your application at this time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Status Card */}
        <Card className="border-orange-200 shadow-lg mb-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-4">
              <svg
                className="h-10 w-10 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              We Appreciate Your Interest
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              After careful review, we&apos;ve determined that your application
              doesn&apos;t meet our current mentor requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5"
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
                  <p className="text-sm font-medium text-orange-900">
                    This Doesn&apos;t Mean Forever
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    We encourage you to continue building your expertise and
                    experience. You&apos;re welcome to reapply in the future
                    once you&apos;ve addressed the areas of improvement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Reasons */}
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg">
                  Common Reasons for Non-Approval
                </CardTitle>
                <CardDescription>
                  Understanding what we look for in mentors
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="h-2 w-2 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Insufficient Experience
                </p>
                <p className="text-sm text-gray-600">
                  We look for mentors with demonstrated expertise in their field
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="h-2 w-2 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Incomplete Profile
                </p>
                <p className="text-sm text-gray-600">
                  Missing credentials, certifications, or work history details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="h-2 w-2 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Unclear Specialization
                </p>
                <p className="text-sm text-gray-600">
                  We need clear focus areas to match you with the right students
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="h-2 w-2 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Professional Standards
                </p>
                <p className="text-sm text-gray-600">
                  Profile content didn&apos;t align with our community
                  guidelines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Ways to Improve</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Gain more industry experience
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Obtain relevant certifications
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Build a stronger professional portfolio
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Develop teaching or mentorship skills
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Other Options</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Join as a student to learn from our mentors
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Contribute to our community forums
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Reapply when you&apos;ve gained more experience
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Refer qualified mentors and earn rewards
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mb-8">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Ready to Try Again?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              We believe in growth and second chances. When you&apos;re ready
              and have addressed the areas of improvement, we&apos;d love to
              review your application again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                <Link href="/onboarding/mentor">Reapply as Mentor</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-white"
              >
                <Link href="/">Explore Platform</Link>
              </Button>
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
                Can I reapply?
              </h3>
              <p className="text-sm text-gray-600">
                Absolutely! We encourage you to reapply once you&apos;ve gained
                more experience or addressed the areas mentioned above.
                There&apos;s no limit on reapplications.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                How long should I wait before reapplying?
              </h3>
              <p className="text-sm text-gray-600">
                We recommend waiting at least 3-6 months to gain additional
                experience or credentials. This gives you time to meaningfully
                improve your profile.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I get detailed feedback?
              </h3>
              <p className="text-sm text-gray-600">
                For privacy and scalability reasons, we don&apos;t provide
                individual feedback. However, the common reasons listed above
                cover most scenarios.
              </p>
            </div>
            <div className="pb-2">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I join as a student instead?
              </h3>
              <p className="text-sm text-gray-600">
                Yes! You can switch to a student role to learn from our
                experienced mentors. This is a great way to gain insights and
                prepare for future mentor applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
