import { StatusBadge } from "@/components/status-badge";
import type { ResultPlaceholder } from "@/lib/research-content";

const outputLabels: Record<
  ResultPlaceholder["intendedVisualizationType"],
  string
> = {
  distribution: "Distribution and uncertainty summary",
  comparison: "Documented comparative view",
  signal: "Signal-quality summary",
  spectrum: "Frequency-domain view",
};

const scaffoldMarkCount: Record<
  ResultPlaceholder["intendedVisualizationType"],
  number
> = {
  distribution: 7,
  comparison: 4,
  signal: 8,
  spectrum: 9,
};

export function ResultFigure({
  figure,
  compact = false,
}: {
  figure: ResultPlaceholder;
  compact?: boolean;
}) {
  const summaryId = `${figure.id}-accessibility-summary`;

  return (
    <article className="result-figure" data-compact={compact || undefined}>
      <header className="result-figure__header">
        <div>
          <p>Planned output</p>
          <h3>{figure.title}</h3>
        </div>
        <StatusBadge status={figure.status} label={figure.statusLabel} />
      </header>

      <p className="sr-only" id={summaryId}>
        {figure.accessibilitySummary}
      </p>

      <div
        className="result-figure__plot"
        data-kind={figure.intendedVisualizationType}
        aria-describedby={summaryId}
      >
        <div className="result-figure__scaffold" aria-hidden="true">
          {Array.from({
            length: scaffoldMarkCount[figure.intendedVisualizationType],
          }).map((_, index) => (
            <i key={`${figure.id}-mark-${index}`} />
          ))}
        </div>
        <div className="result-figure__overlay">
          <span>Awaiting verified analysis</span>
          <strong>{outputLabels[figure.intendedVisualizationType]}</strong>
        </div>
      </div>

      <footer className="result-figure__footer">
        <div>
          <span>Planned scope</span>
          <p>{figure.description}</p>
        </div>
        <div>
          <span>Required evidence</span>
          <p>{figure.intendedEvidence}</p>
        </div>
      </footer>
    </article>
  );
}
