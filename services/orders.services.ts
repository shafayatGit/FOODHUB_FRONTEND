"use server";

import { revalidatePath } from "next/cache";

import { httpClient } from "@/lib/axios/httpClient";
import type {
  CreateOrderPayload,
  CreateOrdersResult,
  CustomerOrder,
  OrderStatus,
} from "@/types/order.types";
import { normalizeOrdersPayload } from "./order-normalization";

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  try {
    const response = await httpClient.get<unknown>("/orders");

    return normalizeOrdersPayload(response?.data);
  } catch (error) {
    console.error(error, "From Customer Orders Server Action");
    return [];
  }
}

export async function getCustomerOrderById(id: string): Promise<CustomerOrder | null> {
  try {
    const response = await httpClient.get<unknown>(`/orders/${id}`);
    const [order] = normalizeOrdersPayload(response?.data);

    return order ?? null;
  } catch (error) {
    console.error(error, "From Customer Single Order Server Action");
    return null;
  }
}

export async function createCustomerOrders(
  payloads: CreateOrderPayload[],
): Promise<CreateOrdersResult> {
  if (payloads.length === 0) {
    return {
      success: false,
      message: "Your cart is empty.",
    };
  }

  try {
    const orders: CustomerOrder[] = [];

    for (const payload of payloads) {
      const response = await httpClient.post<unknown>("/orders", payload);
      orders.push(...normalizeOrdersPayload(response?.data));
    }

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Order placed successfully.",
      orders,
    };
  } catch (error) {
    console.error(error, "From Create Customer Orders Server Action");
    return {
      success: false,
      message: "Unable to place order. Please try again.",
    };
  }
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  try {
    await httpClient.patch(`/orders/${orderId}/cancel`,{ status: "CANCELLED" });
    revalidatePath("/orders");
    return {
      success: true,
      message: "Order cancelled successfully.",
    };
  } catch (error) {
    console.error(error, "From Cancel Order Server Action");
    return {
      success: false,
      message: "Failed to cancel order. Please try again.",
    };
  }
}
