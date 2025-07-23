"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "../../../../../server/lib/auth/auth-client"
import Logo from "@/components/ui/Logo"

export default function VerifyEmail() {
    const params = useSearchParams()
    const router = useRouter()
    const email = params.get("email") as string
    const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail=emailPattern.test(email)
    const [message, setMessage] = useState("A verification link has been sent to your email.")
    
    if(!isValidEmail){
      return (
        <div className="flex items-center justify-center flex-col">
            <p className="text-2xl font-bold my-4 text-center">Invalid email</p>
            <p className="text-center text-xl font-medium ">Please try with a valid email</p>
        </div>
      )
    }

    const handleClick = async () => {
        if (!email) {
            toast.error("Email not found. Please try logging in again.")
            router.push("/login")
            return
        }

        
        try {
            await authClient.sendVerificationEmail({
                email,
                callbackURL: "/sign-up/onboarding",
            })
            toast.success("Verification email sent!")
            setMessage("Verification email sent! Please check your inbox.")
        } 
        catch (error) {
            toast.error("Failed to send verification email. Please try again.")
            console.log(error)
            console.log(message)
        } 
      
    }

   

    return (
        <div className="flex flex-col items-center justify-center">

          <div className="message-container bg-white  p-4 max-w-[600px]">
              <Logo />
              <h1 className="text-2xl font-bold my-4 text-center">Verifying your email</h1>
              <div className="px-8">
                <p className="">You are almost there! We sent email to <span className="font-bold">{email}</span></p>
              <p className="mb-1">Just click the link in the email to complete your sign up.</p>
              <p className="mb-4">If you don&apos;t see it in your inbox, check your spam folder.</p>
              </div>
                
                <div className="px-4">

              <button onClick={handleClick} className="w-full bg-[#4ED7F1] hover:scale-105  py-2 px-4 font-bold cursor-pointer">Resend Link</button>
                </div>
                <p className="text-center mt-2 ">Need help? <Link href="/contact" className="hover:underline">Contact Us</Link> </p>


          </div>
           
        </div>
    )
}