"use client";

import * as React from "react";

export interface TableOfContentsItem {
  id: string;
  label: string;
}

export function SectionToc({ items }: { items: TableOfContentsItem[] }) {
  const [activeId, setActiveId] = React.useState(items[0]?.id ?? "");

  React.useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="section-toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
