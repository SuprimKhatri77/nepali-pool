import StudentOnboardingForm from "@/components/StudentOnboardingForm";
import { redirect } from "next/navigation";
import { requireViewer } from "../../../../server/lib/auth/guards";
import { homeFor } from "../../../../server/lib/auth/viewer";

export default async function Page() {
  const viewer = await requireViewer(["needs-onboarding"]);
  if (viewer.role !== "student") redirect(homeFor(viewer));

  return <StudentOnboardingForm currentUserId={viewer.user.id} />;
}
