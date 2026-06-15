"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { MapPin, PackageCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/modules/Cart/CartProvider";
import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createCustomerOrders } from "@/services/orders.services";
import type { CreateOrderPayload } from "@/types/order.types";
import type { UserInfo } from "@/types/user.types";

interface CheckoutContentProps {
  userInfo: UserInfo | null;
}

export default function CheckoutContent({ userInfo }: CheckoutContentProps) {
  const router = useRouter();
  const { clearCart, items, totals } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedProviders = useMemo(
    () => new Set(items.map((item) => item.providerId)).size,
    [items],
  );

  const handleSubmit = () => {
    const address = deliveryAddress.trim();

    if (!address) {
      setError("Delivery address is required.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const orderPayloads: CreateOrderPayload[] = items.map((item) => ({
      deliveryAddress: address,
      totalAmount: item.price * item.quantity,
      deliveryFee: totals.deliveryFee / items.length,
      quantity: item.quantity,
      providerId: item.providerId,
      mealId: item.mealId,
      customerId: userInfo?.id,
    }));

    setError(null);
    startTransition(async () => {
      const result = await createCustomerOrders(orderPayloads);

      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        return;
      }

      clearCart();
      toast.success(result.message);
      router.push("/orders");
    });
  };

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
                Add meals before continuing to checkout.
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
        <div>
          <p className="text-sm font-medium text-primary">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-5xl">
            Delivery Details
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Confirm your delivery address and place a cash-on-delivery order.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Address</Label>
                <Textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="House, road, area, city"
                  className="min-h-32 resize-none"
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button
                className="h-10 w-full sm:w-auto"
                disabled={isPending}
                onClick={handleSubmit}
              >
                <PackageCheck className="size-4" />
                {isPending ? "Placing order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>

          <Card className="h-fit border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meals</span>
                  <span>{totals.itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Providers</span>
                  <span>{groupedProviders}</span>
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
              <div className="rounded-2xl bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
                Each cart item is submitted as an order item using its meal and provider.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
