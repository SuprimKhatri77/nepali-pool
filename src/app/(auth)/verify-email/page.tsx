import { redirect } from "next/navigation";
import VerifyEmail from "@/components/VerifyEmail";
import { getViewer, homeFor } from "../../../../server/lib/auth/viewer";

export default async function VerifyEmailPage() {
  const viewer = await getViewer();
  if (viewer.status === "anonymous") {
    redirect("/login?message=Please+login+to+continue");
  }
  if (viewer.status !== "unverified") redirect(homeFor(viewer));

  return <VerifyEmail email={viewer.user.email} />;
}
