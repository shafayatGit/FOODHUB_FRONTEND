"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IAdminDashboardData } from "@/types/dashboard.types";

interface MealsChartProps {
  stats: IAdminDashboardData;
}

const buildData = (stats: IAdminDashboardData) => [
  { status: "Available", count: stats.meals.available, fill: "var(--color-available)" },
  { status: "Unavailable", count: stats.meals.unavailable, fill: "var(--color-unavailable)" },
];

const chartConfig = {
  count: {
    label: "Meals",
  },
  available: {
    label: "Available",
    color: "hsl(160, 60%, 45%)",
  },
  unavailable: {
    label: "Unavailable",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig;

export function MealsChart({ stats }: MealsChartProps) {
  const chartData = buildData(stats);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Meal Availability</CardTitle>
        <CardDescription>
          {stats.meals.total} total · ${stats.meals.averagePrice} avg price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video max-h-[280px] w-full">
          <BarChart data={chartData} barSize={48}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13 }}
            />
            <YAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
