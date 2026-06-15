import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin-order.types";
import { ClipboardList, ReceiptText } from "lucide-react";

interface OrderManagementTableProps {
  orders: AdminOrder[];
}

const statusBadgeClassName: Record<AdminOrderStatus, string> = {
  PLACED: "border-sky-200 bg-sky-50 text-sky-700",
  PREPARING: "border-amber-200 bg-amber-50 text-amber-700",
  READY: "border-violet-200 bg-violet-50 text-violet-700",
  DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  UNKNOWN: "border-muted bg-muted/50 text-muted-foreground",
};

function formatDate(date?: string) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en", {
    currency: "USD",
    style: "currency",
  }).format(amount);
}

function StatusBadge({ status }: { status: AdminOrderStatus }) {
  return (
    <Badge variant="outline" className={statusBadgeClassName[status]}>
      {status.toLowerCase()}
    </Badge>
  );
}

const OrderManagementTable = ({ orders }: OrderManagementTableProps) => {
  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ClipboardList className="size-4" />
            Admin orders
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">
            Order Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Monitor customer orders, provider assignments, revenue, and current
            fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-sm shadow-sm">
          <ReceiptText className="size-4 text-muted-foreground" />
          <span className="font-medium">{orders.length}</span>
          <span className="text-muted-foreground">orders</span>
        </div>
      </div>

      <Card className="hidden border-0 shadow-sm md:flex">
        <CardHeader className="pb-3">
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Platform-wide order history and fulfillment state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[170px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {order.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell>{order.providerName}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:hidden">
        {orders.length > 0 ? (
          orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl bg-card p-4 text-sm shadow-sm ring-1 ring-foreground/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {order.id}
                  </p>
                  <p className="mt-1 truncate font-medium">
                    {order.customerName}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Provider</p>
                  <p className="mt-1 truncate font-medium">
                    {order.providerName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="mt-1 font-medium">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-foreground/5">
            No orders found.
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderManagementTable;
