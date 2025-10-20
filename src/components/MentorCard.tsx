"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, BadgeCheck, Globe, ArrowRight } from "lucide-react";
import { MentorProfileWithUser } from "../../types/all-types";

export default function MentorCard({
  mentor,
  currentUserRole,
  currentUserId,
}: {
  mentor: MentorProfileWithUser;
  currentUserRole?: "student" | "mentor" | "none" | "admin" | null;
  currentUserId: string | null;
}) {
  const router = useRouter();
  const {
    userId,
    bio,
    city,
    country,
    imageUrl,
    verifiedStatus,
    user,
    nationality,
  } = mentor;

  function handleRoute() {
    router.push(`/mentors/${userId}`);
  }

  return (
    <Card
      className="group w-full h-full border border-gray-200 rounded-2xl shadow-sm 
             hover:shadow-lg transition-all duration-300 cursor-pointer 
             hover:border-emerald-400 bg-white hover:scale-105"
      onClick={() => {
        if (currentUserRole === "mentor" && mentor.userId === currentUserId) {
          router.push("/profile");
        } else {
          router.push(`/mentors/${mentor.userId}`);
        }
      }}
    >
      {/* Top Section */}
      <CardHeader className="relative p-0 flex flex-col items-center justify-center">
        <div className="relative w-[120px] h-[120px] mt-4">
          <Image
            src={imageUrl || "/default-avatar.png"}
            alt={user.name || "Mentor"}
            fill
            className="rounded-full object-cover"
          />
          {verifiedStatus === "accepted" && (
            <div className="absolute bottom-1 right-1 bg-emerald-400 text-white rounded-full p-[4px] shadow-md">
              <BadgeCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-1">
            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            {city}, {country}
          </p>
        </div>
      </CardHeader>

      {/* Info Section */}
      <CardContent className="px-4 py-3">
        <div className="flex items-center justify-center gap-2 mb-2 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-emerald-500" />
          <span className="capitalize">{nationality || "Not provided"}</span>
        </div>

        <p className="text-sm text-gray-700 text-center line-clamp-3 italic">
          “{bio || "This mentor hasn’t added a bio yet."}”
        </p>

        <div className="mt-3 flex justify-center items-center gap-1 text-yellow-500 text-sm font-medium">
          <Star className="h-4 w-4 fill-yellow-500" />
          <span>4.8 / 5</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4 mt-auto">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleRoute();
          }}
          className="relative w-full flex items-center justify-center gap-3 
                 bg-emerald-400 text-white font-semibold rounded-lg 
                 transition-all duration-300 ease-in-out 
                 hover:bg-emerald-500 hover:scale-[1.03] 
                 group overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 text-black">
            View Profile
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>

          {/* animated background highlight */}
          <span className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Button>
      </CardFooter>
    </Card>
  );
}
