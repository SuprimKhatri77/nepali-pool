import DashboardCard from "@/components/orginal-components/MENTOR/Dashboard/DashboardCard";
import { DashboardMentorChart } from "@/components/orginal-components/MENTOR/Dashboard/DashboardChart";
import { DashboardMentorTable } from "@/components/orginal-components/MENTOR/Dashboard/DashboardTable";
import React from "react";

export default function DashboardMentor() {
  return (
    <section className="px-4">
      <div className="grid grid-cols-4 gap-4 my-4 ">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>
      <div className="flex gap-4">
        <DashboardMentorTable />
        <DashboardMentorChart />
      </div>
    </section>
  );
}
