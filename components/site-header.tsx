"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicResearchSections } from "@/lib/research-content";

function routeIsActive(pathname: string, itemId: string) {
  if (itemId === "methodology") return pathname === "/methodology";
  if (itemId === "results") return pathname === "/results";
  return false;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("background");

  React.useEffect(() => {
    if (pathname !== "/") return;

    const sections = publicResearchSections
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-24% 0px -64% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="site-header">
      <ScrollProgress />
      <div className="site-header__inner">
        <Link className="wordmark" href="/" aria-label="BCI research home">
          <strong>TDM</strong>
          <span>BCI variability study</span>
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          <ol>
            {publicResearchSections.map((item) => {
              const active =
                pathname === "/"
                  ? activeSection === item.id
                  : routeIsActive(pathname, item.id);
              const href =
                pathname !== "/" && active ? `/${item.id}` : item.href;
              const current =
                pathname === "/" && active
                  ? "location"
                  : active
                    ? "page"
                    : undefined;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    aria-current={current}
                  >
                    {item.navigationLabel}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="mobile-menu-trigger"
                aria-label="Open navigation"
              >
                <Menu aria-hidden="true" />
                <span>Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sheet-title">Research sections</SheetTitle>
              <SheetDescription className="sheet-description">
                Navigate the working paper and its detailed methodology and
                results pages.
              </SheetDescription>
              <nav className="mobile-navigation" aria-label="Mobile navigation">
                <ol>
                  {publicResearchSections.map((item) => {
                    const active =
                      pathname === "/"
                        ? activeSection === item.id
                        : routeIsActive(pathname, item.id);
                    const href =
                      pathname !== "/" && active ? `/${item.id}` : item.href;
                    const current =
                      pathname === "/" && active
                        ? "location"
                        : active
                          ? "page"
                          : undefined;
                    return (
                      <li key={item.id}>
                        <SheetClose asChild>
                          <Link
                            href={href}
                            onClick={() => setOpen(false)}
                            aria-current={current}
                          >
                            <span>{item.index}</span>
                            {item.navigationLabel}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <div className="mobile-navigation__status">
                <span aria-hidden="true" />
                Cleaning in progress
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
