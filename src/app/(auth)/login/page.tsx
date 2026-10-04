import { redirectIfSignedIn } from "../../../../server/lib/auth/guards";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/landing/resuable/BackButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | NepaliPool",
  description:
    "Login to NepaliPool to connect with mentors and get guidance for studying abroad.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      {
        url: "/logoBgWhite.jpg",
        href: "/logoBgWhite.jpg",
      },
    ],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  await redirectIfSignedIn((await searchParams).next);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between gap-2 md:justify-between md:items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200">
              <Image
                src={"/logoTransparent.png"}
                alt="NepaliPool Transparent Logo"
                width={150}
                height={70}
              />
            </div>
            <span className="font-semibold text-lg sm:text-xl text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
              NepaliPool
            </span>
          </Link>
          <BackButton />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px] mx-auto">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex  items-center justify-center">
        <div className="  rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all duration-200">
          <Image
            src={"/logoTransparent.png"}
            alt="NepaliPool Transparent Logo"
            width={150}
            height={70}
          />
        </div>
      </div>
    </div>
  );
}
