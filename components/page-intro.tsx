import { StatusBadge } from "@/components/status-badge";
import type { ResearchStatus } from "@/lib/research-content";

export function PageIntro({
  eyebrow,
  title,
  description,
  status,
  statusLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status: ResearchStatus;
  statusLabel: string;
}) {
  return (
    <section className="page-intro">
      <div className="container page-intro__inner">
        <p className="page-intro__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="page-intro__summary">
          <StatusBadge status={status} label={statusLabel} />
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
