"use client";

import Logo from "@/components/ui/Logo";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgetPassword() {

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="rounded-xl message-container bg-white item  p-8 max-w-[500px]">
        <Logo />
        <motion.div
          initial={{ scale: 1 }}
          animate={
            { scale: [1, 0.9, 1] }
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1,
            ease:"easeInOut"
          }}>
          <Image
            className="m-auto mt-3"
            src="/reset.png"
            alt="reset"
            width={50}
            height={50}
          />
        </motion.div>

        <h1 className="text-3xl px-8 font-medium text-[#4C585B] my-4 text-left ">
          Reset Your Password
        </h1>
        <div className="px-8 flex flex-col">
          <p className="text-sm text-[#4C585B] text-left">
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
          <p className="text-[#4C585B] font-medium py-2">we have sent reset link on your email,
            check it if you don’t see it, you can check spam folder.</p>
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
