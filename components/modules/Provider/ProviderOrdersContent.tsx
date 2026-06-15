"use client";

import React, { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  ClipboardList,
  MapPin,
  User,
  ShoppingBag,
  Clock,
  ArrowRight,
  Search,
  ReceiptText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/services/provider-dashboard.services";
import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import { formatOrderDate, OrderStatusBadge } from "@/components/modules/Orders/order-ui";
import { cn } from "@/lib/utils";
import type { CustomerOrder, OrderStatus } from "@/types/order.types";

interface ProviderOrdersContentProps {
  orders: CustomerOrder[];
}

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  UNKNOWN: ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"],
};

export default function ProviderOrdersContent({ orders }: ProviderOrdersContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [localStatuses, setLocalStatuses] = useState<Record<string, OrderStatus>>({});
  const [, startTransition] = useTransition();

  // Load simulated statuses on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("provider_order_statuses");
      if (stored) {
        setLocalStatuses(JSON.parse(stored));
      }
    }
  }, []);

  // Update Status
  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        const updated = { ...localStatuses, [orderId]: nextStatus };
        setLocalStatuses(updated);
        localStorage.setItem("provider_order_statuses", JSON.stringify(updated));
        toast.success(res.message);
      } else {
        toast.error("Failed to update order status.");
      }
    });
  };

  // Resolve status for each order, prioritizing simulated ones
  const resolvedOrders = orders.map((order) => {
    const status = localStatuses[order.id] || order.status || "PLACED";
    return { ...order, resolvedStatus: status };
  });

  // Filter orders by search & tab
  const filteredOrders = resolvedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.meal?.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "ALL" || order.resolvedStatus === activeTab;

    return matchesSearch && matchesTab;
  });

  // Counts for badge tabs
  const getCountByStatus = (status: OrderStatus | "ALL") => {
    if (status === "ALL") return resolvedOrders.length;
    return resolvedOrders.filter((o) => o.resolvedStatus === status).length;
  };

  const tabs: { label: string; value: OrderStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Placed", value: "PLACED" },
    { label: "Preparing", value: "PREPARING" },
    { label: "Ready", value: "READY" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Banner */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ClipboardList className="size-4" />
            Order fulfillment
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">Diner Orders</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Monitor incoming client orders, update their preparation status, and complete deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-sm shadow-sm shrink-0 self-start sm:self-auto">
          <ReceiptText className="size-4 text-muted-foreground" />
          <span className="font-medium">{orders.length}</span>
          <span className="text-muted-foreground"> total orders</span>
        </div>
      </section>

      {/* Tabs list & search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
        {/* Status Tab buttons */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all duration-200",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground ring-primary"
                  : "bg-card text-muted-foreground ring-foreground/10 hover:text-foreground hover:bg-muted/40"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  activeTab === tab.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {getCountByStatus(tab.value)}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0 sm:p-6">
          {/* Desktop view table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Items Ordered</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right min-w-[160px]">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const status = order.resolvedStatus;
                    const nextOptions = ORDER_STATUS_TRANSITIONS[status] || [];

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {order.customer?.name || "Customer"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.customer?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs max-w-[180px] line-clamp-2 leading-relaxed">
                            {order.deliveryAddress || "Address not provided"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {order.meal?.title || "Meal item"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Quantity: {order.quantity || 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {nextOptions.length > 0 ? (
                              <Select onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}>
                                <SelectTrigger className="h-8 w-[140px] text-xs">
                                  <SelectValue placeholder="Update status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {nextOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt} className="text-xs font-semibold">
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 justify-end">
                                No transitions available
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No orders found in this tab.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view cards */}
          <div className="grid gap-4 p-4 md:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const status = order.resolvedStatus;
                const nextOptions = ORDER_STATUS_TRANSITIONS[status] || [];

                return (
                  <article
                    key={order.id}
                    className="rounded-2xl border bg-card p-4 text-sm space-y-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </span>
                        <h4 className="font-bold text-foreground mt-1">
                          {order.meal?.title || "Meal item"}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Quantity: {order.quantity || 1}
                        </p>
                      </div>
                      <OrderStatusBadge status={status} />
                    </div>

                    <div className="rounded-2xl bg-muted/40 p-3 text-xs space-y-2.5">
                      <div className="flex gap-2 items-start text-muted-foreground">
                        <User className="size-3.5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">
                            {order.customer?.name || "Customer"}
                          </span>
                          <p className="mt-0.5">{order.customer?.email}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-start text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0 mt-0.5" />
                        <span>{order.deliveryAddress || "Address not provided"}</span>
                      </div>

                      <div className="flex gap-2 items-start text-muted-foreground">
                        <ShoppingBag className="size-3.5 shrink-0 mt-0.5" />
                        <span className="font-bold text-foreground">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t">
                      {nextOptions.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">Update status:</span>
                          <div className="flex-1 flex flex-wrap gap-1.5">
                            {nextOptions.map((opt) => (
                              <Button
                                key={opt}
                                size="sm"
                                variant="outline"
                                className="h-7 text-[10px] px-2 font-bold"
                                onClick={() => handleStatusChange(order.id, opt)}
                              >
                                {opt} <ArrowRight className="size-2.5 ml-1" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-center text-muted-foreground">
                          This order has been completed/cancelled.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl bg-card border border-dashed p-8 text-center text-sm text-muted-foreground">
                No orders found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
