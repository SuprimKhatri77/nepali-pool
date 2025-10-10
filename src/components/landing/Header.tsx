"use client";

import Link from "next/link";
import { useState } from "react";

// Mock components for demo
// const Image = ({ src, alt, width, height, className, loading }) => (
//   <div
//     className={`${className} bg-gray-200 flex items-center justify-center text-xs text-gray-500`}
//   >
//     {alt}
//   </div>
// );

// const Link = ({ href, children, className }) => (
//   <Link href={href} className={className}>
//     {children}
//   </Link>
// );

// Header Component
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const session = null; // Mock session
  const isPending = false;

  return (
    <header className="bg-white border-b border-gray-200 px-6 lg:px-10 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              NP
            </div>
            <span className="font-semibold text-lg text-gray-900">
              NepaliPool
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {["Home", "Schools", "Mentors", "Guides"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <div className="hidden md:block">
          {!session ? (
            <Link
              href="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors"
              >
                Dashboard
              </Link>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col gap-2 pt-4">
            {["Home", "Schools", "Mentors", "Guides"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              className="mx-4 mt-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md text-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
