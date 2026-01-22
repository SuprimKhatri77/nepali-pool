"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function StudentErrorState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-lg shadow-md border border-red-200">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something Went Wrong
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We encountered an error while loading student profiles. Please try again
        or contact support if the problem persists.
      </p>
      <button
        onClick={() => {
          router.refresh();
        }}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  );
}
