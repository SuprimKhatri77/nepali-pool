import { redirect } from "next/navigation";
import { getViewer, homeFor } from "../../../server/lib/auth/viewer";

// /dashboard just forwards everyone to the place they belong.
export default async function Dashboard() {
  const viewer = await getViewer();
  if (viewer.status === "anonymous") {
    redirect("/login?message=Please+login+to+continue");
  }
  redirect(homeFor(viewer));
}
