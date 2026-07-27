"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--overlay)] data-[state=closed]:animate-[fade-out_160ms_ease-out] data-[state=open]:animate-[fade-in_160ms_ease-out]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(90vw,24rem)] flex-col overflow-y-auto overscroll-contain border-l border-[var(--border-strong)] bg-[var(--background)] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16 outline-none data-[state=closed]:animate-[sheet-out_200ms_ease-in] data-[state=open]:animate-[sheet-in_220ms_ease-out]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-5 top-5 grid size-10 place-items-center border border-[var(--border)] text-[var(--muted-foreground)] outline-none transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Close navigation</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;
