import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "./client-layout";
import { Suspense } from "react";

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
  <meta property="og:image" content="https://nepalipool.com/homepage-preview.png" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:alt" content="Your Website Logo" />

  {/* { Twitter } */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://nepalipool.com/homepage-preview.png" />
  <meta name="twitter:image:alt" content="Our Website Logo" />
</head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
