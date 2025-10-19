
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "NepaliPool | Connect with Mentors Abroad",
  description:
    "NepaliPool helps Nepali students connect with verified mentors already living abroad. Get honest guidance, chat freely, and schedule video calls for real insights before applying abroad.",
  openGraph: {
    title: "NepaliPool | Connect with Mentors Abroad",
    description:
      "Guidance you can trust. NepaliPool connects students with Nepali mentors already abroad — chat, video call, and learn the reality before you go.",
    url: "https://nepalipool.vercel.app/",
    siteName: "NepaliPool",
    images: [
      {
        url: "https://nepalipool.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "NepaliPool – Connect with Mentors Abroad",
      },
    ],
    locale: "en_US",
    type: "website",
    // Add Facebook App ID here
    additionalMetaTags: [
      {
        property: "fb:app_id",
        content: "4071033779812681",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NepaliPool | Connect with Mentors Abroad",
    description:
      "Guidance from Nepalis already abroad. Chat, call, and prepare smartly for your study journey.",
    images: ["https://nepalipool.vercel.app/logo.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
       <Head>
        {/* Required for Facebook */}
        <meta property="fb:app_id" content="4071033779812681" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
