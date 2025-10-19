"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";

const excludeNavRoutes = ["/login", "/sign-up", "/admin", "/verify-email"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcludedNavRoute = excludeNavRoutes.includes(pathname);

  return (
    <>
      {!isExcludedNavRoute && <Header />}
      {children}
      {!pathname.startsWith("/chats") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/sign-up") &&
        !pathname.startsWith("/verify-email") && <Footer />}
      <Toaster />
    </>
  );
}
