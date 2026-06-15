import type { Meal } from "@/types/meal.types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function getMealImage(meal?: Pick<Meal, "category" | "title">) {
  const category = meal?.category?.name?.toLowerCase() ?? "";
  const title = meal?.title?.toLowerCase() ?? "";
  const text = `${category} ${title}`;

  if (text.includes("pizza")) {
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80";
  }

  if (text.includes("burger")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80";
  }

  if (text.includes("salad") || text.includes("vegetarian")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80";
  }

  if (text.includes("dessert") || text.includes("cake")) {
    return "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80";
  }

  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";
}
