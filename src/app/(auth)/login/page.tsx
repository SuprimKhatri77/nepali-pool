"use client";
import Link from "next/link";
import Image from "next/image";

import { useActionState, useEffect } from "react";
import { FormState, SignIn } from "../../../../server/actions/signin";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
  }
  const [state, formAction, isPending] = useActionState<FormState, FormData>(SignIn, initialState)


  useEffect(() => {
    if (state.message) {
      console.log("State message:", state.message);
      if (state.message === "Invalid email or password") {
        toast.error(
          <div
            className="flex items-center justify-between gap-2"
            style={{ width: "300px" }}
          >
            <span>{state.message}</span>
            <button
              className="p-2 mr-2 border-none bg-red-500 text-sm cursor-pointer text-white rounded-md"
              onClick={() => toast.dismiss()} // cancel current toast
            >
              Cancel
            </button>
          </div>
        );
      }
      else {
        toast.success(state.message)

      }
    }
  }, [state.message])





  return (
    <div className="w-full  flex md:flex-row sm:flex-col flex-col-reverse gap-4 lg:gap-8 animate-in fade-in duration-400  justify-center items-center p-8">


      <div className="max-w-[500px] w-full flex items-center justify-center bg-white rounded-sm shadow-2xl">
        <form
          action={formAction}
          className="w-[90%] pr-4 pl-4 pt-7 pb-7 mb-2 text-black  rounded-[13px]"
        >
          <h2 className="text-2xl font-bold mb-2 text-left">
            Welcome Back!
          </h2>
          <p className="text-xs text-left mb-5 font-medium">Enter your credentials to access your account</p>


          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            autoComplete="off"
            type="email"
            name="email"
            className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
             transition duration-200
            "
            placeholder="Enter your email"
            required
          />
          {state.errors?.email && (
            <p className="text-red-600 text-sm mb-1">{state.errors.email[0]}</p>
          )}

          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            autoComplete="off"
            type="password"
            name="password"
            className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
             transition duration-200"
            placeholder="Enter your password"
            required
          />
         

          <div id="forget" className="flex items-center justify-end sm:justify-between mb-2 p-2">

            <div className="hidden sm:flex  sm:items-center  gap-2">
              <input type="checkbox" name="remember" id="" />
              <p className="text-sm">Remember me</p>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-[#0F3DDE] text-sm hover:underline sm:font-medium"
            >
              Forgot Password?
            </Link>
          </div>
           {state.errors?.password && (
            <p className="text-red-600 text-sm mb-1">
              {state.errors.password[0]}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="max-w-[440px] cursor-pointer w-full p-2 outline-none 
              bg-[#4ED7F1] font-bold mb-2 hover:scale-102
              transition-all duration-300 ease-in rounded 
              flex items-center justify-center gap-2
              "
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-cyan-200 drop-shadow-md"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-55"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="mt-3 text-center text-sm sm:font-medium">
            {`Don't have an account?`}&nbsp;<Link
              href="/sign-up"
              className="text-[#0F3DDE] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
          <Logo />
        </form>
      </div>

      <div className="lg:max-w-[618px] w-full lg:block hidden">
        <Image className="shadow-2xl overflow-hidden rounded-2xl"
          src="/sign-in.png" priority alt="signin" width={500} height={500} />
      </div>
    </div>
  )
}