"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex w-full overflow-x-auto border-b border-[var(--border-strong)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative min-h-12 shrink-0 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)] outline-none transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus)] data-[state=active]:text-[var(--foreground)] data-[state=active]:after:scale-x-100",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "pt-8 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
        className,
      )}
      {...props}
    />
  );
}
