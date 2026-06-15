import type { Meal } from "@/types/meal.types";

export interface ProviderUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN" | string;
  isDeleted: boolean;
  deletedAt: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSummary {
  id: string;
  restaurantName: string;
  description: string;
  address: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  userId: string;
}

export interface ProviderOrder {
  id: string;
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee: number;
  providerId: string;
  customerId: string;
  mealId: string;
}

export interface Provider extends ProviderSummary {
  user?: ProviderUser;
  meals?: Meal[];
  orders?: ProviderOrder[];
}
