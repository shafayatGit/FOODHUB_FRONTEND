"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CartItem, CartTotals } from "@/types/cart.types";
import type { Meal } from "@/types/meal.types";
import { getMealImage } from "@/components/modules/Meals/meal-helpers";

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  addMeal: (meal: Meal, quantity?: number) => void;
  removeMeal: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "foodhub-cart";
const DELIVERY_FEE = 2;

function getInitialItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function toCartItem(meal: Meal, quantity: number): CartItem {
  return {
    mealId: meal.id,
    title: meal.title,
    description: meal.description,
    price: meal.price,
    quantity,
    providerId: meal.providerId,
    providerName: meal.provider?.restaurantName,
    categoryName: meal.category?.name,
    dietaryPreference: meal.dietaryPreference,
    imageUrl: getMealImage(meal),
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setItems(getInitialItems());
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const addMeal = useCallback((meal: Meal, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.mealId === meal.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.mealId === meal.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, toCartItem(meal, quantity)];
    });
  }, []);

  const removeMeal = useCallback((mealId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.mealId !== mealId));
  }, []);

  const updateQuantity = useCallback((mealId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.mealId === mealId
            ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = itemCount > 0 ? DELIVERY_FEE : 0;

    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      itemCount,
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      addMeal,
      removeMeal,
      updateQuantity,
      clearCart,
    }),
    [addMeal, clearCart, items, removeMeal, totals, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
