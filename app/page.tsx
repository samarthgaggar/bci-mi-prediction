import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ResultFigure } from "@/components/result-figure";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { StatusBadge } from "@/components/status-badge";
import { BciPageReveal } from "@/components/ui/bci-page-reveal";
import {
  backgroundNotes,
  datasetFacts,
  futureDirections,
  paperMasthead,
  protocolPhases,
  publicResearchSections,
  researchStages,
  resultPlaceholders,
  sourceReferences,
} from "@/lib/research-content";
import { researchPortals } from "@/lib/research-portals";

const [
  backgroundSection,
  methodologySection,
  pipelineSection,
  resultsSection,
  futureSection,
] = publicResearchSections;

export default function Home() {
  return (
    <main id="main-content">
      <section className="paper-masthead" aria-labelledby="paper-title">
        <div className="container paper-masthead__inner">
          <div className="paper-masthead__meta">
            <p>{paperMasthead.publication}</p>
            <StatusBadge
              status={paperMasthead.status}
              label={paperMasthead.statusLabel}
            />
          </div>

          <h1 id="paper-title">{paperMasthead.title}</h1>

          <div className="paper-masthead__summary">
            <div className="paper-masthead__byline">
              <span>Working paper</span>
              <p>
                Research by <strong>{paperMasthead.byline}</strong>
              </p>
              <Link href="/methodology" className="text-link">
                Read the full methodology
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="paper-masthead__abstract">
              <p>Abstract</p>
              <strong>{paperMasthead.description}</strong>
              <span>{paperMasthead.abstract}</span>
            </div>
          </div>
        </div>
      </section>

      <BciPageReveal portals={researchPortals} />

      <section
        className="paper-section paper-section--background"
        id={backgroundSection.id}
        aria-labelledby={`${backgroundSection.id}-title`}
      >
        <div className="container">
          <SectionHeading
            index={backgroundSection.index}
            eyebrow={backgroundSection.eyebrow}
            title={backgroundSection.title}
            description={backgroundSection.description}
            id={`${backgroundSection.id}-title`}
          />

          <div className="background-layout">
            <dl className="research-definitions">
              {backgroundNotes.map((note) => (
                <div key={note.term}>
                  <dt>{note.term}</dt>
                  <dd>{note.detail}</dd>
                </div>
              ))}
            </dl>

            <aside className="study-record" aria-labelledby="study-record-title">
              <div className="study-record__heading">
                <p>Documented dataset snapshot</p>
                <h3 id="study-record-title">Acquisition record</h3>
              </div>
              <dl>
                {datasetFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>
                      <strong>{fact.value}</strong>
                      <span>{fact.detail}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="source-note">
                Source: local documentation summary. These describe acquisition,
                not analytical findings.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="paper-section paper-section--methodology"
        id={methodologySection.id}
        aria-labelledby={`${methodologySection.id}-title`}
      >
        <div className="container">
          <SectionHeading
            index={methodologySection.index}
            eyebrow={methodologySection.eyebrow}
            title={methodologySection.title}
            description={methodologySection.description}
            id={`${methodologySection.id}-title`}
          />

          <div className="protocol-summary">
            <table>
              <caption className="sr-only">
                Documented sequence of the original acquisition protocol
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
            <div className="section-link">
              <p>
                The detailed page separates the published protocol from current
                cleaning and future analysis.
              </p>
              <Link href="/methodology" className="text-link">
                Read the full methodology
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="paper-section pipeline-section"
        id={pipelineSection.id}
        aria-labelledby={`${pipelineSection.id}-title`}
      >
        <div className="container pipeline-layout">
          <div className="pipeline-layout__heading">
            <SectionHeading
              index={pipelineSection.index}
              eyebrow={pipelineSection.eyebrow}
              title={pipelineSection.title}
              description={pipelineSection.description}
              id={`${pipelineSection.id}-title`}
            />
            <StatusBadge
              status={pipelineSection.status}
              label={pipelineSection.statusLabel}
            />
          </div>

          <ol className="pipeline-list">
            {researchStages.map((stage) => (
              <li key={stage.id}>
                <span className="pipeline-list__index">{stage.index}</span>
                <div className="pipeline-list__stage">
                  <h3>{stage.title}</h3>
                  <StatusBadge
                    status={stage.status}
                    label={stage.stateLabel}
                  />
                </div>
                <div className="pipeline-list__detail">
                  <p>{stage.description}</p>
                  <span>Next: {stage.nextRequirement}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="paper-section paper-section--results"
        id={resultsSection.id}
        aria-labelledby={`${resultsSection.id}-title`}
      >
        <div className="container">
          <SectionHeading
            index={resultsSection.index}
            eyebrow={resultsSection.eyebrow}
            title={resultsSection.title}
            description={resultsSection.description}
            id={`${resultsSection.id}-title`}
          />

          <div className="results-preview">
            {resultPlaceholders.slice(0, 2).map((figure) => (
              <ResultFigure key={figure.id} figure={figure} compact />
            ))}
          </div>
          <div className="section-link">
            <p>
              All four planned result areas are available as explicitly empty
              frames.
            </p>
            <Link href="/results" className="text-link">
              Review planned results
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="paper-section paper-section--future"
        id={futureSection.id}
        aria-labelledby={`${futureSection.id}-title`}
      >
        <div className="container">
          <SectionHeading
            index={futureSection.index}
            eyebrow={futureSection.eyebrow}
            title={futureSection.title}
            description={futureSection.description}
            id={`${futureSection.id}-title`}
          />

          <ol className="future-list">
            {futureDirections.map((direction) => (
              <li key={direction.index}>
                <span>{direction.index}</span>
                <div>
                  <h3>{direction.title}</h3>
                  <p>{direction.description}</p>
                </div>
                <StatusBadge
                  status={direction.status}
                  label={direction.statusLabel}
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="references" id="references" aria-labelledby="references-title">
        <div className="container references__inner">
          <div>
            <p>Research record</p>
            <h2 id="references-title">References</h2>
          </div>
          <ol>
            {sourceReferences.map((source, index) => (
              <li key={source.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{source.label}</strong>
                  <p>{source.note}</p>
                </div>
                {source.href ? (
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${source.label} in a new tab`}
                  >
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
