import GuidesView from "@/modules/guides/ui/guides-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Study Abroad Guides | Application, Admission & Visa Process | NepaliPool",
  description:
    "Complete guides for Nepali students planning to study abroad. Learn about application timelines, admission processes, visa requirements, and get step-by-step guidance from those who've done it.",
  icons: {
    icon: [
      {
        url: "https://nepalipool.com/logoBgWhite.jpg",
        href: "https://nepalipool.com/logoBgWhite.jpg",
      },
    ],
  },
  openGraph: {
    title: "Study Abroad Guides | Application, Admission & Visa | NepaliPool",
    description:
      "Everything you need to know about studying abroad. From application timelines to visa processes, get comprehensive guides created by Nepali students and mentors abroad.",
    url: "https://nepalipool.com/guides",
    siteName: "NepaliPool",
    images: [
      {
        url: "https://nepalipool.com/guides-preview.png",
        width: 1200,
        height: 630,
        alt: "Study Abroad Guides - NepaliPool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Abroad Guides | Application, Admission & Visa | NepaliPool",
    description:
      "Everything you need to know about studying abroad. From application timelines to visa processes, get comprehensive guides from those who've done it.",
    images: ["https://nepalipool.com/guides-preview.png"],
  },
};
const page = () => {
  return <GuidesView />;
};

export default page;
