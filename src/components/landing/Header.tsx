"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import SignOutButton from "@/components/SignOutButton";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import AnnouncementBanner from "@/components/sessions/announcement-banner";
import { authClient } from "../../../server/lib/auth/auth-client";
import { cn } from "../lib/utils";

const MotionLink = motion(Link);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Schools", href: "/schools" },
  { name: "Mentors", href: "/mentors" },
  { name: "Scholarships", href: "/scholarships" },
  { name: "Guides", href: "/guides" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isChatRoute = pathname.startsWith("/chats");

  const { data: session, isPending } = authClient.useSession();

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
      {/* {!pathname.startsWith("/sessions") && !pathname.startsWith("/chats") && (
        <AnnouncementBanner isVisible={isVisible} setIsVisible={setIsVisible} />
      )} */}
      <motion.header
        className={cn(
          "bg-white/80 backdrop-blur-xl z-40 border-b border-gray-200/50 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 shadow-sm",
          !pathname.startsWith("/chats") && "sticky top-0"
        )}
        suppressHydrationWarning
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={"/logoTransparent.png"}
                alt="NepaliPool Transparent Logo"
                width={150}
                height={70}
              />
            </motion.div>
            <span className="font-semibold text-lg sm:text-xl text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
              NepaliPool
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <MotionLink
                key={item.name}
                href={item.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 overflow-hidden group",
                  pathname === item.href
                    ? "text-emerald-600 bg-emerald-50"
                    : "hover:text-emerald-600 hover:bg-emerald-50/50"
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-emerald-50 rounded-lg"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </MotionLink>
            ))}
          </nav>

          {/* Login Button / User Menu */}
          <div className="hidden lg:flex items-center justify-end w-[300px]">
            {isPending ? (
              <Spinner className="size-6 text-emerald-500" />
            ) : !session ? (
              <div className="flex gap-3">
                <MotionLink
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-lg hover:bg-emerald-50/50 transition-all duration-200"
                >
                  Login
                </MotionLink>
                <MotionLink
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/sign-up"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Register
                </MotionLink>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {!isDashboardRoute && (
                  <MotionLink
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href="/dashboard"
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-all duration-200"
                  >
                    Dashboard
                  </MotionLink>
                )}
                {!isChatRoute && (
                  <MotionLink
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href="/chats"
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-all duration-200"
                  >
                    Chats
                  </MotionLink>
                )}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 overflow-hidden"
                  >
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        fill
                        sizes="40px"
                        alt={session.user?.name || "User"}
                        className="object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 py-1 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session?.user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session?.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-150"
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
                            <div className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-150 flex items-center gap-2">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-emerald-50 rounded-lg z-50 relative transition-colors duration-200"
            aria-label="Toggle menu"
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
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex flex-col justify-around h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <span className="font-semibold text-lg text-gray-900">
                    Menu
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1 p-4">
                  {navLinks.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "linear",
                      }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                          pathname === item.href
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-600"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="h-px bg-gray-200 mx-4" />

                {/* Auth Section */}
                <div className="flex flex-col gap-2 p-4 mb-auto">
                  {isPending ? (
                    <div className="flex justify-center py-3">
                      <Spinner className="size-6 text-emerald-500" />
                    </div>
                  ) : !session ? (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-600 rounded-lg text-center transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/sign-up"
                        className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      {!isDashboardRoute && (
                        <Link
                          href="/dashboard"
                          className="px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-all duration-200 text-center"
                          onClick={() => setIsOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      {!isChatRoute && (
                        <Link
                          href="/chats"
                          className="px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-all duration-200 text-center"
                          onClick={() => setIsOpen(false)}
                        >
                          Chats
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg flex items-center gap-2 transition-all duration-200"
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
                        <div className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center gap-2 transition-all duration-200">
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
                    </>
                  )}
                </div>

                {/* Logo */}
                <Link
                  href="/"
                  className="flex flex-col items-center justify-center mb-2 gap-2 group"
                >
                  <motion.div
                    className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={"/logoTransparent.png"}
                      alt="NepaliPool Transparent Logo"
                      width={150}
                      height={70}
                    />
                  </motion.div>
                  <span className="text-sm font-bold ">
                    Your Dream, Our Success
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
