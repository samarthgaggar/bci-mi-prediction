"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";

const REVEAL_TARGETS = [
  "main > section:not(.methodology-body):not(.results-page)",
  "main > .site-footer",
  ".method-section",
  ".method-sources",
  ".results-notice",
  ".results-tabs",
  ".publication-gate",
  ".results-back",
].join(", ");

export function ScrollRevealController() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(REVEAL_TARGETS),
      );

      if (prefersReducedMotion) {
        targets.forEach((target) => {
          target.dataset.scrollReveal = "visible";
        });
        return;
      }

      targets.forEach((target) => {
        target.dataset.scrollReveal = "idle";
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            target.dataset.scrollReveal = entry.isIntersecting
              ? "visible"
              : "idle";
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.08,
        },
      );

      targets.forEach((target) => observer?.observe(target));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return null;
}
