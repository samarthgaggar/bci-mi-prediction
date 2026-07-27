"use client";

import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export const NavigationMenu = NavigationMenuPrimitive.Root;

export function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "relative inline-flex h-10 items-center rounded-full px-3.5 text-sm font-semibold text-[var(--muted-foreground)] outline-none transition-colors after:absolute after:inset-x-4 after:bottom-1.5 after:h-px after:origin-center after:scale-x-0 after:bg-[var(--accent)] after:transition-transform hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus)] data-[active]:text-[var(--foreground)] data-[active]:after:scale-x-100",
        className,
      )}
      {...props}
    />
  );
}
