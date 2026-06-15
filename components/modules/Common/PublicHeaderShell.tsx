"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export default function PublicHeaderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderBackground = () => {
      setHasScrolled(window.scrollY > 0);
    };

    const timeoutId = window.setTimeout(updateHeaderBackground, 0);
    window.addEventListener("scroll", updateHeaderBackground, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", updateHeaderBackground);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-40 border-b border-transparent backdrop-blur transition-colors duration-200",
        hasScrolled
          ? "border-border bg-background"
          : "bg-transparent supports-[backdrop-filter]:bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
