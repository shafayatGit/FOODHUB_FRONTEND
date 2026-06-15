import type { CustomerOrder, OrderStatus } from "@/types/order.types";

type RawRecord = Record<string, unknown>;

function pickNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function normalizeStatus(value: unknown): OrderStatus {
  const status = String(value || "UNKNOWN").toUpperCase();

  if (
    status === "PLACED" ||
    status === "PREPARING" ||
    status === "READY" ||
    status === "DELIVERED" ||
    status === "CANCELLED"
  ) {
    return status;
  }

  return "UNKNOWN";
}

export function normalizeOrder(order: RawRecord): CustomerOrder {
  const meal = order.meal && typeof order.meal === "object" ? order.meal : undefined;
  const provider =
    order.provider && typeof order.provider === "object" ? order.provider : undefined;
  const customer =
    order.customer && typeof order.customer === "object" ? order.customer : undefined;

  return {
    id: String(order.id || order._id || order.orderId),
    deliveryAddress: String(order.deliveryAddress || order.address || ""),
    totalAmount: pickNumber(order.totalAmount || order.total || order.amount),
    deliveryFee: pickNumber(order.deliveryFee),
    quantity: pickNumber(order.quantity, 1),
    status: normalizeStatus(order.status || order.orderStatus),
    providerId: String(order.providerId || (provider as RawRecord | undefined)?.id || ""),
    customerId: String(order.customerId || (customer as RawRecord | undefined)?.id || ""),
    mealId: String(order.mealId || (meal as RawRecord | undefined)?.id || ""),
    createdAt:
      typeof order.createdAt === "string"
        ? order.createdAt
        : typeof order.created_at === "string"
          ? order.created_at
          : undefined,
    updatedAt: typeof order.updatedAt === "string" ? order.updatedAt : undefined,
    meal: meal as CustomerOrder["meal"],
    provider: provider as CustomerOrder["provider"],
    customer: customer as CustomerOrder["customer"],
  };
}

export function normalizeOrdersPayload(payload: unknown): CustomerOrder[] {
  const payloadRecord =
    payload && typeof payload === "object" ? (payload as RawRecord) : null;
  const orders = Array.isArray(payload)
    ? payload
    : payloadRecord?.orders ||
      payloadRecord?.items ||
      payloadRecord?.result ||
      (payloadRecord?.id ? [payloadRecord] : []);

  if (!Array.isArray(orders)) {
    return [];
  }

  return orders
    .filter((order): order is RawRecord =>
      Boolean(order && typeof order === "object"),
    )
    .map(normalizeOrder)
    .filter((order) => order.id !== "undefined");
}
