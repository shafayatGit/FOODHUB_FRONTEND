import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getProviders } from "@/services/providers.services";
import ProviderCard from "./ProviderCard";

export default async function FeaturedProviders() {
  const providers = await getProviders();

  return (
    <section className="py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
            <Store className="size-4" />
            <span>Popular Restaurants</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Top Rated Providers
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Explore a variety of cuisines from our most trusted partners. 
            Quality food delivered right to your doorstep.
          </p>
        </div>
        <Button asChild variant="ghost" className="group self-start font-semibold text-primary hover:bg-primary/5 sm:self-end">
          <Link href="/providers" className="flex items-center gap-2">
            Explore All
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="mt-12">
        {providers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {providers.slice(0, 4).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted shadow-inner ring-1 ring-foreground/5">
                <Store className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No providers found</h3>
            <p className="mt-1 text-sm text-muted-foreground">We're currently expanding our network. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
