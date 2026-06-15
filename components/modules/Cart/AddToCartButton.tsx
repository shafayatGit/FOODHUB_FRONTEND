"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/modules/Cart/CartProvider";
import type { Meal } from "@/types/meal.types";

interface AddToCartButtonProps {
  meal: Meal;
  className?: string;
}

export default function AddToCartButton({ meal, className }: AddToCartButtonProps) {
  const { addMeal } = useCart();

  return (
    <Button
      className={className}
      disabled={!meal.isAvailable}
      onClick={() => {
        addMeal(meal);
        toast.success(`${meal.title} added to cart`);
      }}
    >
      <ShoppingBag className="size-4" />
      Add to Cart
    </Button>
  );
}
