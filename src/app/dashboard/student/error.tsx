"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ErrorPage({ error }: { error: Error }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const handleClick = () => {
    setIsPending(true);

    setTimeout(() => {
      router.refresh();

      setIsPending(false);
    }, 5000);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-full gap-7">
      <h1>Hiiii</h1>
      <div className="flex flex-col gap-2">
        <h1>Error Message: {error.message}</h1>
        <h1>Error Name: {error.name}</h1>
      </div>
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? <Spinner /> : "Try again"}
      </Button>
    </div>
  );
}
