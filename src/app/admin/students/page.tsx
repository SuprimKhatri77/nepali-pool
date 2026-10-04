import { AdminStudentsTable } from "@/components/dashboard/admin/admin-students-table";
import { requireAdmin } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Students | NepaliPool admin",
};

export default async function AdminStudentsPage() {
  await requireAdmin();

  return <AdminStudentsTable />;
}
