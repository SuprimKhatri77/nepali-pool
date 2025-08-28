"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
type SchoolCardProps = {
  id: string;
  name: string | null;
  city: string | null;
  imageUrl: string;
  supportsInternationalStudents: boolean | null;
};

export default function SchoolCard({
  id,
  name,
  city,
  imageUrl,
  supportsInternationalStudents,
}: readonly SchoolCardProps) {
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/public/schools/${id}`);
  };
  return (
    <div
      id="card"
      className="max-w-[220px] h-[320px] relative  w-full bg-gradient-to-b from-[#7BCCEA]  to-[#0F4055] from-0%  to-100% rounded-[8px]  p-4"
    >
      <div id="icon" className="flex items-center justify-center my-3">
        <Image src={imageUrl} alt="signup" width={50} height={30}></Image>
      </div>
      <div id="content" className="text-white">
        <h4 className="text-center font-medium">{name}</h4>
        <ul className="flex flex-col gap-2 items-start justify-start mt-3">
          <li>
            <p className="text-center text-xs font-medium">Address:{city}</p>
          </li>
          <li>
            <p className="text-center text-xs font-medium">
              International Students:
              {`${supportsInternationalStudents ? "Yes" : "No"}`}
            </p>
          </li>
        </ul>
      </div>
      <div
        id="butonContainer"
        className="h-16 w-full absolute bottom-0 left-0 bg-white stroke-black stroke-2 flex justify-center items-center border-black border-solid border-1 border-t-0"
      >
        <button
          onClick={() => handleClick(id)}
          className="bg-black text-white cursor-pointer text-base py-2 w-[170px] rounded-[8px]"
        >
          {" "}
          View More Detail
        </button>
      </div>
    </div>
  );
}
