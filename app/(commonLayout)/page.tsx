import Link from "next/link";
import { ArrowRight } from "lucide-react";

import MealCard from "@/components/modules/Meals/MealCard";
import { Button } from "@/components/ui/button";
import { getMeals } from "@/services/meals.services";
import HeroSection from "@/components/shared/hero";
import FeaturedProviders from "@/components/modules/Providers/FeaturedProviders";
import ProviderCard from "@/components/modules/Providers/ProviderCard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { meals } = await getMeals({ limit: 3 });

  return (
    <section className="-mt-16">
        <HeroSection />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FeaturedProviders />

        <section className="space-y-4 py-10 min-h-screen">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Featured meals</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">Ready to Order</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/meals">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          {meals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-foreground/5">
              Meals will appear here once the API returns menu data.
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
