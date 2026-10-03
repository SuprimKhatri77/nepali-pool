import MentorOnboardingForm from "@/components/OnboardingMentorForm";
import { redirect } from "next/navigation";
import { requireViewer } from "../../../../server/lib/auth/guards";
import { homeFor } from "../../../../server/lib/auth/viewer";

export default async function OnboardingMentor() {
  const viewer = await requireViewer(["needs-onboarding"]);
  if (viewer.role !== "mentor") redirect(homeFor(viewer));

  return <MentorOnboardingForm currentUserId={viewer.user.id} />;
}
