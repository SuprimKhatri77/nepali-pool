import { db } from "../../../lib/db";
import { school } from "../../../lib/db/schema";
import { count } from "drizzle-orm";
import { getAllSchools } from "../../../server/lib/dal/get-all-schools";
import { Schools } from "@/modules/schools/schools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NepaliPool | Connect with Mentors Abroad",
  description:
    "NepaliPool helps Nepali students connect with verified mentors already living abroad. Get honest guidance, chat freely, and schedule video calls for real insights before applying abroad.",
  icons: {
    icon: [
      {
        url: "/logoBgWhite.jpg",
        href: "/logoBgWhite.jpg",
      },
    ],
  },
  openGraph: {
    title: "NepaliPool | Connect with Mentors Abroad",
    description:
      "Guidance you can trust. NepaliPool connects students with Nepali mentors already abroad — chat, video call, and learn the reality before you go.",
    url: "https://nepalipool.com/",
    siteName: "NepaliPool",
    images: [
      {
        url: "/homepage-preview.png",
        width: 1200,
        height: 630,
        alt: "NepaliPool – Connect with Mentors Abroad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NepaliPool | Connect with Mentors Abroad",

    description:
      "Guidance you can trust. NepaliPool connects students with Nepali mentors already abroad — chat, video call, and learn the reality before you go.",
    images: ["/homepage-preview.png"],
  },
};
export default async function AllSchools({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const page =
    Number((await searchParams).page) > 0
      ? Number((await searchParams).page)
      : 1;
  const limit = 12;
  const [totalResult] = await db.select({ count: count() }).from(school);

  const total = Number(totalResult.count);
  const totalPages = Math.ceil(total / limit);

  const offset = (page - 1) * limit;
  const allSchools = await getAllSchools(limit, offset);
  return (
    <Schools
      allSchools={allSchools.schools}
      total={total}
      page={page}
      offset={offset}
      totalPages={totalPages}
      limit={limit}
    />
  );
}
