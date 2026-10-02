"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Video,
  LogOut,
  Calendar,
  Users,
  TrendingUp,
  Briefcase,
  ClipboardCheck,
  HelpCircle,
} from "lucide-react";

type Props = {
  chatCount: number;
  scheduledVideoCallCount: number;
  totalUniqueStudents: number;
  chatIncreaseCount: number;
  pendingBookingCount: number;
  newEnquiryCount: number;
};
export default function MentorPage({
  chatCount,
  scheduledVideoCallCount,
  totalUniqueStudents,
  chatIncreaseCount,
  pendingBookingCount,
  newEnquiryCount,
}: Props) {
  const [click, setClick] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setClick(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    setClick(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your mentorship today
          </p>
        </div>

        {pendingBookingCount > 0 && (
          <Link
            href="/dashboard/mentor/bookings?status=pending"
            className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6 hover:bg-amber-100/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-5 h-5 text-amber-700" />
              <p className="text-sm font-medium text-amber-900">
                {pendingBookingCount} booking
                {pendingBookingCount === 1 ? "" : "s"} waiting for payment
                verification
              </p>
            </div>
            <span className="text-sm font-semibold text-amber-800">
              Review →
            </span>
          </Link>
        )}

        {newEnquiryCount > 0 && (
          <Link
            href="/dashboard/mentor/enquiries?status=new"
            className="flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 mb-6 hover:bg-emerald-100/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <p className="text-sm font-medium text-emerald-900">
                {newEnquiryCount} new student enquir
                {newEnquiryCount === 1 ? "y" : "ies"} waiting for a reply
              </p>
            </div>
            <span className="text-sm font-semibold text-emerald-800">
              Reply →
            </span>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-emerald-100 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active Chats
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {chatCount}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />+{chatIncreaseCount} this
                    week
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Scheduled Calls
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {scheduledVideoCallCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Next: Today 3PM
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalUniqueStudents}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    All time
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Access your most used features
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/chats" className="w-full">
                <Button className="w-full h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">View Chats</p>
                      <p className="text-xs text-emerald-100">
                        Manage conversations
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/mentor/services" className="w-full">
                <Button className="w-full h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">My Services</p>
                      <p className="text-xs text-emerald-100">
                        Offerings & payment details
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/mentor/bookings" className="w-full">
                <Button className="w-full h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Service Bookings</p>
                      <p className="text-xs text-emerald-100">
                        Verify payments & bookings
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/mentor/enquiries" className="w-full">
                <Button className="w-full h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Enquiries</p>
                      <p className="text-xs text-emerald-100">
                        Free questions from students
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/video-call" className="w-full">
                <Button className="w-full h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Video Call List</p>
                      <p className="text-xs text-emerald-100">
                        Schedule & join calls
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>

            <Separator className="my-6 bg-emerald-100" />

            <Button
              onClick={handleClick}
              disabled={click}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {click ? "Logging out..." : "Logout"}
            </Button>
          </CardContent>
        </Card>

        {/* <Card className="border-emerald-100 shadow-sm mt-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New message from Sarah K.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Video call scheduled with John D.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New student subscription from Mike T.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </main>
    </div>
  );
}
