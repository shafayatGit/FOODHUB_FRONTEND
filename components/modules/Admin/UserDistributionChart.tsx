"use client";

import { Cell, Pie, PieChart, Label } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IAdminDashboardData } from "@/types/dashboard.types";

interface UserDistributionChartProps {
  stats: IAdminDashboardData;
}

const buildData = (stats: IAdminDashboardData) => [
  { role: "customers", count: stats.users.customers, fill: "var(--color-customers)" },
  { role: "providers", count: stats.users.providers, fill: "var(--color-providers)" },
  { role: "admins", count: stats.users.admins, fill: "var(--color-admins)" },
];

const chartConfig = {
  count: {
    label: "Users",
  },
  customers: {
    label: "Customers",
    color: "hsl(217, 91%, 60%)",
  },
  providers: {
    label: "Providers",
    color: "hsl(160, 60%, 45%)",
  },
  admins: {
    label: "Admins",
    color: "hsl(30, 80%, 55%)",
  },
} satisfies ChartConfig;

export function UserDistributionChart({ stats }: UserDistributionChartProps) {
  const chartData = buildData(stats);
  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">User Distribution</CardTitle>
        <CardDescription>Breakdown by role</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="role"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              stroke="hsl(0, 0%, 100%)"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="role" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
