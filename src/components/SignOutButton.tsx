"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export default function SignOutButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);
    // console.log("clicked on logout");
    // console.log(
    //   `prod url :  ${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth`
    // );

    // console.log("trying to logout");
    await authClient.signOut({
      fetchOptions: {
        baseURL:
          process.env.NODE_ENV === "production"
            ? `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth`
            : "http://localhost:3000/api/auth",
        onSuccess: () => {
          router.push("/");
        },
      },
    });

    setIsPending(false);
  };
  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={handleLogout}
      className={` px-4  py-2 w-full text-sm font-medium text-gray-700 hover:text-gray-800 ${isPending && "border-none hover:bg-transparent shadow-none hover:shadow-none "}`}
    >
      {isPending ? <Spinner /> : children ? children : "Logout"}
    </Button>
  );
}
