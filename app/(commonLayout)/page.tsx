import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Clock3, Store, UtensilsCrossed } from "lucide-react";

import MealCard from "@/components/modules/Meals/MealCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMeals } from "@/services/meals.services";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { meals } = await getMeals({ limit: 3 });

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100svh-9rem)] gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-card px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-foreground/5">
              <BadgeCheck className="size-4 text-primary" />
              Discover and order delicious meals
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-6xl">
                Fresh meals from trusted local providers.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Browse restaurant menus, compare dietary options, and start a cash-on-delivery order from one responsive public experience.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11">
                <Link href="/meals">
                  Browse Meals
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: UtensilsCrossed, label: "Menu browsing" },
                { icon: Store, label: "Provider profiles" },
                { icon: Clock3, label: "Live availability" },
              ].map((item) => (
                <Card key={item.label} className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <item.icon className="size-5 text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-3xl shadow-sm ring-1 ring-foreground/5">
            <Image
              src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1400&q=80"
              alt="A table of fresh shared meals"
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-4 left-4 right-4 rounded-3xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-medium">Today&apos;s menu is ready</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore available dishes from open providers near you.
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-4 py-10">
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
