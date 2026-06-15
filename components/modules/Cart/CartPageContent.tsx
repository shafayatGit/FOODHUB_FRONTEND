"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/modules/Cart/CartProvider";
import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import type { UserInfo } from "@/types/user.types";

interface CartPageContentProps {
  userInfo: UserInfo | null;
}

export default function CartPageContent({ userInfo }: CartPageContentProps) {
  const { clearCart, items, removeMeal, totals, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section className="bg-muted/30">
        <div className="mx-auto grid min-h-[70svh] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
          <Card className="max-w-md border-0 text-center shadow-sm">
            <CardHeader>
              <div className="mx-auto mb-2 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ShoppingBag className="size-6" />
              </div>
              <CardTitle>Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add meals from the menu and they will stay here while you browse.
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
            <p className="text-sm font-medium text-primary">Customer cart</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-5xl">
              Review Your Order
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Adjust quantities before checkout. Delivery fee is calculated for cash on delivery.
            </p>
          </div>
          <Button variant="outline" onClick={clearCart}>
            <Trash2 className="size-4" />
            Clear cart
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.mealId} className="border-0 shadow-sm">
                <CardContent className="grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.categoryName ? <Badge variant="secondary">{item.categoryName}</Badge> : null}
                      {item.dietaryPreference ? <Badge variant="outline">{item.dietaryPreference}</Badge> : null}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {item.providerName ? (
                      <p className="text-sm text-muted-foreground">By {item.providerName}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-lg font-semibold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label={`Decrease ${item.title}`}
                        onClick={() => updateQuantity(item.mealId, item.quantity - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="grid h-8 min-w-9 place-items-center rounded-2xl bg-muted px-3 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label={`Increase ${item.title}`}
                        onClick={() => updateQuantity(item.mealId, item.quantity + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeMeal(item.mealId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{totals.itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span>{formatCurrency(totals.deliveryFee)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(totals.total)}</span>
              </div>
              <Button asChild className="h-10 w-full">
                <Link href={userInfo ? "/checkout" : "/login?redirect=/cart"}>
                  {userInfo ? "Continue to Checkout" : "Login to Checkout"}
                </Link>
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                Checkout will confirm your delivery address and create a cash-on-delivery order.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
