import { redirect } from "next/navigation";
import { requireUser } from "../../../server/lib/auth/guards";
import { homeFor } from "../../../server/lib/auth/viewer";

export default async function Onboarding() {
  const viewer = await requireUser();
  redirect(homeFor(viewer));
}
