import Link from "next/link";
import { Clock, MapPin, Store, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Provider } from "@/types/provider.types";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const initials = provider.restaurantName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="group relative overflow-hidden border-none bg-card/50 shadow-sm ring-1 ring-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start justify-between">
          <Avatar className="size-14 rounded-2xl ring-2 ring-background ring-offset-2 ring-offset-foreground/5 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <AvatarImage src={provider.user?.image || ""} alt={provider.restaurantName} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Badge 
            variant={provider.isOpen ? "default" : "secondary"} 
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              provider.isOpen ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400" : ""
            }`}
          >
            {provider.isOpen ? "Open Now" : "Closed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {provider.restaurantName}
            </h3>
            <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
              {provider.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground/80">
              <MapPin className="size-3.5 shrink-0 text-primary/70" />
              <span className="line-clamp-1">{provider.address}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground/80">
              <Clock className="size-3.5 shrink-0 text-primary/70" />
              <span>{provider.openTime} - {provider.closeTime}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          asChild 
          className="w-full rounded-xl bg-primary/10 font-semibold text-primary shadow-none hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Link href={`/providers/${provider.id}`}>
            View Menu
            <ChevronRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
