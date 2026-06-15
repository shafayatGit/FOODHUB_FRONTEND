"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin-order.types";

type RawRecord = Record<string, unknown>;

function normalizeStatus(status: unknown): AdminOrderStatus {
  const normalized = String(status || "UNKNOWN").toUpperCase();

  if (
    normalized === "PLACED" ||
    normalized === "PREPARING" ||
    normalized === "READY" ||
    normalized === "DELIVERED" ||
    normalized === "CANCELLED"
  ) {
    return normalized;
  }

  return "UNKNOWN";
}

function pickName(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as RawRecord;
    return String(record.name || record.restaurantName || fallback);
  }

  return fallback;
}

function pickNumber(value: unknown) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function normalizeOrder(order: RawRecord): AdminOrder {
  return {
    id: String(order.id || order._id || order.orderId),
    customerName: pickName(
      order.customer || order.customerName || order.user,
      "Unknown customer",
    ),
    providerName: pickName(
      order.provider || order.providerName || order.restaurant,
      "Unknown provider",
    ),
    status: normalizeStatus(order.status || order.orderStatus),
    totalAmount: pickNumber(
      order.totalAmount || order.total || order.amount || order.grandTotal,
    ),
    createdAt:
      typeof order.createdAt === "string"
        ? order.createdAt
        : typeof order.created_at === "string"
          ? order.created_at
          : undefined,
  };
}

function normalizeOrdersPayload(payload: unknown): AdminOrder[] {
  const payloadRecord =
    payload && typeof payload === "object" ? (payload as RawRecord) : null;
  const orders = Array.isArray(payload)
    ? payload
    : payloadRecord?.orders || payloadRecord?.items || payloadRecord?.result || [];

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

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const response = await httpClient.get<unknown>("/admin/orders");

    return normalizeOrdersPayload(response?.data);
  } catch (error) {
    console.error(error, "From Admin Orders Server Action");
    return [];
  }
}
