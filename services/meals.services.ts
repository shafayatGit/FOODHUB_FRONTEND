"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { PaginationMeta } from "@/types/api.types";
import type { Meal, MealListQuery } from "@/types/meal.types";

export interface MealsResult {
  meals: Meal[];
  meta?: PaginationMeta;
}

function cleanQuery(query?: MealListQuery) {
  if (!query) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

export async function getMeals(query?: MealListQuery): Promise<MealsResult> {
  try {
    const response = await httpClient.get<Meal[]>("/meals", {
      params: cleanQuery(query),
    });

    return {
      meals: response?.data ?? [],
      meta: response?.meta,
    };
  } catch (error) {
    console.error(error, "From Meals Server Action");
    return { meals: [] };
  }
}

export async function getMealById(id: string): Promise<Meal | null> {
  try {
    const response = await httpClient.get<Meal>(`/meals/${id}`);

    return response?.data ?? null;
  } catch (error) {
    console.error(error, "From Single Meal Server Action");
    return null;
  }
}
