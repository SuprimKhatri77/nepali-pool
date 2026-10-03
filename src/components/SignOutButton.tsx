"use client";

import { useSignOut } from "@/hooks/use-sign-out";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function SignOutButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { signOut: handleLogout, isPending } = useSignOut();
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
