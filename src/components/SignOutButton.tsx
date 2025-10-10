"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useState } from "react";

export default function SignOutButton() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    setIsPending(false);
  };
  return (
    <Button
      variant="default"
      className="w-fit"
      disabled={isPending}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
