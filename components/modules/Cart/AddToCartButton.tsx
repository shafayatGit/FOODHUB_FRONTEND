"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/modules/Cart/CartProvider";
import { useUser } from "@/providers/UserProvider";
import type { Meal } from "@/types/meal.types";

interface AddToCartButtonProps {
  meal: Meal;
  className?: string;
}

export default function AddToCartButton({ meal, className }: AddToCartButtonProps) {
  const router = useRouter();
  const { addMeal } = useCart();
  const { userInfo } = useUser();

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!userInfo) {
      toast.error("Please login to add items to cart", {
        description: "You need to be logged in or a customer to proceed with your order",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    } 
    if (userInfo?.role !== "CUSTOMER") {
      toast.error("Only customers can add items to cart", {
        description: "Your current role does not have permission to add items to cart. Please login with a customer account.",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    addMeal(meal);
    toast.success(`${meal.title} added to cart`);
  };

  return (
    <Button
      className={className}
      disabled={!meal.isAvailable}
      onClick={handleAddToCart}
    >
      <ShoppingBag className="size-4" />
      Add to Cart
    </Button>
  );
}
