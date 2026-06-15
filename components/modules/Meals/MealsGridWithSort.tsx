"use client";

import { useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";

import MealCard from "@/components/modules/Meals/MealCard";
import type { Meal } from "@/types/meal.types";

interface MealsGridWithSortProps {
  meals: Meal[];
  sortBy?: string;
}

export default function MealsGridWithSort({
  meals,
  sortBy = "newest",
}: MealsGridWithSortProps) {
  const sortedMeals = useMemo(() => {
    const mealsCopy = [...meals];

    switch (sortBy) {
      case "price-low":
        return mealsCopy.sort((a, b) => a.price - b.price);
      case "price-high":
        return mealsCopy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return mealsCopy.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case "name-desc":
        return mealsCopy.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
      case "newest":
      default:
        return mealsCopy;
    }
  }, [meals, sortBy]);

  if (sortedMeals.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-foreground/5">
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UtensilsCrossed className="size-6" />
          </div>
          <h2 className="text-xl font-semibold">No meals found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search, price range, or dietary preference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sortedMeals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
