"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={
        mounted ? `Switch to ${nextTheme} theme` : "Toggle color theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => setTheme(nextTheme)}
    >
      <Sun className="theme-icon theme-icon--sun" aria-hidden="true" />
      <Moon className="theme-icon theme-icon--moon" aria-hidden="true" />
      <span>Theme</span>
    </button>
  );
}
