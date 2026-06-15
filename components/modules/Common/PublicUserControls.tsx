"use client";

import Link from "next/link";
import { useTransition } from "react";
import { LogOut, ShoppingCart, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { logoutAction } from "@/services/auth.services";
import type { UserInfo } from "@/types/user.types";
import { useCart } from "@/components/modules/Cart/CartProvider";

interface PublicUserControlsProps {
  userInfo: UserInfo | null;
}

function getInitials(name?: string) {
  return (name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PublicUserControls({ userInfo }: PublicUserControlsProps) {
  const [isPending, startTransition] = useTransition();
  const { totals } = useCart();

  if (!userInfo) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button asChild variant="outline" className="relative">
        <Link href="/cart">
          <ShoppingCart className="size-4" />
          Cart
          {totals.itemCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {totals.itemCount}
            </span>
          ) : null}
        </Link>
      </Button>
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() => startTransition(() => logoutAction())}
      >
        <LogOut className="size-4" />
        Logout
      </Button>
      <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Open profile">
        <Link href={getDefaultDashboardRoute(userInfo.role)}>
          <Avatar>
            {userInfo.image ? <AvatarImage src={userInfo.image} alt={userInfo.name} /> : null}
            <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
          </Avatar>
          <UserRound className="sr-only" />
        </Link>
      </Button>
    </div>
  );
}
