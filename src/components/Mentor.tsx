"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function MentorPage() {
  const [click, setClick] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setClick(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    setClick(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md shadow-lg border-emerald-100">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mentor Dashboard
              </h1>
              <p className="text-gray-600">Welcome back!</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/chats" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  View Chats
                </Button>
              </Link>

              <Link href="/video-call" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Video Call List
                </Button>
              </Link>

              <Button
                onClick={handleClick}
                disabled={click}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                {click ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
