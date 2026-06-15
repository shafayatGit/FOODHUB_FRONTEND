import Link from "next/link";
import { ClipboardList, Eye, MapPin, ShoppingBag } from "lucide-react";

import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import { formatOrderDate, OrderStatusBadge } from "@/components/modules/Orders/order-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerOrder } from "@/types/order.types";

interface OrdersListProps {
  orders: CustomerOrder[];
}

function mealTitle(order: CustomerOrder) {
  return order.meal?.title ?? "Meal item";
}

function providerName(order: CustomerOrder) {
  return order.provider?.restaurantName ?? "Provider";
}

export default function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <section className="bg-muted/30">
        <div className="mx-auto grid min-h-[70svh] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
          <Card className="max-w-md border-0 text-center shadow-sm">
            <CardHeader>
              <div className="mx-auto mb-2 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardList className="size-6" />
              </div>
              <CardTitle>No orders yet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your placed orders will appear here after checkout.
              </p>
              <Button asChild>
                <Link href="/meals">Browse meals</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Order history</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-5xl">
              My Orders
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Track your placed, preparing, ready, and delivered orders.
            </p>
          </div>
          <div className="rounded-3xl bg-card px-4 py-3 text-sm shadow-sm ring-1 ring-foreground/5">
            <span className="font-semibold">{orders.length}</span>
            <span className="text-muted-foreground"> orders</span>
          </div>
        </div>

        <Card className="hidden border-0 shadow-sm md:flex">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{mealTitle(order)}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {order.id}
                      </div>
                    </TableCell>
                    <TableCell>{providerName(order)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalAmount + order.deliveryFee)}</TableCell>
                    <TableCell>{formatOrderDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="size-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:hidden">
          {orders.map((order) => (
            <Card key={order.id} className="border-0 shadow-sm">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{mealTitle(order)}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {order.id}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="size-4 text-primary" />
                    {formatCurrency(order.totalAmount + order.deliveryFee)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <span className="line-clamp-1">{order.deliveryAddress}</span>
                  </div>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/orders/${order.id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
