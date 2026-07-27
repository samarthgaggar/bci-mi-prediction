import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}
