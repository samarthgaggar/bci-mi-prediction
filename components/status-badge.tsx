import type { ResearchStatus } from "@/lib/research-content";
import { cn } from "@/lib/utils";

const statusLabels: Record<ResearchStatus, string> = {
  draft: "Draft",
  "cleaning-in-progress": "Cleaning in progress",
  "analysis-pending": "Analysis pending",
  "results-pending": "Results pending",
  verified: "Source verified",
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: ResearchStatus;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("status-label", className)}
      data-status={status}
    >
      <span className="status-label__mark" aria-hidden="true" />
      {label ?? statusLabels[status]}
    </span>
  );
}
