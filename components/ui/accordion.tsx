"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-[var(--border)]", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-6 py-5 text-left font-medium text-[var(--foreground)] outline-none transition-colors hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="size-4 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm text-[var(--muted-foreground)] data-[state=closed]:animate-[accordion-up_160ms_ease-out] data-[state=open]:animate-[accordion-down_160ms_ease-out]"
      {...props}
    >
      <div className={cn("pb-6 pr-8 leading-7", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
