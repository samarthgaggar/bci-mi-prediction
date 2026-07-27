"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, BrainCircuit, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  representativeImageDisclosure,
  type ResearchPortal,
} from "@/lib/research-portals";

interface RevealState {
  portal: ResearchPortal;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  phase: "expanding" | "revealing";
}

interface PageRevealContextValue {
  beginReveal: (portal: ResearchPortal, rect: DOMRect) => void;
  transitioningId: string | null;
}

const PageRevealContext = React.createContext<PageRevealContextValue | null>(
  null,
);

export function BciPageRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [reveal, setReveal] = React.useState<RevealState | null>(null);
  const timers = React.useRef<number[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  React.useEffect(() => clearTimers, [clearTimers]);

  const beginReveal = React.useCallback(
    (portal: ResearchPortal, rect: DOMRect) => {
      if (reveal) return;

      if (prefersReducedMotion) {
        router.push(portal.href);
        return;
      }

      clearTimers();
      setReveal({
        portal,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        phase: "expanding",
      });

      timers.current.push(
        window.setTimeout(() => {
          router.push(portal.href);
        }, 430),
        window.setTimeout(() => {
          setReveal((current) =>
            current ? { ...current, phase: "revealing" } : current,
          );
        }, 640),
        window.setTimeout(() => {
          setReveal(null);
        }, 1080),
      );
    },
    [clearTimers, prefersReducedMotion, reveal, router],
  );

  return (
    <PageRevealContext.Provider
      value={{
        beginReveal,
        transitioningId: reveal?.portal.id ?? null,
      }}
    >
      {children}
      <AnimatePresence>
        {reveal ? (
          <motion.div
            className="page-reveal-overlay"
            data-phase={reveal.phase}
            initial={{
              top: reveal.rect.top,
              left: reveal.rect.left,
              width: reveal.rect.width,
              height: reveal.rect.height,
              borderRadius: 2,
              opacity: 1,
            }}
            animate={
              reveal.phase === "expanding"
                ? {
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100dvh",
                    borderRadius: 0,
                    opacity: 1,
                  }
                : {
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100dvh",
                    borderRadius: 0,
                    opacity: 0,
                  }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: reveal.phase === "expanding" ? 0.5 : 0.38,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            role="status"
            aria-live="polite"
            aria-label={`Opening ${reveal.portal.title}`}
          >
            <motion.div
              className="page-reveal-overlay__image"
              animate={{
                scale: reveal.phase === "expanding" ? 1.06 : 1.14,
              }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Image
                src={reveal.portal.imageSrc}
                alt=""
                fill
                sizes="100vw"
                priority
                style={{ objectPosition: reveal.portal.objectPosition }}
              />
            </motion.div>
            <span className="page-reveal-overlay__veil" aria-hidden="true" />
            <div className="page-reveal-overlay__status">
              <span>Opening research page</span>
              <strong>{reveal.portal.title}</strong>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageRevealContext.Provider>
  );
}

export interface BciPageRevealProps {
  portals: ResearchPortal[];
  className?: string;
}

export function BciPageReveal({
  portals,
  className,
}: BciPageRevealProps) {
  const router = useRouter();
  const context = React.useContext(PageRevealContext);
  const [selectedId, setSelectedId] = React.useState(portals[0]?.id ?? "");
  const [failedImages, setFailedImages] = React.useState<Set<string>>(
    () => new Set(),
  );
  const selected =
    portals.find((portal) => portal.id === selectedId) ?? portals[0];

  React.useEffect(() => {
    portals.forEach((portal) => router.prefetch(portal.href));
  }, [portals, router]);

  if (!selected || !context) return null;

  const startReveal = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.KeyboardEvent<HTMLAnchorElement>,
  ) => {
    if (
      "button" in event &&
      (event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey)
    ) {
      return;
    }

    event.preventDefault();
    context.beginReveal(selected, event.currentTarget.getBoundingClientRect());
  };

  const imageFailed = failedImages.has(selected.id);
  const isTransitioning = context.transitioningId === selected.id;

  return (
    <section
      className={cn("research-portals", className)}
      aria-labelledby="research-portals-title"
      data-research-portals
      data-reduced-motion-fallback="route-navigation"
    >
      <div className="container">
        <div className="research-portals__heading">
          <div>
            <p>Research portals</p>
            <h2 id="research-portals-title">
              Enter the study through its evidence.
            </h2>
          </div>
          <p>
            Select a research area, then open its image to reveal the real page
            beneath it.
          </p>
        </div>

        <div className="research-portals__layout">
          <div className="research-portal">
            <Link
              className="research-portal__stage"
              href={selected.href}
              onClick={startReveal}
              onKeyDown={(event) => {
                if (event.key === " ") startReveal(event);
              }}
              onPointerEnter={() => router.prefetch(selected.href)}
              onFocus={() => router.prefetch(selected.href)}
              aria-label={`Enter ${selected.title}: ${selected.description}`}
              aria-busy={isTransitioning}
              data-research-portal={selected.id}
              data-representative-stock="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="research-portal__media"
                  key={selected.id}
                  initial={{ opacity: 0.35, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.2, scale: 1.01 }}
                  transition={{ duration: 0.24 }}
                >
                  {imageFailed ? (
                    <div
                      className="research-portal__fallback"
                      role="img"
                      aria-label={`Image unavailable. ${selected.imageAlt}`}
                    >
                      <BrainCircuit aria-hidden="true" />
                      <span>Representative BCI image unavailable</span>
                    </div>
                  ) : (
                    <Image
                      src={selected.imageSrc}
                      alt={selected.imageAlt}
                      fill
                      sizes="(max-width: 800px) 100vw, 76vw"
                      priority={selected.id === portals[0]?.id}
                      onError={() => {
                        setFailedImages((current) => {
                          const next = new Set(current);
                          next.add(selected.id);
                          return next;
                        });
                      }}
                      style={{ objectPosition: selected.objectPosition }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="research-portal__veil" aria-hidden="true" />
              <div className="research-portal__copy">
                <div>
                  <span>{selected.statusLabel}</span>
                  <h3>{selected.title}</h3>
                  <p>{selected.description}</p>
                </div>
                <span className="research-portal__action">
                  {isTransitioning
                    ? `Opening ${selected.title}`
                    : `Enter ${selected.title.toLowerCase()}`}
                  <ArrowRight aria-hidden="true" />
                </span>
              </div>
            </Link>

            <div className="research-portal__credit">
              <p>{representativeImageDisclosure}</p>
              <a
                href={selected.imageSourceHref}
                target="_blank"
                rel="noreferrer"
              >
                Photo: {selected.imageCredit}
                <ExternalLink aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="research-portal-selector" aria-label="Research areas">
            {portals.map((portal, index) => {
              const active = portal.id === selected.id;
              return (
                <button
                  key={portal.id}
                  type="button"
                  className="research-portal-selector__item"
                  data-active={active ? "true" : "false"}
                  aria-pressed={active}
                  onClick={() => setSelectedId(portal.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{portal.title}</strong>
                  <small>{portal.statusLabel}</small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
