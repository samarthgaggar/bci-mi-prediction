import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageIntro } from "@/components/page-intro";
import { ResultFigure } from "@/components/result-figure";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  publicationRequirements,
  resultPlaceholders,
  resultsSections,
} from "@/lib/research-content";

export const metadata: Metadata = {
  title: "Results",
  description: resultsSections.intro.description,
};

export default function ResultsPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow={resultsSections.intro.eyebrow}
        title={resultsSections.intro.title}
        description={resultsSections.intro.description}
        status={resultsSections.intro.status}
        statusLabel={resultsSections.intro.statusLabel}
      />

      <section className="results-page" aria-label="Planned result areas">
        <div className="container results-page__inner">
          <div className="results-notice" role="status">
            <p>Current evidence boundary</p>
            <strong>
              No research findings are displayed on this page. Cleaning,
              readiness validation, and analysis must be completed first.
            </strong>
          </div>

          <Tabs defaultValue="performance" className="results-tabs">
            <TabsList aria-label="Planned results views">
              {resultPlaceholders.map((figure) => (
                <TabsTrigger key={figure.id} value={figure.id}>
                  {figure.tabLabel}
                </TabsTrigger>
              ))}
            </TabsList>
            {resultPlaceholders.map((figure) => (
              <TabsContent key={figure.id} value={figure.id}>
                <ResultFigure figure={figure} />
              </TabsContent>
            ))}
          </Tabs>

          <section
            className="publication-gate"
            id={resultsSections.gate.id}
            aria-labelledby={`${resultsSections.gate.id}-title`}
          >
            <SectionHeading
              eyebrow={resultsSections.gate.eyebrow}
              title={resultsSections.gate.title}
              description={resultsSections.gate.description}
              id={`${resultsSections.gate.id}-title`}
            />
            <ol>
              {publicationRequirements.map((requirement, index) => (
                <li key={requirement.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{requirement.label}</p>
                  <strong>{requirement.title}</strong>
                </li>
              ))}
            </ol>
          </section>

          <div className="results-back">
            <p>
              The methodology page explains the acquisition record, cleaning
              protocol, and analytical boundary.
            </p>
            <Link href="/methodology" className="text-link">
              <ArrowLeft aria-hidden="true" />
              Return to methodology
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
