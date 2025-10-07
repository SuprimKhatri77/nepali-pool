"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { label: "Calls", requests: 50, accepted: 35, declined: 10 },
];

const chartConfig = {
  requests: {
    label: "Total Requests",
    color: "#f87171", // red
  },
  accepted: {
    label: "Accepted Calls",
    color: "#4ade80", // green
  },
  declined: {
    label: "Declined Calls",
    color: "red",
  },
} satisfies ChartConfig;

export function DashboardMentorChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis dataKey="label" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="requests" fill="var(--color-requests)" radius={6} />
        <Bar dataKey="accepted" fill="var(--color-accepted)" radius={6} />
        <Bar dataKey="declined" fill="var(--color-declined)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
