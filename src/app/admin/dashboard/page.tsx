import { AdminOverview } from "@/components/dashboard/admin/admin-overview";
import { requireAdmin } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Admin | NepaliPool",
};

// Counts and the sign-up chart load on the client (AdminOverview).
export default async function AdminDashboardPage() {
  await requireAdmin();

  return <AdminOverview />;
}
