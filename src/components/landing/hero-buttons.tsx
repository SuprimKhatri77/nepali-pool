"use client";

import Image from "next/image";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserSession } from "../../../server/lib/auth/helpers/get-current-user-session";

const HeroButtons = () => {
  // const { data: session, isPending } = authClient.useSession();

  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useQuery({
    queryKey: ["hero-cta"],
    queryFn: async () => getCurrentUserSession().then((res) => res),
  });

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) {
    return <div className="min-h-[52px] min-w-[200px] w-full sm:w-auto"></div>;
  }

  if (isPending) return <Spinner className="w-full mx-auto" />;

  if (!session || !session.session) {
    return (
      <>
        <Link
          href="/sign-up?role=student"
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl text-base sm:text-lg"
        >
          Start as a Student
        </Link>
        <Link
          href="/connect-student"
          className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl border-2 border-emerald-600 text-base sm:text-lg"
        >
          Find Friends
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/connect-student"
        className="w-full sm:w-auto px-8 py-4  text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border-2 border-emerald-400 shadow-lg hover:shadow-xl text-base sm:text-lg"
      >
        Find Friends
      </Link>

      <JoinCommunity />
    </>
  );
};

export default HeroButtons;

export const JoinCommunity = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [open, setOpen] = useState(false);

  const messengerLink =
    "https://m.me/ch/AbYIEGS3aMMTPi1b/?send_source=cm%3Acopy_invite_link";

  return (
    <div className={cn("h-10", className)} {...props}>
      {/* Trigger button */}
      <Button
        variant={"outline"}
        onClick={() => setOpen(!open)}
        className="w-full sm:w-auto px-8 py-4 h-16 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border-2 border-emerald-400 shadow-lg hover:shadow-xl text-base sm:text-lg"
      >
        Join Community
      </Button>

      {/* Dialog / Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Join NepaliPool Community</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 my-4">
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>
                <strong>Step 1:</strong> Messenger मा यो search गर्नु:{" "}
                <em>NepaliPool</em>
              </li>
              <li>
                <strong>Step 2:</strong> <em>Communities</em> भन्ने select गर्नु
              </li>
              <li>
                <strong>Step 3:</strong> Click गर्नु{" "}
                <em>NepaliPool Community</em> मा
              </li>
              <li>Join हुनुहुन्छ 🙌</li>
            </ul>

            <p>OR</p>

            {/* QR Code */}
            <Image
              src="/community_qr.jpg"
              alt="NepaliPool Messenger QR"
              width={192}
              height={192}
              className="rounded-md"
            />
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              onClick={() => window.open(messengerLink, "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Join Community
            </Button>

            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
