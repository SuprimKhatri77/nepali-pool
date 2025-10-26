"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useToastQuery(paramName: string = "toast") {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get(paramName);

    if (message) {
      toast.message(decodeURIComponent(message), {
        position: "top-right",
        action: {
          label: "X" ,
          onClick: () => toast.dismiss()
        },
        duration: 3000,
      });

      // Remove ?toast=... from URL to prevent repetition
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [paramName, router, searchParams]);
}
