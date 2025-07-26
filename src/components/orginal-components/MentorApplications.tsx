"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MentorApplications({ mentorProfileWithUser }: any) {
  const [filteredMentor, setFilteredMentor] = useState("all");

  const filteredMentors = mentorProfileWithUser.filter((mentor: any) => {
    if (filteredMentor === "all") return true;
    return mentor.verifiedStatus.toLowerCase() === filteredMentor;
  });

  return (
    <div className="bg-gradient-to-r from-[#BEDFFF] via-[#D1E9FF] to-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">
        Mentor Application Section
      </h1>

      {/*  Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["all", "pending", "accepted", "rejected"].map((status) => {
          const colors: Record<string, string> = {
            all: "bg-[#6764FF]",
            pending: "bg-[#E17100]",
            accepted: "bg-[#1AA56A]",
            rejected: "bg-[#CB4657]",
          };

          return (
            <button
              key={status}
              onClick={() => setFilteredMentor(status)}
              className={`px-4 py-2 rounded-lg text-white ${colors[status]}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          );
        })}
      </div>

      <div
        id="card-container"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-28 gap-y-6  py-6 px-12 bg-[#06367A] min-h-[600px]"
      >
        {filteredMentors.map((mentor: any) => {
          const colors: Record<string, string> = {
            pending: "bg-[#E17100]",
            accepted: "bg-[#1AA56A]",
            rejected: "bg-[#CB4657]",
          };
          const cardBg = colors[mentor.verifiedStatus] || "bg-[#6764FF]";
          return (
            <div
              key={mentor.userId}
              id="card"
              className={`w-68 p-5 h-90 ${cardBg} rounded-2xl shadow-md flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 `}
            >
              <div
                id="image-container"
                className="w-28 h-28 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
              >
                <Image
                  src={mentor.imageUrl}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-28 h-28 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
                />
              </div>

              <div id="shortDetail" className="mt-4  space-y-1 text-white">
                <h3 className="text-lg font-semibold">
                  Name: {mentor.user?.name}
                </h3>
                <p className=" text-base font-medium">
                  Country:{" "}
                  <span className="font-medium text-sm ">
                    {mentor.city},{mentor.country}
                  </span>
                </p>
                <p className="text-base font-medium">
                  Email: {}
                  <span className="font-medium text-sm">
                    <Link href={`mailto:${mentor.user?.email}`}>
                      {mentor.user?.email}
                    </Link>
                  </span>
                </p>
                <p className="text-base font-medium">
                  Status:{" "}
                  <span className={` font-medium text-sm`}>
                    {mentor.verifiedStatus === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </p>
                <p className="text-base font-medium">
                  Applied On: <span className="font-medium">2081/04/02</span>
                </p>
              </div>

              <Link href={`/admin/mentor-applications/${mentor.userId}`} className="mt-4 px-4 py-2 bg-[#1D293D] text-white rounded-lg shadow-md hover:scale-105 transition-transform">
                View Profile
              </Link >
            </div>
          );
        })}
      </div>
    </div>
  );
}
