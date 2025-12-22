import HomePage from "@/components/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://nepalipool.com"),
  title: "NepaliPool | Connect with Mentors Abroad",
  description:
    "NepaliPool helps Nepali students connect with verified mentors already living abroad. Get honest guidance, chat freely, and schedule video calls for real insights before applying abroad.",
  icons: {
    icon: [
      {
        url: "https://nepalipool.com/logoBgWhite.jpg",
        href: "https://nepalipool.com/logoBgWhite.jpg",
      },
    ],
  },
  openGraph: {
    title: "NepaliPool | Connect with Mentors Abroad",
    description:
      "Guidance you can trust. NepaliPool connects students with Nepali mentors already abroad — chat, video call, and learn the reality before you go.",
    url: "https://nepalipool.com",
    siteName: "NepaliPool",
    images: [
      {
        url: "https://nepalipool.com/homepage-preview.png",
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
    images: ["https://nepalipool.com/homepage-preview.png"],
  },
};
export default function Home() {
  return <HomePage />;
}
