import HomePage from "@/components/HomePage";
import { db } from "../../lib/db";
import { user } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../server/lib/auth/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "Nepali Pool",
};

export default async function Home() {
  return <HomePage />;
}
