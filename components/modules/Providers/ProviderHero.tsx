import Image from "next/image";
import { Clock, MapPin, ShoppingBag, Store, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Provider } from "@/types/provider.types";

interface ProviderHeroProps {
  provider: Provider;
}

function formatTime(value?: string) {
  if (!value) {
    return "Schedule unavailable";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Schedule unavailable";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ProviderHero({ provider }: ProviderHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-foreground/5">
      <div className="relative min-h-[260px]">
        <Image
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80"
          alt={provider.restaurantName}
          fill
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex min-h-[260px] flex-col justify-end p-5 text-white sm:p-8">
          <Badge className="mb-4 w-fit" variant={provider.isOpen ? "default" : "secondary"}>
            {provider.isOpen ? "Open now" : "Closed"}
          </Badge>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-normal sm:text-5xl">
            {provider.restaurantName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
            {provider.description}
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <MapPin className="size-5 text-primary" />
          <span className="min-w-0 truncate text-sm">{provider.address}</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <Clock className="size-5 text-primary" />
          <span className="text-sm">
            {formatTime(provider.openTime)} - {formatTime(provider.closeTime)}
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <Utensils className="size-5 text-primary" />
          <span className="text-sm">{provider.meals?.length ?? 0} menu items</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <ShoppingBag className="size-5 text-primary" />
          <span className="text-sm">{provider.orders?.length ?? 0} orders served</span>
        </div>
      </div>

      {provider.user ? (
        <div className="flex items-center gap-3 border-t p-4 text-sm text-muted-foreground">
          <Store className="size-4 text-primary" />
          Managed by {provider.user.name} · {provider.user.email}
        </div>
      ) : null}
    </section>
  );
}
