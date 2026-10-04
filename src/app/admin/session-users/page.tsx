import { AdminSessionsTable } from "@/components/dashboard/admin/admin-sessions-table";
import { requireAdmin } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Meeting sessions | NepaliPool admin",
};

export default async function AdminSessionsPage() {
  await requireAdmin();

  return <AdminSessionsTable />;
}
