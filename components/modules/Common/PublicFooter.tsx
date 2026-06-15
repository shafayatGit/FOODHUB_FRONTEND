import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2 text-foreground">
          <ChefHat className="size-4 text-primary" />
          <span className="font-medium">FoodHub</span>
        </div>
        <p>Fresh menus from local providers, ready when hunger is.</p>
        <div className="flex items-center gap-4">
          <Link href="/meals" className="hover:text-foreground">
            Meals
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Login
          </Link>
          <Link href="/register" className="hover:text-foreground">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
