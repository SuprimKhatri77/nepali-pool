"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import React from "react";
import { MentorProfileWithUser } from "../../../../types/all-types";



export default function MentorCard({ mentor }: {mentor: MentorProfileWithUser}) {
  const router = useRouter();
  const { userId, bio, city, country, imageUrl, verifiedStatus, user } = mentor;

  function handleRoute() {
    router.push(`/mentors/${userId}`);
  }

  return (
    <Card
      onClick={handleRoute}
      className="group max-w-[270px] w-full border border-gray-200 rounded-2xl shadow-sm 
                 hover:shadow-lg transition-all duration-300 cursor-pointer 
                 hover:border-emerald-400 bg-white"
    >
      {/* Header - Image */}
      <CardHeader className="p-0 relative">
        <div className="relative w-[180px] rounded-full mx-auto  h-[180px]">
          <Image
            src={imageUrl || "/default-avatar.png"}
            alt={user.name || "Mentor"}
            fill
            className="object-cover flex justify-center rounded-full object-center"
          />
        </div>
        {verifiedStatus === "accepted" && (
          <span className="absolute top-2 right-2 bg-emerald-400 text-white rounded-full p-1">
            <BadgeCheck className="h-4 w-4" />
          </span>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 py-3 space-y-2">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          {user.name}
        </CardTitle>

        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <span className="capitalize">
            {city}, {country}
          </span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2">
          {bio || "No bio provided."}
        </p>

        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          <Star className="h-4 w-4 fill-yellow-500" />
          <span>4.8 / 5</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleRoute();
          }}
          className="w-full bg-emerald-400 hover:bg-emerald-500 text-white rounded-lg transition"
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
