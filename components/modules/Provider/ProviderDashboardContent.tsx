"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChefHat,
  ShoppingBag,
  UtensilsCrossed,
  MapPin,
  Clock,
  Plus,
  Edit,
  DollarSign,
  Store,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProviderProfile } from "@/services/provider-dashboard.services";
import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import { formatOrderDate, OrderStatusBadge } from "@/components/modules/Orders/order-ui";
import { cn } from "@/lib/utils";
import type { UserInfo } from "@/types/user.types";
import type { Provider } from "@/types/provider.types";

interface ProviderDashboardContentProps {
  userInfo: UserInfo | null;
  providerProfile: Provider;
}

// Helpers for time formatting
function parseIsoToTimeInput(isoString?: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatTimeDisplay(isoString?: string | null) {
  if (!isoString) return "Not set";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function timeInputToIso(timeString: string) {
  if (!timeString) return null;
  const date = new Date();
  const [hours, minutes] = timeString.split(":");
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date.toISOString();
}

export default function ProviderDashboardContent({
  userInfo,
  providerProfile,
}: ProviderDashboardContentProps) {
  const [isOpenState, setIsOpenState] = useState(providerProfile.isOpen);
  const [isUpdatingOpen, startTransitionOpen] = useTransition();
  const [isUpdatingProfile, startTransitionProfile] = useTransition();

  // Profile Form States
  const [restaurantName, setRestaurantName] = useState(providerProfile.restaurantName);
  const [description, setDescription] = useState(providerProfile.description);
  const [address, setAddress] = useState(providerProfile.address);
  const [openTime, setOpenTime] = useState(parseIsoToTimeInput(providerProfile.openTime));
  const [closeTime, setCloseTime] = useState(parseIsoToTimeInput(providerProfile.closeTime));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Stats Calculations
  const mealsCount = providerProfile.meals?.length ?? 0;
  const orders = providerProfile.orders ?? [];
  const ordersCount = orders.length;
  // Calculate total earnings (sum of totalAmount + deliveryFee, or just totalAmount)
  const totalEarnings = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Toggle restaurant open status
  const handleToggleOpen = () => {
    const nextState = !isOpenState;
    startTransitionOpen(async () => {
      const res = await updateProviderProfile({ isOpen: nextState });
      if (res.success) {
        setIsOpenState(nextState);
        toast.success(`Restaurant is now ${nextState ? "OPEN" : "CLOSED"}`);
      } else {
        toast.error(res.message);
      }
    });
  };

  // Update Profile Submit
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !description || !address) {
      toast.error("All basic profile details are required.");
      return;
    }

    startTransitionProfile(async () => {
      const payload = {
        restaurantName,
        description,
        address,
        openTime: openTime ? timeInputToIso(openTime) : null,
        closeTime: closeTime ? timeInputToIso(closeTime) : null,
      };

      const res = await updateProviderProfile(payload);
      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsDialogOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  // Get locally simulated order status if any exists
  const getSimulatedStatus = (orderId: string) => {
    if (typeof window !== "undefined") {
      const localStatuses = JSON.parse(localStorage.getItem("provider_order_statuses") || "{}");
      return localStatuses[orderId];
    }
    return undefined;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome & Switch Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-primary/5 blur-2xl" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <ChefHat className="size-4" />
              Provider Portal
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground">
              Welcome back, {providerProfile.restaurantName}
            </h1>
            <p className="max-w-2xl text-muted-foreground text-sm">
              Manage your food menu, track client orders, and configure your restaurant operating hours.
            </p>
          </div>

          {/* Premium Custom Toggle Switch */}
          <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3 ring-1 ring-foreground/5 shrink-0 self-start md:self-auto">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Store Status
              </p>
              <p className="text-sm font-medium text-foreground">
                {isOpenState ? "Open for business" : "Closed"}
              </p>
            </div>
            <button
              onClick={handleToggleOpen}
              disabled={isUpdatingOpen}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
                isOpenState ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                  isOpenState ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <UtensilsCrossed className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Menu Items</p>
              <p className="text-3xl font-bold tracking-tight mt-1">{mealsCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="grid size-12 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
              <p className="text-3xl font-bold tracking-tight mt-1">{ordersCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Estimated Earnings</p>
              <p className="text-3xl font-bold tracking-tight mt-1">{formatCurrency(totalEarnings)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Recent Orders Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Review latest activity from your customers.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/provider/orders">
                View all <ChevronRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => {
                  const status = getSimulatedStatus(order.id) || "PLACED";
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-muted/30 p-4 transition-all duration-200 hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-muted-foreground">
                            #{order.id.slice(0, 8)}
                          </span>
                          <OrderStatusBadge status={status} />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {order.deliveryAddress ? `Delivery to: ${order.deliveryAddress}` : "Address not provided"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <p className="font-semibold text-foreground text-right shrink-0">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <Link href="/provider/orders">Manage</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                <ClipboardList className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                No orders received yet. Once orders are placed, they will appear here.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Restaurant Profile Details */}
        <Card className="border-0 shadow-sm self-start">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Restaurant Details</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon-sm" variant="outline" className="size-8">
                  <Edit className="size-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form onSubmit={handleUpdateProfile}>
                  <DialogHeader>
                    <DialogTitle>Edit Restaurant Details</DialogTitle>
                    <DialogDescription>
                      Update your restaurant display name, bio, and operational timings.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="rest-name">Restaurant Name</Label>
                      <Input
                        id="rest-name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="My Awesome Diner"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rest-desc">Description</Label>
                      <Textarea
                        id="rest-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your cuisines, specialty dishes..."
                        required
                        className="h-20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rest-addr">Address</Label>
                      <Input
                        id="rest-addr"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Foodie Street, Flavor Town"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="open-time">Open Time</Label>
                        <Input
                          id="open-time"
                          type="time"
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="close-time">Close Time</Label>
                        <Input
                          id="close-time"
                          type="time"
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isUpdatingProfile}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex gap-3 items-start">
              <Store className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Restaurant Name</p>
                <p className="text-muted-foreground mt-0.5">{providerProfile.restaurantName}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Address</p>
                <p className="text-muted-foreground mt-0.5">{providerProfile.address}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Clock className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Operating Hours</p>
                <p className="text-muted-foreground mt-0.5">
                  {formatTimeDisplay(providerProfile.openTime)} -{" "}
                  {formatTimeDisplay(providerProfile.closeTime)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="font-semibold text-foreground mb-1">Restaurant Bio</p>
              <p className="text-muted-foreground leading-relaxed text-xs">
                {providerProfile.description || "No description provided."}
              </p>
            </div>

            <Separator />

            <div className="pt-2">
              <Button asChild className="w-full gap-2">
                <Link href="/provider/meals">
                  <Plus className="size-4" /> Add Meal to Menu
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
