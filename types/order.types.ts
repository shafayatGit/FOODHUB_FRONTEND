import type { Meal } from "@/types/meal.types";
import type { ProviderSummary } from "@/types/provider.types";
import type { UserInfo } from "@/types/user.types";

export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"
  | "UNKNOWN";

export interface CustomerOrder {
  id: string;
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee: number;
  quantity: number;
  status: OrderStatus;
  providerId: string;
  customerId: string;
  mealId: string;
  createdAt?: string;
  updatedAt?: string;
  meal?: Meal;
  provider?: ProviderSummary;
  customer?: UserInfo;
}

export interface CreateOrderPayload {
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee: number;
  quantity: number;
  providerId: string;
  mealId: string;
  customerId?: string;
}

export interface CreateOrdersResult {
  success: boolean;
  message: string;
  orders?: CustomerOrder[];
}
