"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowLeft, Clock3, MapPin, ReceiptText, Store, Utensils, X } from "lucide-react";

import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import { formatOrderDate, OrderStatusBadge } from "@/components/modules/Orders/order-ui";
import ReviewForm from "@/components/modules/Orders/ReviewForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cancelOrder } from "@/services/orders.services";
import type { CustomerOrder } from "@/types/order.types";

interface OrderDetailsProps {
  order: CustomerOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const mealTitle = order.meal?.title ?? "Meal item";
  const providerName = order.provider?.restaurantName ?? "Provider";
  const total = order.totalAmount + order.deliveryFee;
  const [isPending, startTransition] = useTransition();
  const canCancel = order.status === "PLACED";
  const canReview = order.status === "DELIVERED";

  const handleCancelOrder = () => {
    startTransition(async () => {
      const result = await cancelOrder(order.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/orders">
            <ArrowLeft className="size-4" />
            Back to orders
          </Link>
        </Button>

        <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Order details</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal">
                {mealTitle}
              </h1>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {order.id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <OrderStatusBadge status={order.status} />
              {canCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  <X className="size-4" />
                  {isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {canReview && (
          <div className="mx-auto max-w-2xl">
            <ReviewForm mealId={order.mealId} orderId={order.id} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Delivery & Meal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
                <MapPin className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Delivery address</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.deliveryAddress || "Address unavailable"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
                <Store className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{providerName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Provider ID: {order.providerId}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
                <Utensils className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{mealTitle}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quantity: {order.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
                <Clock3 className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Placed</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptText className="size-5 text-primary" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meal total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
              <div className="rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground">
                Payment method: Cash on delivery
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
