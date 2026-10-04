import { AdminVideoCallsTable } from "@/components/dashboard/admin/admin-video-calls-table";
import { requireAdmin } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Video call requests | NepaliPool admin",
};

export default async function AdminVideoCallsPage() {
  await requireAdmin();

  return <AdminVideoCallsTable />;
}
