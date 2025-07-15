"use client";

import Image from "next/image";
import React, { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { FormState, SignUp } from "../../../../server/actions/signup";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function SignUpPage() {
  // we are setting initial state so the first time running the backend will not return values undefined or errors.
  const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
  };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    SignUp,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      console.log("State message:", state.message);
      if (state.message === "Validation Failed") {
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
      } else {
        toast.success(
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
    }
  }, [state.message]);

  return (
    <div className="flex md:flex-row sm:flex-col flex-col-reverse gap-4 lg:gap-8 animate-in fade-in duration-400 justify-between items-center p-8">
      <div className="hidden md:hidden lg:max-w-[818px] h-full lg:block w-full">
        <Image
          priority
          src="/signup.png"
          alt="signup"
          width={700}
          height={700}
          className="shadow-2xl rounded-2xl"
        />
      </div>

      <div className="max-w-[550px] w-full flex items-center justify-center">
        <form
          action={formAction}
          className="w-[90%] p-10 text-black bg-[#FBFBFB] rounded-[13px] shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-3 text-center">
            Get Started Now
          </h2>

          <div className="flex items-center justify-between gap-2">
            <div id="firstname" className="flex flex-col gap-1">
              <label htmlFor="firstname" className="block font-medium">
                First Name
              </label>
              <input
                autoComplete="off"
                type="text"
                name="firstname"
                required
                className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]
  focus:border-blue-500 focus:ring-2  focus:ring-blue-300 
             transition duration-200"
                placeholder="first name"
              />
            </div>

            <div id="lastname" className="flex flex-col gap-1">
              <label htmlFor="lastname" className="block font-medium">
                Last Name
              </label>
              <input
                autoComplete="off"
                type="text"
                name="lastname"
                required
                className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]
  focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
             transition duration-200"
                placeholder="last name"
              />
            </div>
          </div>
          {state.errors?.firstname && (
            <p className="text-red-600 text-sm mb-1">
              {state.errors.firstname[0]}
            </p>
          )}
          {state.errors?.lastname && (
            <p className="text-red-600 text-sm mb-1">
              {state.errors.lastname[0]}
            </p>
          )}

          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            defaultValue="email@gmail.com"
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
          {state.errors?.password && (
            <p className="text-red-600 text-sm mb-1">
              {state.errors.password[0]}
            </p>
          )}

          <label htmlFor="role" className="block font-medium">
            Role
          </label>
          <select
            name="role"
            defaultValue="student"
            className="max-w-[440px] w-full  bg-[#FBFBFB] p-2 outline-none mb-3 rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
             transition duration-200"
          >
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>

          {state.errors?.role && (
            <p className="text-red-600 text-sm mb-1">{state.errors.role[0]}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="max-w-[440px] cursor-pointer w-full p-2 outline-none 
              bg-gradient-to-r from-[#5C6CF2] to-[#4ED7F1] 
              hover:scale-102
              transition-all duration-300 ease-in-out rounded font-bold
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
              "Sign Up"
            )}
          </button>

          <p className="mt-3 text-center text-sm">
            Have an account?&nbsp;<Link
              href="/auth/login"
              className="text-[#0F3DDE] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
          <Logo/>
        </form>
      </div>
    </div>
  );
}
