"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useReducedMotion } from "motion/react";

import type { HeroBackdrop } from "@/lib/hero-backdrops";

const ROTATION_INTERVAL_MS = 6000;

export function RotatingBrainBackdrop({
  images,
}: {
  images: HeroBackdrop[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [failedImages, setFailedImages] = React.useState<Set<string>>(
    () => new Set(),
  );
  const availableImages = images.filter(
    (image) => !failedImages.has(image.id),
  );
  const activeImage =
    availableImages[activeIndex % Math.max(availableImages.length, 1)];

  React.useEffect(() => {
    if (prefersReducedMotion || availableImages.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % availableImages.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [availableImages.length, prefersReducedMotion]);

  return (
    <div
      className="home-backdrop"
      data-stock-backgrounds
      data-rotation-interval={ROTATION_INTERVAL_MS}
    >
      <div className="home-backdrop__media" aria-hidden="true">
        {availableImages.map((image, index) => {
          const isActive = image.id === activeImage?.id;

          return (
            <div
              className="home-backdrop__layer"
              data-active={isActive}
              key={image.id}
            >
              <Image
                src={image.imageSrc}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                style={{ objectPosition: image.objectPosition }}
                onError={() => {
                  setFailedImages((current) => {
                    const next = new Set(current);
                    next.add(image.id);
                    return next;
                  });
                  setActiveIndex(0);
                }}
              />
            </div>
          );
        })}
        <span className="home-backdrop__veil" />
      </div>

      {activeImage ? (
        <div className="home-backdrop__credit">
          <span aria-hidden="true">
            {String(
              availableImages.findIndex(
                (image) => image.id === activeImage.id,
              ) + 1,
            ).padStart(2, "0")}
            /{String(availableImages.length).padStart(2, "0")}
          </span>
          <a
            href={activeImage.sourceHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Stock brain visualization by ${activeImage.credit} on Unsplash`}
          >
            Representative stock visualization · {activeImage.credit}
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      ) : (
        <p className="home-backdrop__credit home-backdrop__credit--fallback">
          Representative brain visualization unavailable
        </p>
      )}
    </div>
  );
}
