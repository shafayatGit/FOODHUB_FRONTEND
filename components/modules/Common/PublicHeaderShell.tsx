"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export default function PublicHeaderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderBackground = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      setHasScrolled(scrollTop > 20);
    };

    let frameId = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateHeaderBackground);
    };

    updateHeaderBackground();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isScrolled = !isHomePage || hasScrolled;

  return (
    <header
      className={cn(
        "group/site-header fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-300",
        isScrolled
          ? "border-border bg-background/95 text-foreground shadow-sm"
          : "border-white/10 bg-transparent text-white shadow-none",
      )}
      data-scrolled={isScrolled}
    >
      {children}
    </header>
  );
}
