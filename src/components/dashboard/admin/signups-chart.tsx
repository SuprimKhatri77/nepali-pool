"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { SignupDay } from "../../../../server/actions/admin-dashboard/overview";

const chartConfig = {
  students: { label: "Students", color: "#059669" },
  mentors: { label: "Mentors", color: "#0284c7" },
} satisfies ChartConfig;

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const;

// Days are UTC buckets ("YYYY-MM-DD"), so format them in UTC too; local time
// would shift them a day for anyone west of Greenwich.
function formatDay(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function SignupsChart({ signups }: { signups: SignupDay[] }) {
  const [days, setDays] = useState<number>(30);
  const data = signups.slice(-days);
  const totals = data.reduce(
    (sum, day) => ({
      students: sum.students + day.students,
      mentors: sum.mentors + day.mentors,
    }),
    { students: 0, mentors: 0 },
  );

  return (
    <Card className="gap-4 border-slate-200">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Sign-ups</CardTitle>
          <CardDescription>
            {totals.students} students and {totals.mentors} mentors in the last{" "}
            {days} days (UTC)
          </CardDescription>
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={String(days)}
          // Ignore the deselect that clicking the active item would cause.
          onValueChange={(value) => value && setDays(Number(value))}
          aria-label="Date range"
        >
          {RANGES.map((range) => (
            <ToggleGroupItem
              key={range.days}
              value={String(range.days)}
              className="px-3"
            >
              {range.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <BarChart data={data} margin={{ left: -16, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatDay}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDay(String(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="students"
              stackId="signups"
              fill="var(--color-students)"
            />
            <Bar
              dataKey="mentors"
              stackId="signups"
              fill="var(--color-mentors)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
