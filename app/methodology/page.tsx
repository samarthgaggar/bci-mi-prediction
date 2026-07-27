import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { SectionToc } from "@/components/section-toc";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  cleaningSteps,
  datasetFacts,
  limitations,
  methodologySections,
  plannedAnalysisLayers,
  protocolPhases,
  sourceReferences,
} from "@/lib/research-content";

export const metadata: Metadata = {
  title: "Methodology",
  description: methodologySections.intro.description,
};

const methodologyNavigation = [
  { id: methodologySections.boundary.id, label: "Scope boundary" },
  { id: methodologySections.protocol.id, label: "Original protocol" },
  { id: methodologySections.cleaning.id, label: "Cleaning protocol" },
  { id: methodologySections.analysis.id, label: "Planned analysis" },
  { id: methodologySections.limitations.id, label: "Documented exceptions" },
];

export default function MethodologyPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow={methodologySections.intro.eyebrow}
        title={methodologySections.intro.title}
        description={methodologySections.intro.description}
        status={methodologySections.intro.status}
        statusLabel={methodologySections.intro.statusLabel}
      />

      <section className="methodology-body">
        <div className="container methodology-layout">
          <aside className="methodology-layout__aside">
            <SectionToc items={methodologyNavigation} />
          </aside>

          <div className="methodology-content">
            <section
              className="method-section"
              id={methodologySections.boundary.id}
              aria-labelledby={`${methodologySections.boundary.id}-title`}
            >
              <SectionHeading
                eyebrow={methodologySections.boundary.eyebrow}
                title={methodologySections.boundary.title}
                description={methodologySections.boundary.description}
                id={`${methodologySections.boundary.id}-title`}
              />
              <dl className="scope-layers">
                <div>
                  <dt>Original study</dt>
                  <dd>
                    The published record defines the acquisition protocol and
                    available materials.
                  </dd>
                </div>
                <div>
                  <dt>Current project</dt>
                  <dd>
                    Conservative cleaning and traceability checks are in
                    progress.
                  </dd>
                </div>
                <div>
                  <dt>Future work</dt>
                  <dd>
                    Exploratory analysis, modeling, interpretation, and
                    publication remain pending.
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="method-section"
              id={methodologySections.protocol.id}
              aria-labelledby={`${methodologySections.protocol.id}-title`}
            >
              <SectionHeading
                eyebrow={methodologySections.protocol.eyebrow}
                title={methodologySections.protocol.title}
                description={methodologySections.protocol.description}
                id={`${methodologySections.protocol.id}-title`}
              />
              <div className="protocol-summary">
                <table>
                  <caption className="sr-only">
                    Original study acquisition sequence
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Phase</th>
                      <th scope="col">Record</th>
                      <th scope="col">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protocolPhases.map((phase) => (
                      <tr key={phase.label}>
                        <th scope="row">
                          <span>{phase.index}</span>
                          {phase.label}
                        </th>
                        <td data-label="Record">{phase.runs}</td>
                        <td data-label="Purpose">{phase.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="method-facts">
                {datasetFacts.map((fact) => (
                  <div key={fact.label}>
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                    <p>{fact.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="method-section"
              id={methodologySections.cleaning.id}
              aria-labelledby={`${methodologySections.cleaning.id}-title`}
            >
              <SectionHeading
                eyebrow={methodologySections.cleaning.eyebrow}
                title={methodologySections.cleaning.title}
                description={methodologySections.cleaning.description}
                id={`${methodologySections.cleaning.id}-title`}
              />
              <ol className="method-steps">
                {cleaningSteps.map((step) => (
                  <li key={step.index}>
                    <span>{step.index}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
              <div className="method-rule">
                <p>Non-negotiable boundary</p>
                <strong>
                  Raw GDF recordings, questionnaire values, and other
                  scientific source files remain unchanged.
                </strong>
              </div>
            </section>

            <section
              className="method-section"
              id={methodologySections.analysis.id}
              aria-labelledby={`${methodologySections.analysis.id}-title`}
            >
              <SectionHeading
                eyebrow={methodologySections.analysis.eyebrow}
                title={methodologySections.analysis.title}
                description={methodologySections.analysis.description}
                id={`${methodologySections.analysis.id}-title`}
              />
              <dl className="analysis-layers">
                {plannedAnalysisLayers.map((layer, index) => (
                  <div key={layer.label}>
                    <dt>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {layer.label}
                    </dt>
                    <dd>
                      <strong>{layer.title}</strong>
                      <p>{layer.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
              <Link href="/results" className="text-link">
                Review planned result formats
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>

            <section
              className="method-section"
              id={methodologySections.limitations.id}
              aria-labelledby={`${methodologySections.limitations.id}-title`}
            >
              <SectionHeading
                eyebrow={methodologySections.limitations.eyebrow}
                title={methodologySections.limitations.title}
                description={methodologySections.limitations.description}
                id={`${methodologySections.limitations.id}-title`}
              />
              <Accordion type="multiple" className="limitations-accordion">
                {limitations.map((item, index) => (
                  <AccordionItem key={item.title} value={`item-${index}`}>
                    <AccordionTrigger>
                      <span className="accordion-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>{item.description}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section className="method-sources" aria-labelledby="method-sources-title">
              <div>
                <p>Primary record</p>
                <h2 id="method-sources-title">Source materials</h2>
              </div>
              <div>
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
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
