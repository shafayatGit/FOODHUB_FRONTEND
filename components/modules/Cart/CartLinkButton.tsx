"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/modules/Cart/CartProvider";

export default function CartLinkButton() {
  const { totals } = useCart();

  return (
    <Button asChild variant="ghost" className="justify-start">
      <Link href="/cart">
        <ShoppingCart className="size-4" />
        Cart
        {totals.itemCount > 0 ? ` (${totals.itemCount})` : ""}
      </Link>
    </Button>
  );
}
