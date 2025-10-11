"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { UserSelectType } from "../../../../../../lib/db/schema";

export default function MentorCard({
  userId,
  user,
  imageUrl,
  city,
  country,
  createdAt,
}: {
  readonly user: UserSelectType;
  readonly userId: string;
  readonly imageUrl: string;
  readonly city: string;
  readonly country: string;
  readonly createdAt: string;
}) {
  console.log(createdAt);
  const router = useRouter();
  function handleRoute() {
    router.push(`/public/mentors/${userId}`);
  }
  return (
    <div
      id="card"
      className="max-w-[220px] h-[320px]   w-full bg-gradient-to-b from-[#D9D9D9] via-[#69439D] to-[#15023B] from-0% via-0% to-100% rounded-[8px]  p-4"
    >
      <div id="icon" className="flex  justify-center my-3">
        <Image
          src={`${imageUrl}`}
          alt="signup"
          width={127}
          height={127}
          className="rounded-full  object-center object-cover w-[127px] h-[127px]"
        ></Image>
      </div>
      <div id="content" className="text-white">
        <ul className="flex flex-col gap-2 items-start justify-start mt-3">
          <li className="text-center font-medium text-xs">
            Name:<span>&nbsp;{user.name}</span>
          </li>
          <li>
            <p className="text-center text-xs font-medium">
              Address:&nbsp;{`${city}, ${country}`}
            </p>
          </li>
          <li>
            <p className="text-center text-xs font-medium">
              Specialize:&nbsp;{`Job Search`}
            </p>
          </li>
          <li>
            <p className="text-center text-xs font-medium">Rating:⭐⭐⭐⭐</p>
          </li>
        </ul>
      </div>

      <button
        onClick={handleRoute}
        className="bg-gradient-to-b from-0% via-0% to-100% from-[#D9D9D9] via-[#69439D] to-[#15023B] text-white cursor-pointer text-base py-2 w-[170px] rounded-[8px] mt-4 mb-3"
      >
        {" "}
        View Profile
      </button>
    </div>
  );
}
