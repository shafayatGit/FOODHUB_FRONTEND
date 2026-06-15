import Link from "next/link";
import Image from "next/image";
import { Clock, Store, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/modules/Cart/AddToCartButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Meal } from "@/types/meal.types";
import { formatCurrency, getMealImage } from "@/components/modules/Meals/meal-helpers";

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="h-full border-0 shadow-sm ring-1 ring-foreground/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getMealImage(meal)}
          alt={meal.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={meal.isAvailable ? "default" : "secondary"}>
            {meal.isAvailable ? "Available" : "Unavailable"}
          </Badge>
          {meal.category?.name ? (
            <Badge variant="secondary">{meal.category.name}</Badge>
          ) : null}
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-lg">{meal.title}</CardTitle>
          <span className="shrink-0 rounded-2xl bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {formatCurrency(meal.price)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        <p className="line-clamp-2 min-h-10 text-muted-foreground">
          {meal.description}
        </p>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Utensils className="size-4 text-primary" />
            <span>{meal.dietaryPreference || "Flexible"}</span>
          </div>
          {meal.provider?.restaurantName ? (
            <div className="flex min-w-0 items-center gap-2">
              <Store className="size-4 text-primary" />
              <span className="truncate">{meal.provider.restaurantName}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span>{meal.provider?.isOpen ? "Open now" : "Provider schedule varies"}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/meals/${meal.id}`}>View Meal</Link>
        </Button>
        <AddToCartButton meal={meal} />
      </CardFooter>
    </Card>
  );
}
