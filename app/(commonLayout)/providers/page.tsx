import { Store } from "lucide-react";

import { getProviders } from "@/services/providers.services";
import ProviderCard from "@/components/modules/Providers/ProviderCard";

export const dynamic = "force-dynamic";

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Store className="size-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          All Restaurants
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Browse through our full list of partner restaurants. From local favorites to 
          popular chains, find the perfect meal for any occasion.
        </p>
      </div>

      {providers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted shadow-inner ring-1 ring-foreground/5">
            <Store className="size-10 text-muted-foreground/50" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-foreground">No providers available</h3>
          <p className="mt-2 max-w-sm text-muted-foreground">
            We're currently onboarding new partners. Please check back later for more delicious options!
          </p>
        </div>
      )}
    </div>
  );
}
