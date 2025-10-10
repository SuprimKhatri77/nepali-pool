import ResetPassword from "@/components/ResetPassword";
import { db } from "../../../../../../lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    console.log("No token provided in URL");
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-5">
        <p className="text-red-500">Missing token,Token is required</p>
      </div>
    );
  }

  const resetRecord = await db.query.verification.findFirst({
    where: (fields, { eq, and }) =>
      eq(fields.identifier, `reset-password:${token}`),
  });

  if (!resetRecord) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-5">
        <p className="text-red-500">Invalid token, please request a new one.</p>
        <Button asChild>
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  const dbToken = resetRecord.identifier.split(":")[1];

  if (token !== dbToken) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-5">
        <p className="text-red-500">Invalid token, please request a new one.</p>
        <Button asChild>
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  const isExpired = new Date() > resetRecord.expiresAt;

  if (isExpired) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-5">
        <p className="text-red-500">This reset link has expired.</p>
        <Button asChild>
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  return <ResetPassword token={token} />;
}
