"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid,  XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a custom label"



const chartConfig = {
  mentors: {
    label: "Mentors",
    color: "var(--chart-2)",
  },
  students: {
    label: "Students",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function StudentBarChart({chartData}:{chartData: {date: string, mentors: number, students: number}[]}) {
  const monthlyData = summarizeByMonth(chartData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Students</CardTitle>
        <CardDescription className="flex gap-2">{monthlyData.map((m)=>(
          <p key={m.month}>{m.month}</p>
        ))} 2025</CardDescription>
      </CardHeader>
      <CardContent>
       <ChartContainer config={chartConfig} className="max-h-[600px] h-full">
  <BarChart
    accessibilityLayer
    data={monthlyData}
    barCategoryGap="6px" // space between bars
    barGap={4}
  >
    <CartesianGrid vertical={true} />

    {/* X-axis now shows months */}
    <YAxis
      dataKey="students"
      tickLine={false}
      axisLine={false}
      tickMargin={10}
      tickFormatter={(value) => value}
    />

    {/* Y-axis shows the mentor count */}
    <XAxis
      dataKey="month"
      tickLine={false}
      axisLine={false}
    />

    <ChartTooltip
      cursor={{ fill: "rgba(0,0,0,0.1)" }}
      content={<ChartTooltipContent indicator="line" />}
    />

    <Bar
      dataKey="students"
      fill="var(--chart-3)"
      radius={[4, 4, 0, 0]} // rounded top
      barSize={30}
    >
     
    </Bar>
  </BarChart>
</ChartContainer>

      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Data of last  {monthlyData.length} months!  <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total students 
        </div>
      </CardFooter>
    </Card>
  )
}



type MonthlySummary = {
  month: string;
  mentors: number;
  students: number;
};

export function summarizeByMonth(data: {date: string, mentors: number, students: number}[]): MonthlySummary[] {
  const monthMap: Record<string, { mentors: number; students: number }> = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const monthName = date.toLocaleString("default", { month: "long" });

    if (!monthMap[monthName]) {
      monthMap[monthName] = { mentors: 0, students: 0 };
    }

    monthMap[monthName].mentors += item.mentors;
    monthMap[monthName].students += item.students;
  });

  return Object.entries(monthMap).map(([month, counts]) => ({
    month,
    mentors: counts.mentors,
    students: counts.students,
  }));
}
