import { cookies } from "next/headers";
import { StudentDashboardShell } from "@/components/dashboard/student/student-dashboard-shell";
import { requireStudent } from "../../../../server/lib/auth/guards";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every student page also calls requireStudent() itself: a layout is not
  // re-run on client navigation between its pages, so it can't be the only
  // check. The viewer is cached per request, so this costs nothing.
  const { userRecord } = await requireStudent();
  // Written by the sidebar when it's toggled; keeps the first render in sync.
  const sidebarState = (await cookies()).get("sidebar_state")?.value;

  return (
    <StudentDashboardShell
      user={{
        name: userRecord.name,
        email: userRecord.email,
        image: userRecord.image,
      }}
      defaultOpen={sidebarState !== "false"}
    >
      {children}
    </StudentDashboardShell>
  );
}
