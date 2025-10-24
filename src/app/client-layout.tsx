"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";

const excludeNavRoutes = ["/login", "/sign-up", "/admin", "/verify-email","/admin/dashboard"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
    // Check if any keyword is present in the pathname
  const isExcludedNavRoute = excludeNavRoutes.some(route => pathname.includes(route));

  return (
    <>
      {!isExcludedNavRoute && <Header />}
      {children}
      {!pathname.startsWith("/chats") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/sign-up") &&
        !pathname.startsWith("/verify-email") && 
        !pathname.startsWith("/admin")
        && <Footer />}
      <Toaster />
    </>
  );
}
