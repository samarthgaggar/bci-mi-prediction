import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  publicResearchSections,
  sourceReferences,
} from "@/lib/research-content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__project">
          <p>The Data Miners</p>
          <strong>BCI performance variability study</strong>
          <span>
            Working research interface. Individual author credits forthcoming.
          </span>
        </div>

        <nav aria-label="Research sections">
          <p>Sections</p>
          {publicResearchSections.map((section) => (
            <Link key={section.id} href={section.href}>
              {section.navigationLabel}
            </Link>
          ))}
        </nav>

        <div className="site-footer__sources">
          <p>Primary sources</p>
          {sourceReferences
            .filter((source) => source.href)
            .map((source) => (
              <a
                key={source.id}
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
        </div>
      </div>
      <div className="container site-footer__base">
        <span>Research in progress</span>
        <span>No findings are currently published</span>
      </div>
    </footer>
  );
}
