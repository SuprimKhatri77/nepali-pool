"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@react-email/components";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { SchoolSelectType } from "../../../../lib/db/schema";

export default function SchoolCard({schoolDetail}:{schoolDetail: SchoolSelectType}) {
  const {id, name, city, imageUrl, supportInternationalStudents} = schoolDetail
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (id: string) => {
    const schoolPathRegex = /^\/schools\/[a-f0-9-]+$/i;

    if (schoolPathRegex.test(pathname)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      router.push(`/schools/${id}`);
    }, 400); // wait for scroll animation
  };
  return (
    <Card
      className="bg-white border border-gray-200 rounded-xl p-6 
                 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 
                 flex flex-col items-center text-center w-full max-w-[280px]"
    >
      {/* Image Section */}
      <CardHeader className="flex flex-col items-center justify-center w-[150px] h-[100px]">
          <Image
            src={imageUrl ?? ""}
            alt={name ?? "School Logo"}
            width={150}
            height={150}
            className="object-contain "
          />
      </CardHeader>

      {/* Content Section */}
      <CardContent className="space-y-3">
        <CardTitle className="text-lg font-semibold text-gray-900">{name}</CardTitle>
        <ul className="space-y-1 text-sm text-gray-600 font-medium">
          <li>📍 Address: {city}</li>
          <li>
            🌍 International Students:{" "}
            <span className="font-semibold text-gray-800">
              {supportInternationalStudents ? "Yes" : "No"}
            </span>
          </li>
        </ul>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="mt-auto pt-4">
        <Button
          onClick={() => handleClick(id)}
          className="w-full bg-black text-white hover:bg-emerald-500 
                     hover:text-white transition-all duration-300 text-sm font-medium p-2 rounded-lg"
        >
          View More Details
        </Button>
      </CardFooter>
    </Card>
  );
}
