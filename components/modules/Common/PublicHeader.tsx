import Link from "next/link";
import { ChefHat, LayoutDashboard, LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartLinkButton from "@/components/modules/Cart/CartLinkButton";
import PublicHeaderShell from "@/components/modules/Common/PublicHeaderShell";
import PublicUserControls from "@/components/modules/Common/PublicUserControls";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { logoutAction, getUserInfo } from "@/services/auth.services";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Meals" },
  { href: "/providers", label: "Restaurants" },
];

export default async function PublicHeader() {
  const userInfo = await getUserInfo();

  return (
    <PublicHeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <ChefHat className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-normal text-foreground group-data-[scrolled=false]/site-header:text-white transition-colors">FoodHub</span>
          </Link>
          <AnimatedThemeToggler fromCenter />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className="group-data-[scrolled=false]/site-header:text-white group-data-[scrolled=false]/site-header:hover:bg-white/10 group-data-[scrolled=false]/site-header:hover:text-white"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <PublicUserControls userInfo={userInfo} />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="md:hidden group-data-[scrolled=false]/site-header:border-white/25 group-data-[scrolled=false]/site-header:bg-white/5 group-data-[scrolled=false]/site-header:text-white group-data-[scrolled=false]/site-header:hover:bg-white/10"
              size="icon"
              variant="outline"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ChefHat className="size-5 text-primary" />
                FoodHub
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 grid gap-2 px-4">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" className="justify-start">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              <Button asChild variant="ghost" className="justify-start">
                <Link href={userInfo ? getDefaultDashboardRoute(userInfo.role) : "/login"}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>
              {userInfo ? (
                <>
                  <CartLinkButton />
                  <form action={logoutAction} className="mt-3">
                    <Button className="w-full" variant="outline">
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </form>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PublicHeaderShell>
  );
}
