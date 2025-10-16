import { and, ne } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { mentorProfile } from "../../../../lib/db/schema";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mail,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  Users,
  Award,
  MessageCircleIcon,
  Calendar,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserData } from "../../../../server/lib/auth/helpers/getCurrentUserData";
import { PaymentButton } from "@/components/PaymentButton";

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.id === mentorId) return redirect("/profile");

  const mentorRecord = await db.query.mentorProfile.findFirst({
    where: (fields, { eq }) =>
      and(
        eq(mentorProfile.userId, mentorId),
        eq(mentorProfile.verifiedStatus, "accepted")
      ),
    with: {
      user: true,
    },
  });

  if (!mentorRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-2">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Mentor Not Found
            </h2>
            <p className="text-slate-600">
              The mentor profile you&apos;re looking for doesn&apos;t exist or
              has been removed.
            </p>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 mt-4"
            >
              <Link href="/mentors">
                Browse All Mentors
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  let currentUser;

  if (session) {
    currentUser = await getCurrentUserData(
      session.user.id,
      mentorRecord.userId
    );
  }

  const otherSuggestedMentors = await db.query.mentorProfile.findMany({
    where: (fields, { eq }) =>
      mentorRecord.country
        ? and(
            eq(mentorProfile.country, mentorRecord.country),
            ne(mentorProfile.userId, mentorId)
          )
        : ne(mentorProfile.userId, mentorId),
    with: {
      user: true,
    },
    limit: 3,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <Link
          href="/mentors"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors mb-6 sm:mb-8 group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to all mentors
        </Link>

        {/* Main Profile Section */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full bg-gradient-to-br from-emerald-50 to-slate-50 overflow-hidden">
                  <Image
                    src={
                      mentorRecord.imageUrl ||
                      mentorRecord.user.image ||
                      "/placeholder.svg?height=400&width=400&query=professional"
                    }
                    alt={mentorRecord.user.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    style={{ objectPosition: "center 30%" }}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Verified Badge */}
                  {mentorRecord.verifiedStatus === "accepted" && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      {mentorRecord.user.name}
                    </h1>
                    {mentorRecord.nationality && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Globe className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">
                          {mentorRecord.nationality}
                        </span>
                      </div>
                    )}
                  </div>
                  <Separator />
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 flex-shrink-0">
                        <Mail className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 break-all">
                        {mentorRecord.user.email}
                      </span>
                    </div>

                    {(mentorRecord.city || mentorRecord.country) && (
                      <div className="flex items-start gap-3 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 flex-shrink-0">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-slate-700">
                          {[mentorRecord.city, mentorRecord.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions Card */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Get in Touch
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">
                  Connect with this mentor through your preferred method
                </p>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-11 sm:h-12"
                  >
                    <Link
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${mentorRecord.user.email}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Link>
                  </Button>
                  {currentUser && currentUser.role === "student" && (
                    <>
                      {/* Chat button */}
                      <Button
                        asChild
                        className="w-full bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-600 shadow-sm h-11 sm:h-12"
                      >
                        {currentUser.success && currentUser.chatId ? (
                          <Link href={`/chats/${currentUser.chatId}`}>
                            <MessageCircleIcon className="w-4 h-4 mr-2" />
                            Start Chat
                          </Link>
                        ) : (
                          <PaymentButton
                            mentorId={mentorRecord.userId}
                            userId={currentUser.userId}
                            userEmail={currentUser.email}
                            paymentType="chat_subscription"
                          >
                            Unlock Chat
                          </PaymentButton>
                        )}
                      </Button>

                      {/* Video call button */}
                      {currentUser.success &&
                      currentUser.videoCallStatus === "pending" &&
                      currentUser.videoCallId ? (
                        <Link href={`/video-call/${currentUser.videoCallId}`}>
                          <Button className="w-full bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-600 shadow-sm h-11 sm:h-12">
                            <Calendar className="w-4 h-4 mr-2" />
                            Video Pending
                          </Button>
                        </Link>
                      ) : currentUser.success &&
                        currentUser.videoCallStatus === "scheduled" ? (
                        <Button
                          className="w-full bg-gray-200 text-gray-600 border-2 border-gray-300 shadow-sm h-11 sm:h-12"
                          disabled
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Scheduled
                        </Button>
                      ) : (
                        <PaymentButton
                          mentorId={mentorRecord.userId}
                          userId={currentUser.userId}
                          userEmail={currentUser.email}
                          paymentType="video_call"
                        >
                          Unlock Video Call
                        </PaymentButton>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-emerald-600 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    About
                  </h2>
                </div>
                {mentorRecord.bio ? (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {mentorRecord.bio}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-slate-500 italic">
                    This mentor hasn&apos;t added a bio yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-emerald-600 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    Profile Details
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {mentorRecord.sex && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Gender
                      </p>
                      <p className="text-sm sm:text-base text-slate-900 capitalize">
                        {mentorRecord.sex}
                      </p>
                    </div>
                  )}

                  {mentorRecord.zipCode && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Zip Code
                      </p>
                      <p className="text-sm sm:text-base text-slate-900">
                        {mentorRecord.zipCode}
                      </p>
                    </div>
                  )}

                  {mentorRecord.verifiedStatus && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Verification Status
                      </p>
                      <Badge
                        variant={
                          mentorRecord.verifiedStatus === "accepted"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          mentorRecord.verifiedStatus === "accepted"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : ""
                        }
                      >
                        {mentorRecord.verifiedStatus}
                      </Badge>
                    </div>
                  )}

                  {mentorRecord.createdAt && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Member Since
                      </p>
                      <p className="text-sm sm:text-base text-slate-900">
                        {new Date(mentorRecord.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Mentor */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
              <CardContent className="p-5 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    Why Choose This Mentor
                  </h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-slate-700">
                      Experienced professional ready to guide your journey
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-slate-700">
                      Personalized mentorship tailored to your goals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-slate-700">
                      Committed to helping you achieve success
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Suggested Mentors Section */}
        {otherSuggestedMentors.length > 0 && (
          <div className="border-t border-slate-200 pt-12 lg:pt-16">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-medium text-emerald-700">
                  More Great Mentors
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Other Mentors{" "}
                {mentorRecord.country && (
                  <span className="text-emerald-600 block sm:inline">
                    from {mentorRecord.country}
                  </span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Discover more mentors who can help you succeed
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherSuggestedMentors.map((mentor) => (
                <Link
                  href={`/mentors/${mentor.userId}`}
                  key={mentor.userId}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-50">
                    <Image
                      width={400}
                      height={250}
                      src={
                        mentor.imageUrl ||
                        mentor.user.image ||
                        "/placeholder.svg?height=250&width=400&query=professional"
                      }
                      alt={mentor.user.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ objectPosition: "center 30%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {mentor.verifiedStatus === "accepted" && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg text-xs">
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
                        {mentor.user.name}
                      </h3>
                      {mentor.nationality && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          {mentor.nationality}
                        </p>
                      )}
                    </div>

                    {mentor.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {mentor.bio}
                      </p>
                    )}

                    {(mentor.city || mentor.country) && (
                      <div className="flex items-start gap-2 text-slate-600 pt-2 border-t border-slate-100">
                        <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                        <div className="text-xs sm:text-sm min-w-0">
                          <p className="text-slate-700 line-clamp-1">
                            {[mentor.city, mentor.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <span className="text-xs sm:text-sm font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
                        View Profile
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Button
                asChild
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Link href="/mentors">
                  View All Mentors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
