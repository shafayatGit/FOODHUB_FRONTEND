"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import type { Review } from "@/types/meal.types";

export async function createReview(reviewData: {
  rating: number;
  comment?: string;
  mealId: string;
}): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await httpClient.post<Review>("/reviews", reviewData);

    revalidatePath(`/meals/${reviewData.mealId}`);
    revalidatePath("/orders");

    return {
      success: true,
      message: "Review submitted successfully!",
      data: response?.data,
    };
  } catch (error: any) {
    console.error(error, "From Create Review Server Action");
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to submit review. Please try again.",
    };
  }
}

export async function getReviewsByMealId(mealId: string): Promise<Review[]> {
  try {
    const response = await httpClient.get<Review[]>(`/reviews/meal/${mealId}`);
    return response?.data ?? [];
  } catch (error) {
    console.error(error, "From Get Reviews By Meal Id Server Action");
    return [];
  }
}
