import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

import MealCard from "@/components/modules/Meals/MealCard";
import { Button } from "@/components/ui/button";
import { getMeals } from "@/services/meals.services";
import HeroSection from "@/components/shared/hero";
import FeaturedProviders from "@/components/modules/Providers/FeaturedProviders";
import ProviderCard from "@/components/modules/Providers/ProviderCard";
import { AppDownloadCta } from "@/components/modules/Common/DownloadApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { meals } = await getMeals({ limit: 3 });

  return (
    <section className="-mt-16">
        <HeroSection />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FeaturedProviders />

        <section className="py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                <UtensilsCrossed className="size-4" />
                <span>Featured Meals</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Order?
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                Discover our hand-picked selection of the most delicious meals 
                available for delivery right now.
              </p>
            </div>
            <Button asChild variant="ghost" className="group self-start font-semibold text-primary hover:bg-primary/5 sm:self-end">
              <Link href="/meals" className="flex items-center gap-2">
                View All
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-12">
            {meals.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-card p-12 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-foreground/5">
                Meals will appear here once the API returns menu data.
              </div>
            )}
          </div>
        </section>

        <AppDownloadCta />
      </div>
    </section>
  )
}
