"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const excludeNavRoutes = ["/login", "/sign-up", "/admin", "/verify-email"];
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isExcludedNavRoute = excludeNavRoutes.includes(pathname);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isExcludedNavRoute && <Header />}

        {children}

        {!pathname.startsWith("/chats") &&
          !pathname.startsWith("/login") &&
          !pathname.startsWith("/sign-up") &&
          !pathname.startsWith("/verify-email") && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
