import { requireViewer } from "../../../server/lib/auth/guards";
import AddSchool from "@/components/AddSchool";

export default async function Page() {
  const viewer = await requireViewer(["mentor", "admin"]);
  return <AddSchool currentUserId={viewer.user.id} />;
}
