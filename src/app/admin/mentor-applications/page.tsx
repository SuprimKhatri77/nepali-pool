import { AdminMentorsTable } from "@/components/dashboard/admin/admin-mentors-table";
import { requireAdmin } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Mentor applications | NepaliPool admin",
};

export default async function AdminMentorApplicationsPage() {
  await requireAdmin();

  return <AdminMentorsTable variant="applications" />;
}
