import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order.types";

const statusClassName: Record<OrderStatus, string> = {
  PLACED: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  PREPARING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  READY: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  DELIVERED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  CANCELLED: "bg-destructive/10 text-destructive",
  UNKNOWN: "bg-muted text-muted-foreground",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="secondary" className={statusClassName[status]}>
      {status}
    </Badge>
  );
}

export function formatOrderDate(value?: string) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
