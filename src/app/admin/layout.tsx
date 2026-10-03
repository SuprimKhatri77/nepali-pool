import { AdminHeader } from "@/components/admin/AdminHeader";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAdmin } from "../../../server/lib/auth/guards";

export default async function AdminLayout({children}:{children: React.ReactNode}) {
  // Every admin page also calls requireAdmin() itself: a layout is not
  // re-run on client navigation between its pages, so it can't be the only
  // check. The viewer is cached per request, so this costs nothing extra.
  await requireAdmin();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AdminHeader />
          {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
