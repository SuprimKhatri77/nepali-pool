import { cookies } from "next/headers";
import { MentorDashboardShell } from "@/components/dashboard/mentor/mentor-dashboard-shell";
import { requireApprovedMentor } from "../../../../server/lib/auth/guards";

export default async function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every mentor page also calls requireApprovedMentor() itself: a layout is
  // not re-run on client navigation between its pages, so it can't be the
  // only check. The viewer is cached per request, so this costs nothing.
  const { userRecord } = await requireApprovedMentor();
  // Written by the sidebar when it's toggled; keeps the first render in sync.
  const sidebarState = (await cookies()).get("sidebar_state")?.value;

  return (
    <MentorDashboardShell
      user={{
        name: userRecord.name,
        email: userRecord.email,
        image: userRecord.image,
      }}
      mentorId={userRecord.id}
      defaultOpen={sidebarState !== "false"}
    >
      {children}
    </MentorDashboardShell>
  );
}
