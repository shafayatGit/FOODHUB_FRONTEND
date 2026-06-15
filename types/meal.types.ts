import type { Category } from "@/types/category.types";
import type { ProviderSummary } from "@/types/provider.types";

export interface Review {
  id?: string;
  rating?: number;
  comment?: string;
  customerId?: string;
  mealId?: string;
  createdAt?: string;
}

export interface Meal {
  id: string;
  title: string;
  description: string;
  price: number;
  dietaryPreference: string;
  isAvailable: boolean;
  providerId: string;
  categoryId: string;
  imageUrl?: string | null;
  provider?: ProviderSummary;
  category?: Category;
  reviews?: Review[];
}

export interface MealListQuery {
  page?: string | number;
  limit?: string | number;
  searchTerm?: string;
  categoryId?: string;
  dietaryPreference?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
}
