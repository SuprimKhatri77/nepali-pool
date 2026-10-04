import { cookies } from "next/headers";
import { AdminDashboardShell } from "@/components/dashboard/admin/admin-dashboard-shell";
import { requireAdmin } from "../../../server/lib/auth/guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every admin page also calls requireAdmin() itself: a layout is not
  // re-run on client navigation between its pages, so it can't be the only
  // check. The viewer is cached per request, so this costs nothing extra.
  const admin = await requireAdmin();
  // Written by the sidebar when it's toggled; keeps the first render in sync.
  const sidebarState = (await cookies()).get("sidebar_state")?.value;

  return (
    <AdminDashboardShell
      user={{ name: admin.name, email: admin.email, image: admin.image }}
      defaultOpen={sidebarState !== "false"}
    >
      {children}
    </AdminDashboardShell>
  );
}
