"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ChevronDownCircleIcon } from "lucide-react";
import { MentorProfileWithUser } from "../../../../types/all-types";
import { useState } from "react";
import ImageViewComponent from "../ImageViewComponent";
import { capitalizeFirstLetter } from "better-auth";

export default function AdminMentorProfile({
  mentorDetail,
}: Readonly<{ mentorDetail: MentorProfileWithUser }>) {
  // const status = ["accepted", "rejected", "pending"];
  const [openImage, setOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  return (
    <section className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <Card className="bg-background text-gray-900 shadow-lg border rounded-2xl">
        {/* Header */}
        <CardHeader className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          {/* Profile Image */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-emerald-400 shadow-md">
            <Image
              src={mentorDetail.imageUrl ?? ""}
              alt={mentorDetail.user.name}
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Name + Info */}
          <div className="flex flex-col flex-1 space-y-3">
            <div className="flex grow gap-4 justify-between items-start">
              <CardTitle className="text-2xl sm:text-4xl font-bold tracking-tight">
                {mentorDetail.user.name}
              </CardTitle>

              <div className="flex  gap-2 lg:mt-0 mt-2 ">
                <div
                  className={`flex items-center px-2 py-1 rounded-[6px]
               ${mentorDetail.verifiedStatus === "accepted" ? "bg-emerald-400 hover:bg-emerald-500 text-white" : mentorDetail.verifiedStatus === "rejected" ? "bg-destructive text-destructive" : "bg-black text-background"}`}
                >
                  {mentorDetail.verifiedStatus?.toUpperCase()}
                  <ChevronDownCircleIcon className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            <CardDescription className="text-gray-600 flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="capitalize">
                {mentorDetail.city}, {mentorDetail.country}
              </span>
            </CardDescription>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-2">
              <p className="text-lg font-semibold text-gray-700">Rating:</p>
              <div className="flex gap-1 items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold ml-2 text-gray-800">8.5</span>
            </div>
          </div>
        </CardHeader>

        <Separator className="my-4 bg-gray-200" />

        {/* Middle Section */}
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Mentorship Record */}
          <div>
            <h2 className="text-xl font-semibold text-emerald-600 mb-3">
              Mentorship Record
            </h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Calls:</span>
                <span className="font-semibold">10</span>
              </div>
              <div className="flex justify-between">
                <span>Requests:</span>
                <span className="font-semibold">40+</span>
              </div>
            </div>

            <Separator className="my-4 bg-gray-200" />

            {/* Specialization */}
            <h2 className="text-xl font-semibold text-emerald-600 mb-3">
              Specialization
            </h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Field:</span>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700"
                >
                  Computer Science
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Institution:</span>
                <span className="text-right">Kyoto Language School</span>
              </div>
              <div className="flex justify-between">
                <span>Working:</span>
                <span className="font-semibold">Yes</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
            <h2 className="text-xl font-semibold text-emerald-600 mb-3">Bio</h2>
            <p className="text-gray-700 leading-relaxed">
              {mentorDetail.bio ? capitalizeFirstLetter(mentorDetail.bio) : ""}
            </p>

            <Separator className="my-4 bg-gray-200" />

            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {mentorDetail.user.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {mentorDetail.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">Nationality:</span>{" "}
                {mentorDetail.nationality}
              </p>
            </div>
          </div>
        </CardContent>

        <Separator className="my-4 bg-gray-200" />

        {/* Footer */}
        <CardContent className="flex flex-wrap items-center justify-between text-sm text-gray-700">
          <p>
            <span className="font-semibold">Verified:</span>{" "}
            <Badge
              variant="secondary"
              className="bg-emerald-400 text-white capitalize"
            >
              {mentorDetail.verifiedStatus}
            </Badge>
          </p>
          <div className="flex gap-3 mt-2 md:mt-0">
            <Button
              onClick={() => {
                setOpenImage(!openImage);
                setImageUrl(mentorDetail.zyroCard ?? "");
              }}
              className="  hover:text-foreground hover:bg-background transition"
            >
              View Citizenship
            </Button>
          </div>
        </CardContent>
      </Card>
      {openImage && (
        <ImageViewComponent
          onClose={() => {
            setImageUrl("");
            setOpenImage(!openImage);
          }}
          imageUrl={imageUrl}
        />
      )}
    </section>
  );
}
