"use client"

import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const params= useSearchParams()
  const email = params.get("email") as string;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailPattern.test(email)
  if (!isValidEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Email is not valid</h1>
        <p className="text-lg">Please provide a valid email to verify.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Verify Email</h1>
    </div>
  )
}