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
import { MapPin, Star, MessageSquareIcon, Heart } from "lucide-react";
import { StudentProfileWithUser } from "../../../../types/all-types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageViewComponent from "../ImageViewComponent";
import { capitalizeFirstLetter } from "better-auth";

export default function AdminStudentProfile({
  studentDetail,
}: Readonly<{ studentDetail: Omit<StudentProfileWithUser, "videoCall"> }>) {
  const router = useRouter();
  const [openImage, setOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  console.log(studentDetail);


  return (
    <section className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <Card className="bg-background text-gray-900 shadow-lg border rounded-2xl">
        {/* Header */}
        <CardHeader className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          {/* Profile Image */}
          <div
            onClick={() => {
              setOpenImage(true);
              setImageUrl(studentDetail.imageUrl ?? "");
            }}
            className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-emerald-400 shadow-md cursor-pointer"
          >
            <Image
              src={studentDetail.imageUrl ?? ""}
              alt={studentDetail.user.name}
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Name + Info */}
          <div className="flex flex-col flex-1 space-y-3">
            <div className="flex grow gap-4 justify-between items-start">
              <CardTitle className="text-2xl sm:text-4xl font-bold tracking-tight">
                {studentDetail.user.name}
              </CardTitle>

              <div className="flex gap-2 lg:mt-0 mt-2">
                <Button
                  onClick={() => router.push("/chats")}
                  size="sm"
                  className="bg-emerald-400 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>

            <CardDescription className="text-gray-600 flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="capitalize">
                {studentDetail.city}, {studentDetail.district}
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
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
          {/* Student Record */}
          <div>
            <h2 className="text-xl font-semibold text-emerald-600 mb-3">
              Student Record
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

            {/* Favorite Destinations */}
            <h2 className="text-xl font-semibold text-emerald-600 mb-3">
              Favorite Destinations
            </h2>
            <div className="flex flex-wrap gap-2">
              {studentDetail.favoriteDestination?.map((country, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  {country}
                </Badge>
              ))}
            </div>

            <Separator className="my-4 bg-gray-200" />

            {/* Sex */}
            <div className="flex justify-between text-gray-700">
              <span>Sex:</span>
              <span className="capitalize font-semibold">
                {studentDetail.sex}
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
            <h2 className="text-xl font-semibold text-emerald-600 mb-3">Bio</h2>
            <p className="text-gray-700 leading-relaxed">{studentDetail.bio ? capitalizeFirstLetter(studentDetail.bio) : ""}</p>

            <Separator className="my-4 bg-gray-200" />

            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {studentDetail.user.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {studentDetail.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {studentDetail.city}
              </p>
              <p>
                <span className="font-semibold">District:</span>{" "}
                {studentDetail.district}
              </p>
            </div>
          </div>
        </CardContent>

        <Separator className="my-4 bg-gray-200" />

        {/* Footer */}
        <CardContent className="flex flex-wrap items-center justify-between text-sm text-gray-700">
          <p>Profile Created: {new Date(studentDetail.createdAt ?? "").toLocaleDateString()}</p>
          <p>Last Updated: {new Date(studentDetail.updatedAt ?? "").toLocaleDateString()}</p>
        </CardContent>
      </Card>

      {/* Image View */}
      {openImage && (
        <ImageViewComponent
          onClose={() => {
            setImageUrl("");
            setOpenImage(false);
          }}
          imageUrl={imageUrl}
        />
      )}
    </section>
  );
}
