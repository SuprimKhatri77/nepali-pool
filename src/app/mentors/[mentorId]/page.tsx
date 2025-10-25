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
  Star,
  Briefcase,
  Clock,
  Shield,
  TrendingUp,
  Heart,
  BookOpen,
  LockIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "../../../../server/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserData } from "../../../../server/lib/auth/helpers/getCurrentUserData";
import { PaymentButton } from "@/components/PaymentButton";
import { capitalizeFirstLetter } from "better-auth";
import MentorCard from "@/components/MentorCard";

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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border border-slate-200 shadow-2xl">
          <CardContent className="pt-16 pb-12 px-8 text-center space-y-6">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Mentor Not Found
              </h2>
              <p className="text-slate-600 text-lg">
                The mentor profile you&apos;re looking for doesn&apos;t exist or
                has been removed.
              </p>
            </div>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-base font-semibold"
            >
              <Link href="/mentors">
                Browse All Mentors
                <ArrowRight className="w-5 h-5 ml-2" />
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

  const role = session && currentUser?.success ? currentUser.role : null;
  const currentUserId =
    session && currentUser?.success ? currentUser.userId : null;
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
    <div className="min-h-screen bg-white">
      {/* Hero Section with Cover */}
      <div className="relative h-80 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

        <Link
          href="/mentors"
          className="inline-flex mt-4 ml-4 z-[100] items-center gap-2 text-sm font-medium text-white/90 hover:text-white bg-white/10  transition-colors px-4 py-2 rounded-lg  backdrop-blur-sm border border-white/20"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to all mentors
        </Link>
      </div>

      {/* Main Content - Overlapping Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
        {/* Profile Header Card */}
        <Card className="border border-slate-200 shadow-2xl bg-white mb-8">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row gap-8 p-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={
                      mentorRecord.imageUrl ||
                      mentorRecord.user.image ||
                      "/placeholder.svg?height=400&width=400&query=professional"
                    }
                    alt={mentorRecord.user.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {mentorRecord.verifiedStatus === "accepted" && (
                    <div className="absolute top-3 right-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
                      {capitalizeFirstLetter(mentorRecord.user.name)}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                      {mentorRecord.nationality && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium">
                            {capitalizeFirstLetter(mentorRecord.nationality)}
                          </span>
                        </div>
                      )}
                      {(mentorRecord.city || mentorRecord.country) && (
                        <>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <span className="font-medium">
                              {[
                                capitalizeFirstLetter(
                                  mentorRecord.city ?? "Not"
                                ),
                                capitalizeFirstLetter(
                                  mentorRecord.country ?? "Provided"
                                ),
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {mentorRecord.verifiedStatus === "accepted" && (
                    <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Verified Mentor
                    </Badge>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Star className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">4.9</p>
                    <p className="text-xs text-slate-600 font-medium">Rating</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">50+</p>
                    <p className="text-xs text-slate-600 font-medium">
                      Students
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">Fast</p>
                    <p className="text-xs text-slate-600 font-medium">
                      Response
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">100%</p>
                    <p className="text-xs text-slate-600 font-medium">
                      Success
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex gap-2 mb-2 ml-1">
                  <Phone className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold">Get in Touch</h3>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-3 p-4 rounded-xl bg-white border border-gray-200">
                  
                  <Button
                    asChild
                    className="w-[200px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 h-12 font-semibold shadow-sm border border-emerald-200 transition-all"
                  >
                    <Link
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${mentorRecord.user.email}`}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Send Email
                    </Link>
                  </Button>
                  {!currentUser && (
                   <>
                    <Button
                        asChild
                        className="w-[200px] bg-white text-black border border-gray-300 hover:bg-gray-50 h-12 font-semibold transition-all"
                      >
                        <Link href={"/login"}>
                        
                        Unlock Chat
                        </Link>
                      </Button>
                    <Button
                        asChild
                        className="w-[200px] bg-white text-black border border-gray-300 hover:bg-gray-50 h-12 font-semibold transition-all"
                      >
                        <Link href={"/login"}>
                        Unlock Video
                        </Link>
                      </Button>
                   </>
                  ) }

                  {currentUser && currentUser.role === "student" && (
                    <>
                      <Button
                        asChild
                        className="w-[200px] bg-white text-black border border-gray-300 hover:bg-gray-50 h-12 font-semibold transition-all"
                      >
                        {currentUser.success && currentUser.chatId ? (
                          <Link href={`/chats/${currentUser.chatId}`}>
                            <MessageCircleIcon className="w-5 h-5 mr-2 text-emerald-600" />
                            Start Chat
                          </Link>
                        ) : (
                          <PaymentButton
                            mentorId={mentorRecord.userId}
                            userId={currentUser.userId}
                            userEmail={currentUser.email}
                            paymentType="chat_subscription"
                            className="flex items-center justify-center gap-2 text-emerald-700 hover:text-emerald-800"
                          >
                            <LockIcon className="w-4 h-4 text-emerald-700" />
                            Unlock Chat
                          </PaymentButton>
                        )}
                      </Button>

                      {currentUser.success &&
                      currentUser.videoCallStatus === "pending" &&
                      currentUser.videoCallId ? (
                        <Link
                          href={`/video-call/schedule/${currentUser.videoCallId}`}
                        >
                          <Button className="w-[200px] bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 h-12 font-semibold transition-all">
                            <Calendar className="w-5 h-5 mr-2" />
                            Video Pending
                          </Button>
                        </Link>
                      ) : currentUser.success &&
                        currentUser.videoCallStatus === "scheduled" ? (
                        <Button
                          className="w-[200px] bg-gray-100 text-gray-500 border border-gray-300 h-12 font-semibold cursor-not-allowed"
                          disabled
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Scheduled
                        </Button>
                      ) : (
                        <PaymentButton
                          mentorId={mentorRecord.userId}
                          userId={currentUser.userId}
                          userEmail={currentUser.email}
                          paymentType="video_call"
                          className="w-[200px] bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 h-12 font-semibold transition-all"
                        >
                          <LockIcon className="w-4 h-4 mr-2 text-emerald-700" />
                          Unlock Video Call
                        </PaymentButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border border-slate-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  About Me
                </h2>
                {mentorRecord.bio ? (
                  <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                    {capitalizeFirstLetter(mentorRecord.bio)}
                  </p>
                ) : (
                  <p className="text-slate-500 italic text-lg">
                    This mentor hasn&apos;t added a bio yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Why Choose Section */}
            <Card className="border border-slate-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-emerald-600" />
                  Why Choose This Mentor
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex  items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Verified Expert
                      </h3>
                      <p className="text-sm text-slate-600">
                        Thoroughly vetted and approved professional
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Personalized Approach
                      </h3>
                      <p className="text-sm text-slate-600">
                        Mentorship tailored to your unique goals
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Real Experience
                      </h3>
                      <p className="text-sm text-slate-600">
                        Proven track record of success
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Growth Focused
                      </h3>
                      <p className="text-sm text-slate-600">
                        Committed to your development
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="border border-slate-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Profile Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {mentorRecord.sex && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-2">
                        Gender
                      </p>
                      <p className="text-lg text-slate-900 capitalize">
                        {mentorRecord.sex}
                      </p>
                    </div>
                  )}
                  {mentorRecord.zipCode && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-2">
                        Zip Code
                      </p>
                      <p className="text-lg text-slate-900">
                        {mentorRecord.zipCode}
                      </p>
                    </div>
                  )}
                  {mentorRecord.createdAt && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-2">
                        Member Since
                      </p>
                      <p className="text-lg text-slate-900">
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
                  {mentorRecord.verifiedStatus && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-2">
                        Status
                      </p>
                      <Badge className="bg-emerald-500 text-white text-sm">
                        {mentorRecord.verifiedStatus}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Trust Badges */}
              <Card className="border border-slate-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">
                    Trust & Safety
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Verified Identity</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Background Checked</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Secure Messaging</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Privacy Protected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Suggested Mentors */}
        {otherSuggestedMentors.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  More Great Mentors
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Other Mentors
                {mentorRecord.country && (
                  <span className="text-emerald-600">
                    {" "}
                    from {capitalizeFirstLetter(mentorRecord.country)}
                  </span>
                )}
              </h2>
              <p className="text-slate-600">
                Discover more mentors who can help you succeed
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSuggestedMentors.map((mentor) => (
                <Link
                  href={`/mentors/${mentor.userId}`}
                  key={mentor.userId}
                  className="group max-w-[350px] min-h-[400px]"
                >
                  <MentorCard
                    mentor={mentor}
                    currentUserRole={role}
                    currentUserId={currentUserId}
                  />
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                asChild
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-12 px-8 font-semibold"
              >
                <Link href="/mentors">
                  View All Mentors
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
