import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealFiltersProps {
  searchTerm?: string;
  dietaryPreference?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}

export default function MealFilters({
  searchTerm,
  dietaryPreference,
  minPrice,
  maxPrice,
  sortBy,
}: MealFiltersProps) {
  return (
    <form className="space-y-3 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/5">
      {/* Search and Sort Row */}
      <div className="grid gap-3 md:grid-cols-[1fr_150px_auto]">
        {/* <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="searchTerm"
            placeholder="Search meals or restaurants"
            defaultValue={searchTerm}
            className="h-10 rounded-2xl pl-9"
          />
        </div> */}

        <div>
          <Select name="sortBy" defaultValue={sortBy || "newest"}>
            <SelectTrigger className="h-10 rounded-2xl">
              <ArrowUpDown className="size-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="newest">Newest</SelectItem> */}
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="h-10">
          <SlidersHorizontal className="size-4" />
          Filter
        </Button>
      </div>

      {/* Filters Row */}
      {/* <div className="grid gap-3 md:grid-cols-3">
        <Input
          name="dietaryPreference"
          placeholder="Dietary preference (e.g., Veg, Non-Veg)"
          defaultValue={dietaryPreference}
          className="h-10 rounded-2xl"
        />
        <Input
          name="minPrice"
          inputMode="decimal"
          placeholder="Min price ($)"
          defaultValue={minPrice}
          className="h-10 rounded-2xl"
        />
        <Input
          name="maxPrice"
          inputMode="decimal"
          placeholder="Max price ($)"
          defaultValue={maxPrice}
          className="h-10 rounded-2xl"
        />
      </div> */}
    </form>
  );
}
