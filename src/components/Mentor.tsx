"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUserFromDB } from "../../server/actions/delete-user/deleteUserFromDB";
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

  const deleteUser = async () => {
    await deleteUserFromDB();
  };
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
      Sup mentor!
      <Button onClick={handleClick} disabled={click}>
        Logout
      </Button>
      <Button onClick={deleteUser} disabled={click}>
        Delete User
      </Button>
      <Link href="/video-call">
        <Button className="cursor-pointer">Video Call List</Button>
      </Link>
    </div>
  );
}
