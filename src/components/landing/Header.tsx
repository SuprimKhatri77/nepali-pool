"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white lg:rounded-md flex justify-between items-center text-black shadow-md  px-6 lg:px-10 relative">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/landing/logo.png"
          alt="logo"
          width={138}
          height={138}
          className="w-20 h-18"
        />
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden sm:flex items-center mt-1">
        <ul className="flex gap-8 text-base">
          {["Home", "Schools", "Mentors", "Guides"].map((item) => (
            <li key={item} className="relative group">
              <Link
                href={
                  item === "Home"
                    ? "/"
                    : item === "Schools"
                      ? "/all-schools"
                      : `/${item.toLowerCase()}`
                }
                className="after:block after:h-[2px] after:bg-black after:w-0 after:transition-all after:duration-300 group-hover:after:w-full"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Login Button */}
      <div className="hidden sm:block" id="div2">
        <button
          className="
               bg-[#3A86FF] hover:bg-[#2a64c2]
           text-white rounded-[9px] px-4 py-2 font-bold"
        >
          <Link href="/login">Login</Link>
        </button>
      </div>

      {/* Hamburger Menu (Mobile) */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <div className="space-y-1">
            <span
              className={`block h-1 w-6 bg-black transition-transform ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-1 w-6 bg-black transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-1 w-6 bg-black transition-transform ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="text-white absolute top-full left-auto w-1/2 right-4 bg-gradient-to-b from-0% from-[#FF4053] to-[#260F55] to-100% border shadow-md sm:hidden flex flex-col items-center py-4 space-y-4 z-50">
          {["Home", "School", "Mentor", "Guides"].map((item) => (
            <Link
              key={item}
              href="/public/home"
              className="text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            href="/login"
            className="
                bg-[#3A86FF] hover:bg-[#2a64c2]
             text-black rounded-[9px] px-4 py-2 font-bold"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
