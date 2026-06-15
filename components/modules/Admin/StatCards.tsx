"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Store,
  Star,
  Tag,
  DollarSign,
  Truck,
} from "lucide-react";
import { IAdminDashboardData } from "@/types/dashboard.types";

interface StatCardsProps {
  stats: IAdminDashboardData;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.users.total,
      icon: Users,
      description: `${stats.users.customers} customers · ${stats.users.providers} providers`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.orders.total,
      icon: ShoppingBag,
      description: `Avg. $${stats.orders.averageOrderValue} per order`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.orders.totalRevenue}`,
      icon: DollarSign,
      description: `$${stats.orders.totalDeliveryFees} delivery fees`,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Total Meals",
      value: stats.meals.total,
      icon: UtensilsCrossed,
      description: `$${stats.meals.averagePrice} avg. price`,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "Providers",
      value: stats.providers.total,
      icon: Store,
      description: "Active restaurants",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Reviews",
      value: stats.reviews.total,
      icon: Star,
      description: `${stats.reviews.averageRating} avg. rating`,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Categories",
      value: stats.categories.total,
      icon: Tag,
      description: "Meal categories",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Delivery Fees",
      value: `$${stats.orders.totalDeliveryFees}`,
      icon: Truck,
      description: "Total collected",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div
                className={`rounded-xl p-2.5 ${stat.bg} transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
          <div
            className={`absolute bottom-0 left-0 h-1 w-full ${stat.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          />
        </Card>
      ))}
    </div>
  );
}
