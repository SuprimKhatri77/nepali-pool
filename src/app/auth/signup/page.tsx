"use client";
import Image from "next/image";
import React, { useState } from "react";
export default function SignUpPage() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    agree: false,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    agree: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked //  checkbox handling
        : value;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
    validateField(name, fieldValue);
  };

  const validateField = (name: string, value: string | boolean) => {
    let error = "";
    switch (name) {
      case "name":
        if (typeof value === "string" && value.length > 3 && !/^[A-Za-z\s]{2,40}$/.test(value)) {
          error = "Only letters and spaces allowed (2–40 chars)";
        }
        break;
      case "email":
        if (
          typeof value === "string" &&
          !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        ) {
          error = "Invalid email format";
        }
        break;
      case "password":
        if (
          typeof value === "string" &&
          value.length < 6 &&
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value)
        ) {
          error = "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character";
        }
        break;
      case "agree":
        if (!value) {
          error = "You must agree to continue";
        }
        break;
      default:
        break;
    }

    setFormErrors((prevError) => ({
      ...prevError,
      [name]: error,
    }));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
   console.log("Form submitted with data:", signupData);
  }
  return (
    <div className="flex md:flex-row sm:flex-col flex-col-reverse gap-4 lg:gap-8 justify-between  items-start md:items-center p-8">
      <div id="signup-image" className="max-w-96 md:max-w-[550px] lg:max-w-[818px] w-full">
        <Image priority src="/signup.png" alt="signup" width={818} height={818} />
      </div>

      <div
        id="signup-form"
        className="max-w-[550px] w-full   flex items-end md:items-center justify-center"
      >
        <form onSubmit={handleSubmit} className="w-[90%] p-6 text-black bg-[#A6AEBF] rounded-[13px] shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Get Started Now
          </h2>

          <label htmlFor="name" className="block  font-medium">
            Name
          </label>
          <input
            autoComplete="off"
            type="text"
            name="name"
            value={signupData.name}
            onChange={handleChange}
            className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]"
            placeholder="Enter your name"
            required
          />
          {formErrors.name && (
            <p className="text-red-600 text-sm mb-1">{formErrors.name}</p>
          )}

          <label htmlFor="email" className="block  font-medium">
            Email
          </label>
          <input
            autoComplete="off"
           
            type="email"
            name="email"
            value={signupData.email}
            onChange={handleChange}
            className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]"
            placeholder="Enter your email"
            required
          />
          {formErrors.email && (
            <p className="text-red-600 text-sm mb-1">{formErrors.email}</p>
          )}

          <label htmlFor="password" className="block  font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$"
            value={signupData.password}
            onChange={handleChange}
            className="max-w-[440px] w-full p-2 outline-none mb-2 rounded border border-[#333446]"
            placeholder="Enter your password"
            required
          />
          {formErrors.password && (
            <p className="text-red-600 text-sm mb-1">{formErrors.password}</p>
          )}

          <label htmlFor="role" className="block  font-medium">
            Role
          </label>
          <select
            name="role"
            
            value={signupData.role}
            onChange={handleChange}
            className="max-w-[440px] w-full bg-[#A6AEBF] p-2 outline-none mb-3 rounded border border-[#333446]"
          >
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>

          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              name="agree"
              checked={signupData.agree}
              onChange={handleChange}
              className="mr-2"
            />
            <span>I agree to terms and policy</span>
          </div>
          {formErrors.agree && (
            <p className="text-red-600 text-sm mb-1">{formErrors.agree}</p>
          )}

          <button
            type="submit"
            
            className="max-w-[440px] cursor-pointer w-full p-2 outline-none 
              bg-gradient-to-r from-[#4ED7F1] to-[#5C6CF2] 
              hover:from-[#5C6CF2] hover:to-[#4ED7F1] 
              transition-all duration-300 ease-in-out rounded font-bold"
          >
            Sign Up
          </button>

          <p className="mt-3 text-center text-sm">
            Have an account?&nbsp;<a
              href="/auth/login"
              className="text-[#0F3DDE] hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
