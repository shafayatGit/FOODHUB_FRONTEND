"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IAdminDashboardData } from "@/types/dashboard.types";

interface RevenueChartProps {
  stats: IAdminDashboardData;
}

const buildData = (stats: IAdminDashboardData) => [
  { metric: "Revenue", value: stats.orders.totalRevenue, fill: "var(--color-revenue)" },
  { metric: "Delivery", value: stats.orders.totalDeliveryFees, fill: "var(--color-delivery)" },
  { metric: "Avg Order", value: stats.orders.averageOrderValue, fill: "var(--color-avg)" },
];

const chartConfig = {
  value: {
    label: "Amount",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(217, 91%, 60%)",
  },
  delivery: {
    label: "Delivery Fees",
    color: "hsl(160, 60%, 45%)",
  },
  avg: {
    label: "Avg Order Value",
    color: "hsl(30, 80%, 55%)",
  },
} satisfies ChartConfig;

export function RevenueChart({ stats }: RevenueChartProps) {
  const chartData = buildData(stats);
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Order & Revenue Overview</CardTitle>
        <CardDescription>Financial breakdown ($)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video max-h-[280px] w-full">
          <BarChart data={chartData} layout="vertical" barSize={24}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="metric"
              type="category"
              width={80}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
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
