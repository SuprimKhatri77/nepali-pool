"use client";

import { redirect, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "../../../../../server/lib/auth/auth-client";
import Logo from "@/components/ui/Logo";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "../../../../../lib/db";
import { mentorProfile, studentProfile, user } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export default function VerifyEmail() {
  const params = useSearchParams();
  const email = params.get("email") as string;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailSendCount, setEmailSendCount] = useState(0);

  const isValidEmail = emailPattern.test(email);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState(
    "A verification link has been sent to your email."
  );
  //below the valid email check the useEffect don't work since, it needds to be render in all components of the page
  useEffect(() => {
    const firstSent = localStorage.getItem("firstEmailSentAt");
    const lastSent = localStorage.getItem("lastEmailSentAt");
    const count = localStorage.getItem("count");
    const now = Date.now();
    if (firstSent && now - parseInt(firstSent) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("firstSent");
      localStorage.removeItem("lastSent");
      localStorage.removeItem("count");
      setEmailSendCount(0);
    } else {
      setEmailSendCount(count ? parseInt(count) : 0);
    }

    if (lastSent) {
      const diff = Math.floor((now - parseInt(lastSent)) / 1000);
      const remaining = 60 - diff;
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [cooldown]);

   useEffect(()=>{
     const  checkEmail= async ()=> {
      try{
        const [userRecord]= await db.select().from(user).where(eq(user.email, email))
        const [mentorProfileRecord] = await db.select().from(mentorProfile).where(eq(mentorProfile.userId, userRecord.id))
        const [studentProfileRecord] = await db.select().from(studentProfile).where(eq(studentProfile.userId, userRecord.id))
        if(!userRecord){
          return redirect("/sign-up")
        }
        if(userRecord.emailVerified){
          if(userRecord.role === "none"){
            return redirect("/select-role")
          }
          if(userRecord.role === "admin"){
            return redirect("/admin")
          }
          if(userRecord.role === "mentor"){
            if(!mentorProfileRecord){
              return redirect("/sign-up/onboarding/mentor")
            }
          }
          if(userRecord.role === "student"){
            if(!studentProfileRecord){
              return redirect("/sign-up/onboarding/student")
            }
          }
        }
      }catch(error){
        console.log(error)
      }
     }
     checkEmail()
  },[])

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

  const handleClick = async () => {
    const now = Date.now();

    if (emailSendCount === 0) {
      localStorage.setItem("firstEmailSentAt", now.toString());
    }

    if (emailSendCount >= 5) {
      toast.error(
        "You have reached the maximum number of email sends. Please try again later."
      );
      setMessage(
        "You have reached the maximum number of email sends. Please try again later."
      );
      return;
    }
    if (cooldown > 0) return;
   

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/sign-up/onboarding",
      });
      toast.success("Verification email sent!");
      setMessage("Verification email sent! Please check your inbox.");
      const newcount = emailSendCount + 1;
      setEmailSendCount(newcount);
      localStorage.setItem("count", newcount.toString());
      localStorage.setItem("lastEmailSentAt", now.toString());
      setCooldown(60);
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
      console.log(error);
    }
  };

 

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
            src="/verify.png"
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
            disabled={cooldown > 0}
            className={`rounded-xs w-full  hover:scale-105  py-2 px-4 font-bold cursor-pointer duration-500 
              ${
                cooldown > 0 || emailSendCount >= 5
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4ED7F1] hover:scale-105"
              }
              `}
          >
            Resend Link
          </button>
          {cooldown > 0 && emailSendCount < 5 && (
            <p className="text-center mt-1">
              Resend Link in <span className="font-bold">{cooldown}</span>{" "}
              Seconds
            </p>
          )}
          {emailSendCount >= 5 && (
            <p className="text-center mt-1">
              You have reached the maximum number of email sends. Please try
              again later.
            </p>
          )}
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
