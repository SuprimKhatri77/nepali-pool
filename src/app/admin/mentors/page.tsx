import { AdminMentorsTable } from "@/components/dashboard/admin/admin-mentors-table";
import { requireAdmin } from "../../../../server/lib/auth/guards";

export const metadata = {
  title: "Mentors | NepaliPool admin",
};

// Filter, search and page live in the URL; rows load on the client.
export default async function AdminMentorsPage() {
  await requireAdmin();

  return <AdminMentorsTable variant="directory" />;
}
