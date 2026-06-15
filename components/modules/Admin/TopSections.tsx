"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Store, TrendingUp, Star } from "lucide-react";
import { ITopMeal, ITopProvider } from "@/types/dashboard.types";

interface TopMealsTableProps {
  topMeals: ITopMeal[];
}

interface TopProvidersTableProps {
  topProviders: ITopProvider[];
}

export function TopMealsTable({ topMeals }: TopMealsTableProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-rose-50 p-1.5">
            <UtensilsCrossed className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Top Meals</CardTitle>
            <CardDescription>Best performing menu items</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Reviews</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topMeals.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell className="font-medium">{meal.title}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    ${meal.price.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{meal.reviewCount}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function TopProvidersTable({ topProviders }: TopProvidersTableProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-50 p-1.5">
            <Store className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Top Providers</CardTitle>
            <CardDescription>Restaurants by order volume</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant</TableHead>
              <TableHead className="text-right">Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProviders.map((provider, i) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    {provider.restaurantName}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className={provider.orderCount > 0 ? "font-semibold text-emerald-600" : "text-muted-foreground"}>
                      {provider.orderCount}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
