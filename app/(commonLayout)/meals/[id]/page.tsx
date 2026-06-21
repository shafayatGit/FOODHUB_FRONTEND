import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Star, Store, Utensils } from "lucide-react";

import AddToCartButton from "@/components/modules/Cart/AddToCartButton";
import MealCard from "@/components/modules/Meals/MealCard";
import { formatCurrency, getMealImage } from "@/components/modules/Meals/meal-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMealById, getMeals } from "@/services/meals.services";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SingleMealPageProps = {
  params: Promise<{ id: string }>;
};

const SingleMealPage = async ({ params }: SingleMealPageProps) => {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    return (
      <section className="grid min-h-[70svh] place-items-center bg-muted/30 px-4 py-10">
        <Card className="max-w-md border-0 text-center shadow-sm">
          <CardHeader>
            <CardTitle>Meal not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This meal may have been removed or is temporarily unavailable.
            </p>
            <Button asChild>
              <Link href="/meals">Back to meals</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const { meals: relatedMeals } = await getMeals({
    limit: 3,
    categoryId: meal.categoryId,
  });
  const visibleRelatedMeals = relatedMeals.filter((item) => item.id !== meal.id).slice(0, 3);

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/meals">
            <ArrowLeft className="size-4" />
            Back to meals
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-foreground/5">
            <div className="relative aspect-[16/10] min-h-[320px]">
              <Image
                src={meal.imageUrl ? meal.imageUrl : getMealImage(meal)}
          alt={meal.title}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white sm:p-8">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge>{meal.category?.name ?? "Chef special"}</Badge>
                  <Badge variant="secondary">{meal.dietaryPreference}</Badge>
                </div>
                <h1 className="max-w-3xl text-3xl font-semibold tracking-normal sm:text-5xl">
                  {meal.title}
                </h1>
              </div>
            </div>
            <div className="grid gap-5 p-5 sm:p-8">
              <p className="text-base leading-7 text-muted-foreground">
                {meal.description}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
                  <Utensils className="size-5 text-primary" />
                  <span className="text-sm">{meal.dietaryPreference}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="text-sm">
                    {meal.isAvailable ? "Ready to order" : "Currently unavailable"}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
                  <Star className="size-5 text-primary" />
                  <span className="text-sm">
                    {meal.reviews?.length
                      ? `${(
                          meal.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                          meal.reviews.length
                        ).toFixed(1)} (${meal.reviews.length} reviews)`
                      : "No reviews yet"}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
                  <Clock className="size-5 text-primary" />
                  <span className="text-sm">
                    {meal.provider?.isOpen ? "Provider open now" : "Check provider hours"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>Order Summary</span>
                  <span className="text-2xl text-primary">{formatCurrency(meal.price)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AddToCartButton meal={meal} className="h-10 w-full" />
                <p className="text-xs leading-5 text-muted-foreground">
                  Cash on delivery checkout will use your saved or entered delivery address.
                </p>
              </CardContent>
            </Card>

            {meal.provider ? (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Store className="mt-0.5 size-4 text-primary" />
                    <div>
                      <p className="font-medium">{meal.provider.restaurantName}</p>
                      <p className="text-muted-foreground">{meal.provider.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 text-primary" />
                    <p>{meal.provider.address}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/providers/${meal.provider.id}`}>View provider menu</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </aside>
        </div>

        {meal.reviews && meal.reviews.length > 0 && (
          <section className="space-y-4">
            <div>
              <p className="text-sm font-medium text-primary">Feedback</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">Customer Reviews</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meal.reviews.map((review, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i < (review.rating || 0)
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {review.comment || "No comment provided."}
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {visibleRelatedMeals.length > 0 ? (
          <section className="space-y-4">
            <div>
              <p className="text-sm font-medium text-primary">More to try</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">Related Meals</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleRelatedMeals.map((item) => (
                <MealCard key={item.id} meal={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
};

export default SingleMealPage
