import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MealFiltersProps {
  searchTerm?: string;
  dietaryPreference?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default function MealFilters({
  searchTerm,
  dietaryPreference,
  minPrice,
  maxPrice,
}: MealFiltersProps) {
  return (
    <form className="grid gap-3 rounded-3xl bg-card p-3 shadow-sm ring-1 ring-foreground/5 md:grid-cols-[1fr_180px_130px_130px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="searchTerm"
          placeholder="Search meals or restaurants"
          defaultValue={searchTerm}
          className="h-10 rounded-2xl pl-9"
        />
      </div>
      <Input
        name="dietaryPreference"
        placeholder="Dietary"
        defaultValue={dietaryPreference}
        className="h-10 rounded-2xl"
      />
      <Input
        name="minPrice"
        inputMode="decimal"
        placeholder="Min $"
        defaultValue={minPrice}
        className="h-10 rounded-2xl"
      />
      <Input
        name="maxPrice"
        inputMode="decimal"
        placeholder="Max $"
        defaultValue={maxPrice}
        className="h-10 rounded-2xl"
      />
      <Button type="submit" size="lg" className="h-10">
        <SlidersHorizontal className="size-4" />
        Filter
      </Button>
    </form>
  );
}
