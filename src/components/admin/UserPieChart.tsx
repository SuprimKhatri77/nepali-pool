"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersByMonth } from "@/app/admin/dashboard/page";

export const description = "An interactive pie chart";


const chartConfig = {
  january: {
    label: "January",
    color: "var(--color-january)",
  },
  february: {
    label: "February",
    color: "var(--color-february)",
  },
  march: {
    label: "March",
    color: "var(--color-march)",
  },
  april: {
    label: "April",
    color: "var(--color-april)",
  },
  may: {
    label: "May",
    color: "var(--color-may)",
  },
  june: {
    label: "June",
    color: "var(--color-june)",
  },
  july: {
    label: "July",
    color: "var(--color-july)",
  },
  august: {
    label: "August",
    color: "var(--color-august)",
  },
  september: {
    label: "September",
    color: "var(--color-september)",
  },
  october: {
    label: "October",
    color: "var(--color-october)",
  },
  november: {
    label: "November",
    color: "var(--color-november)",
  },
  december: {
    label: "December",
    color: "var(--color-december)",
  },
} satisfies Record<string, { label: string; color: string }>;





export function ChartPieUsers({ users }: { users: UsersByMonth[] }) {
  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = React.useState(users[0].month);

  const activeIndex = React.useMemo(
    () => users.findIndex((item) => item.month === activeMonth),
    [activeMonth, users]
  );

  const months = React.useMemo(() => users.map((item) => item.month), [users]);

 

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Monthly user signup stats</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key,i) => {
              const color = `var(--chart-${i})`;
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: color }}
                    />
                    {key}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
           <Pie
  data={users}
  dataKey="users"
  nameKey="month"
  innerRadius={60}
  strokeWidth={5}
  activeIndex={activeIndex}
  activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
    <g>
      <Sector {...props} outerRadius={outerRadius + 10} />
      <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
    </g>
  )}
>
  {users.map((entry) => (

      <Cell key={entry.month} fill={entry.fill} />
    ) 
)}

  <Label
    content={({ viewBox }) => {
      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
        return (
          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
              {users[activeIndex].users.toLocaleString()}
            </tspan>
            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
              Users
            </tspan>
          </text>
        );
      }
    }}
  />
</Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
