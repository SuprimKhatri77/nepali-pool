"use client";

import {  useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";
import Image from "next/image";
import { motion } from "framer-motion";
import { authClient } from "../../../server/lib/auth/auth-client";
import Link from "next/link";
import { set } from "better-auth";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const email = params.get("email") as string;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = emailPattern.test(email);
  const [message, setMessage] = useState(
    "A verification link has been sent to your email."
  );
  //below the valid email check the useEffect don't work since, it needds to be render in all components of the page


  
  const handleClick = async () => {
   
    setIsLoading(true)
      try {
        await authClient.sendVerificationEmail({
            email,
            callbackURL: "/sign-up/onboarding",
        })
        toast.success("Verification email sent!")
        setMessage("Verification email sent! Please check your inbox.")
    } catch (error) {
        toast.error("Failed to send verification email. Please try again.")
    } finally {
        setIsLoading(false)
    } }

  if (!isValidEmail) {
    return (
      <div className="flex items-center justify-center flex-col">
        <p className="text-2xl font-bold my-4 text-center">Invalid email</p>
        <p className="text-center text-xl font-medium ">
          Please try with a valid email
        </p>
        {message}
      </div>
    );
  }


    


  

 

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-xl message-container bg-white item p-4 max-w-[600px]">
        <Logo />
        <Image
          className="m-auto"
          src="/gmail.png"
          width={125}
          height={40}
          alt="gmail"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -15, 5, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        >
          <Image
            className="m-auto"
            src="/logo.png"
            alt="Verify"
            width={50}
            height={50}
          />
        </motion.div>

        <h1 className="text-2xl font-bold my-4 text-center text-[#4C585B]">
          Verifying your email
        </h1>
        <div className="px-8 flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-[#4C585B] p-1 text-center mb-2">
            You are almost there! We sent email to{" "}
            <span className="text-[#4C585B] text-sm font-bold">{email}</span>
          </p>
          <p className="text-sm text-center">
            Just click the link in the email to complete your sign up.
          </p>
          <p className="text-sm mb-4 text-center">
            If you don&apos;t see it in your inbox, check your spam folder.
          </p>
        </div>

        <div className="px-4">
          <button
            onClick={handleClick}
            
            className={`rounded-xs w-full  hover:scale-105  py-2 px-4 font-bold cursor-pointer duration-500 
             bg-[#65c2d9]
              `}
          >
            {isLoading ? "Sending..." : "Resend Email"}
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
