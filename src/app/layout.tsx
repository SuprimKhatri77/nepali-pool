import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "./client-layout";
import { Suspense } from "react";
import TRQProvider from "@/components/providers/query-client-provider";
import Script from "next/script";

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
      <head>
        {/* { Facebook } */}
        <meta property="fb:app_id" content="4071033779812681" />

        {/* { Open Graph } */}
        <meta
          property="og:image"
          content="https://nepalipool.com/homepage-preview.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Our Website Home Page" />

        {/* { Twitter } */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://nepalipool.com/homepage-preview.png"
        />
        <meta name="twitter:image:alt" content="Our Website Home Page" />


{/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PBRH8MBVNW"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PBRH8MBVNW');
        `}
      </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <TRQProvider>
          <Suspense fallback={<p>Loading...</p>}>
            <ClientLayout>{children}</ClientLayout>
          </Suspense>
          <Toaster />
        </TRQProvider>
      </body>
    </html>
  );
}
