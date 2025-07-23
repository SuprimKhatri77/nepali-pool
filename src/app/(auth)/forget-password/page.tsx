"use client";

import Logo from "@/components/ui/Logo";
import Image from "next/image";
import Link from "next/link";

export default function ForgetPassword() {

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="rounded-xl message-container bg-white item p-8 max-w-[600px]">
        <Logo />
        <Image
          className="m-auto mt-3"
          src="/verify.png"
          alt="Verify"
          width={50}
          height={50}
        />

        <h1 className="text-3xl font-medium text-[#4C585B] my-4 text-center">
          Reset Your Password
        </h1>
        <div className="px-8 flex flex-col justify-center items-center">
          <p className="text-base font-light">
            Enter your valid email address to reset your password
          </p>
          <div className="flex flex-col gap-1 w-full max-w-[500px] mt-2">
            <input
              autoComplete="off"
              type="email"
              name="email"
              className="max-w-[440px] w-full p-2 outline-none mb-2  rounded-sm border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200
            "
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="px-4 flex justify-center ">
          <button
            className={`rounded-xs w-[90%] mt-2 bg-[#4ED7F1] hover:scale-105  py-2 px-4 font-bold cursor-pointer duration-500 
           
              `}
          >
            Request Reset Link
          </button>
        </div>
        <p className="p-4 text-center mt-2 ">
          Need help?{" "}
          <Link href="/contact" className="hover:underline text-blue-700">
            Contact Us
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}
