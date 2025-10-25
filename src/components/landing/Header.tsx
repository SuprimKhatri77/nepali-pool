"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { authClient } from "../../../server/lib/auth/auth-client";
import { Spinner } from "../ui/spinner";
import SignOutButton from "../SignOutButton";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import AnnouncementBanner from "../sessions/announcement-banner";
const MotionLink = motion(Link);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Schools", href: "/schools" },
  { name: "Mentors", href: "/mentors" },
  { name: "Guides", href: "/guides" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isChatRoute = pathname.startsWith("/chats");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const initials =
    session &&
    session.user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <>
      <AnnouncementBanner />
      <motion.header
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-white z-50 border-b border-gray-200 px-6 lg:px-10 py-4",
          !pathname.startsWith("/chats") && "sticky top-0"
        )}
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                NP
              </div>
              <span className="font-semibold text-lg text-gray-900">
                NepaliPool
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item, i) => (
              <MotionLink
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: i * 0.5 }}
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors",
                  pathname === item.href ? "text-emerald-400" : ""
                )}
              >
                {item.name}
              </MotionLink>
            ))}
          </nav>

          {/* Login Button / User Menu */}
          <div className="hidden md:block">
            {isPending ? (
              <Spinner className="size-6 text-green-500" />
            ) : !session ? (
              <MotionLink
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                href="/login"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Login
              </MotionLink>
            ) : (
              <div className="flex items-center gap-3">
                {!isDashboardRoute && (
                  <MotionLink
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    href="/dashboard"
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors"
                  >
                    Dashboard
                  </MotionLink>
                )}
                {!isChatRoute && (
                  <MotionLink
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    href="/chats"
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Chats
                  </MotionLink>
                )}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:from-emerald-500 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 overflow-hidden"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        fill
                        alt={session.user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Account
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <SignOutButton>
                          <div className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </div>
                        </SignOutButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md z-50 relative"
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
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          {/* <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          /> */}

          {/* Mobile Menu Panel */}
          <div className="fixed top-[73px] left-0 right-0 bg-white  md:hidden overflow-y-auto z-70">
            <div className="flex flex-col gap-2 p-6">
              {["Home", "Schools", "Mentors", "Guides"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}

              <div className="border-t border-gray-200 my-2" />

              {isPending ? (
                <div className="px-4 py-3">
                  <Spinner className="size-6 text-green-500" />
                </div>
              ) : !session ? (
                <Link
                  href="/login"
                  className="px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-md text-center hover:bg-emerald-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  {!isDashboardRoute && (
                    <Link
                      href="/dashboard"
                      className="px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {!isChatRoute && (
                    <Link
                      href="/chats"
                      className="px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Chats
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md flex items-center gap-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Account
                  </Link>
                  <SignOutButton>
                    <div className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md flex items-center gap-2 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </div>
                  </SignOutButton>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
