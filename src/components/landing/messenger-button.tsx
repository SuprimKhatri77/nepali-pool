"use client";

import { IconBrandMessengerFilled } from "@tabler/icons-react";
import Link from "next/link";
import WhatsappButton from "./WhatsAppBtn";

export function MessengerIcon() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link
        href="/connect-student"
        className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out active:scale-95 animate-pulse"
        aria-label="Join our Messenger group"
      >
        <IconBrandMessengerFilled className="text-blue-700"/>
      </Link>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }
      `}</style>
    </div>
  );
}
