"use client";

import Link from "next/link";
import { Clock3, ShoppingBag, ShoppingCart, Store, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/modules/Cart/CartProvider";
import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import type { UserInfo } from "@/types/user.types";

interface CustomerDashboardContentProps {
  userInfo: UserInfo | null;
}

export default function CustomerDashboardContent({
  userInfo,
}: CustomerDashboardContentProps) {
  const { items, totals } = useCart();
  const displayName = userInfo?.name ?? "Customer";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6">
          <p className="text-sm font-medium text-primary">Customer dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Welcome back, {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse meals, manage your cart, and continue checkout from one place.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/meals">
                <UtensilsCrossed className="size-4" />
                Browse meals
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cart">
                <ShoppingCart className="size-4" />
                View cart
              </Link>
            </Button>
          </div>
        </section>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{displayName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="break-all font-medium">{userInfo?.email ?? "Not available"}</p>
            </div>
            <Badge variant="secondary">{userInfo?.role ?? "CUSTOMER"}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cart items</p>
              <p className="text-2xl font-semibold">{totals.itemCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Store className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Providers in cart</p>
              <p className="text-2xl font-semibold">
                {new Set(items.map((item) => item.providerId)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cart total</p>
              <p className="text-2xl font-semibold">{formatCurrency(totals.total)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Current Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.slice(0, 4).map((item) => (
                  <div key={item.mealId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                <Separator />
                <Button asChild className="w-full">
                  <Link href="/cart">Review cart</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-3xl bg-muted/50 p-8 text-center text-sm text-muted-foreground">
                Your cart is empty. Add a meal to start an order.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl bg-muted/60 p-3">
              Pick meals from available providers.
            </div>
            <div className="rounded-2xl bg-muted/60 p-3">
              Confirm quantities in your cart.
            </div>
            <div className="rounded-2xl bg-muted/60 p-3">
              Checkout with your delivery address.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
