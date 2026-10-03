import { redirect } from "next/navigation";
import { requireAdmin } from "../../../server/lib/auth/guards";

export default async function Page() {
  await requireAdmin();
  redirect("/admin/dashboard");
}
