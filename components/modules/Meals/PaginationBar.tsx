import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api.types";

interface PaginationBarProps {
  meta?: PaginationMeta;
  searchParams: Record<string, string | undefined>;
}

function pageHref(page: number, searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page") {
      params.set(key, value);
    }
  });
  params.set("page", String(page));

  return `/meals?${params.toString()}`;
}

export default function PaginationBar({ meta, searchParams }: PaginationBarProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(meta.totalPages, meta.page + 1);

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-3 text-sm shadow-sm ring-1 ring-foreground/5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Page <span className="font-medium text-foreground">{meta.page}</span> of{" "}
        <span className="font-medium text-foreground">{meta.totalPages}</span> ·{" "}
        {meta.total} meals
      </p>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" className={meta.page <= 1 ? "pointer-events-none opacity-50" : ""}>
          <Link href={pageHref(previousPage, searchParams)}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className={meta.page >= meta.totalPages ? "pointer-events-none opacity-50" : ""}
        >
          <Link href={pageHref(nextPage, searchParams)}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
