import { MentorSidebar } from "@/components/orginal-components/MENTOR/MentorSidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SettingsIcon, ToggleRightIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import DashboardMentor from "./dashboard";

export default function Page() {
  return (
    <SidebarProvider>
      <MentorSidebar />
      <SidebarInset>
        <header className="border-b-1  flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h4>Dashboard</h4>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <nav className="ml-auto pr-4">
            <ul className="flex gap-3">
              <ToggleRightIcon />
              <li>
                <SettingsIcon />
              </li>
              <Link href={"mentor/profile"}>
                <UserCircleIcon />
              </Link>
            </ul>
          </nav>
        </header>
        <DashboardMentor />
      </SidebarInset>
    </SidebarProvider>
  );
}
