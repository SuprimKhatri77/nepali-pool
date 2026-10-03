"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "../../server/lib/auth/auth-client";

// Signs the user out and drops every cached query, so nothing the previous
// user loaded is shown to whoever uses the browser next.
export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const signOut = async () => {
    setIsPending(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            queryClient.clear();
            router.push("/");
            router.refresh();
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  return { signOut, isPending };
}
