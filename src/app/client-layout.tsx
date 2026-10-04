"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

// Matches a route and everything under it ("/admin" and "/admin/x", but not
// "/administer" or "/mentors/admin").
function isUnder(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

// Pages with their own chrome (auth screens, admin, the mentor/student
// dashboards and chats, each with a sidebar) don't get the site header.
const NO_HEADER = [
  "/login",
  "/sign-up",
  "/verify-email",
  "/admin",
  "/dashboard",
  "/chats",
] as const;

const NO_FOOTER = NO_HEADER;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {!isUnder(pathname, NO_HEADER) && <Header />}
      {children}
      {!isUnder(pathname, NO_FOOTER) && <Footer />}
    </>
  );
}
