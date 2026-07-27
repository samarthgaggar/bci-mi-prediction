export type ResearchStatus =
  | "draft"
  | "cleaning-in-progress"
  | "analysis-pending"
  | "results-pending"
  | "verified";

export interface SourceReference {
  id: string;
  label: string;
  href?: string;
  note: string;
}

export interface DatasetFact {
  value: string;
  label: string;
  detail: string;
  sourceRef: SourceReference["id"];
}

export type ResearchVisualizationType =
  | "editorial-copy"
  | "definition-list"
  | "protocol-table"
  | "sticky-pipeline"
  | "ruled-placeholder"
  | "roadmap"
  | "accordion"
  | "publication-gate";

export interface ResearchSection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  status: ResearchStatus;
  statusLabel: string;
  sourceRefs: SourceReference["id"][];
  accessibilitySummary: string;
  intendedVisualizationType: ResearchVisualizationType;
}

export interface PublicResearchSection extends ResearchSection {
  index: string;
  navigationLabel:
    | "Background"
    | "Methodology"
    | "Data Science Pipeline"
    | "Results"
    | "Future Directions";
  href: string;
}

export interface ResearchStage {
  id: string;
  index: string;
  title: string;
  status: ResearchStatus;
  stateLabel: string;
  description: string;
  nextRequirement: string;
}

export interface ResultPlaceholder {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  status: "results-pending";
  statusLabel: string;
  intendedVisualizationType:
    | "distribution"
    | "comparison"
    | "signal"
    | "spectrum";
  accessibilitySummary: string;
  intendedEvidence: string;
  sourceRefs: SourceReference["id"][];
}

export const siteTitle =
  "Quantifying and Forecasting Performance Variability in Motor Imagery Brain-Computer Interfaces";

export const sourceReferences: SourceReference[] = [
  {
    id: "documentation-summary",
    label: "Dataset documentation summary",
    note: "Local synthesis of the study documents and database structure.",
  },
  {
    id: "zenodo",
    label: "Dreyer et al. BCI Database",
    href: "https://zenodo.org/records/8089820",
    note: "Original public dataset record.",
  },
  {
    id: "scientific-data",
    label: "Scientific Data descriptor",
    href: "https://www.nature.com/articles/s41597-023-02445-z",
    note: "Peer-reviewed description of the acquisition protocol.",
  },
];

export const paperMasthead = {
  publication: "BCI performance variability study",
  title: siteTitle,
  byline: "The Data Miners",
  status: "cleaning-in-progress" as const,
  statusLabel: "Research in progress · cleaning in progress",
  description:
    "This project examines variation in motor-imagery BCI performance and the feasibility of forecasting future performance. The database is documented; cleaning is in progress; exploratory analysis and results are pending.",
  abstract:
    "The current site records the research question, documented study design, planned data-science workflow, and publication criteria. It does not present findings.",
} as const;

export const publicResearchSections: PublicResearchSection[] = [
  {
    id: "background",
    index: "01",
    navigationLabel: "Background",
    href: "/#background",
    eyebrow: "Research context",
    title: "Background",
    description:
      "The project asks how performance varies across participants and system stages, and whether that variation can later be forecast from documented evidence.",
    status: "draft",
    statusLabel: "Research question defined",
    sourceRefs: ["documentation-summary", "scientific-data"],
    accessibilitySummary:
      "Research question, evidence boundary, and documented dataset facts.",
    intendedVisualizationType: "definition-list",
  },
  {
    id: "methodology",
    index: "02",
    navigationLabel: "Methodology",
    href: "/#methodology",
    eyebrow: "Study design",
    title: "Methodology",
    description:
      "The original acquisition protocol is documented separately from the team’s current cleaning and future analytical work.",
    status: "verified",
    statusLabel: "Protocol documented",
    sourceRefs: ["documentation-summary", "scientific-data"],
    accessibilitySummary:
      "Summary of the original protocol and a link to the detailed methodology.",
    intendedVisualizationType: "protocol-table",
  },
  {
    id: "data-science-pipeline",
    index: "03",
    navigationLabel: "Data Science Pipeline",
    href: "/#data-science-pipeline",
    eyebrow: "Project workflow",
    title: "Data Science Pipeline",
    description:
      "The workflow keeps the publisher corpus read-only and requires traceability before analysis or publication.",
    status: "cleaning-in-progress",
    statusLabel: "Cleaning in progress",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "A sequential pipeline from source preservation to verified publication.",
    intendedVisualizationType: "sticky-pipeline",
  },
  {
    id: "results",
    index: "04",
    navigationLabel: "Results",
    href: "/#results",
    eyebrow: "Evidence",
    title: "Results",
    description:
      "No findings are available. The planned result areas remain empty until reproducible analysis and validation are complete.",
    status: "results-pending",
    statusLabel: "Awaiting verified analysis",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Compact placeholders for future verified analyses with no synthetic values.",
    intendedVisualizationType: "ruled-placeholder",
  },
  {
    id: "future-directions",
    index: "05",
    navigationLabel: "Future Directions",
    href: "/#future-directions",
    eyebrow: "Planned work",
    title: "Future Directions",
    description:
      "The next milestones begin with cleaning and validation, followed by descriptive, explanatory, and forecasting analyses.",
    status: "analysis-pending",
    statusLabel: "Future work",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Four ordered future milestones, all explicitly pending or in progress.",
    intendedVisualizationType: "roadmap",
  },
];

export const datasetFacts: DatasetFact[] = [
  {
    value: "87",
    label: "Anonymized participants",
    detail: "Cohorts A, B, and C",
    sourceRef: "documentation-summary",
  },
  {
    value: "40",
    label: "Trials per imagery run",
    detail: "20 left-hand and 20 right-hand trials",
    sourceRef: "documentation-summary",
  },
  {
    value: "32",
    label: "Physiological channels",
    detail: "27 EEG, 3 EOG, and 2 EMG",
    sourceRef: "documentation-summary",
  },
  {
    value: "512 Hz",
    label: "Sampling frequency",
    detail: "Documented acquisition rate",
    sourceRef: "documentation-summary",
  },
];

export const backgroundNotes = [
  {
    term: "Research question",
    detail:
      "How does motor-imagery BCI performance vary across participants and system stages, and what evidence could support forecasting?",
  },
  {
    term: "Dataset context",
    detail:
      "Each participant attended one session containing baseline, acquisition, and online recordings.",
  },
  {
    term: "Evidence boundary",
    detail:
      "Acquisition facts are documented. Cleaning, validation, analysis, and interpretation are not presented as completed work.",
  },
] as const;

export const methodologySections = {
  intro: {
    id: "methodology",
    eyebrow: "Methodology",
    title: "Documented protocol and planned analysis",
    description:
      "The acquisition protocol is established. Cleaning is in progress, and exploratory analysis will begin only after a documented readiness gate.",
    status: "cleaning-in-progress",
    statusLabel: "Cleaning in progress",
    sourceRefs: ["documentation-summary", "scientific-data"],
    accessibilitySummary:
      "Introduction separating the original study protocol from current and future project work.",
    intendedVisualizationType: "editorial-copy",
  },
  boundary: {
    id: "scope-boundary",
    eyebrow: "Scope boundary",
    title: "Three distinct layers",
    description:
      "Original protocol describes acquisition. Current methodology governs conservative cleaning. Planned analysis describes work that has not yet begun.",
    status: "cleaning-in-progress",
    statusLabel: "Boundary documented",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Statement separating acquisition, cleaning, and planned analysis.",
    intendedVisualizationType: "definition-list",
  },
  protocol: {
    id: "original-protocol",
    eyebrow: "Original study",
    title: "Acquisition protocol",
    description:
      "A complete participant record moves from reference recordings to calibration and feedback-enabled online runs.",
    status: "verified",
    statusLabel: "Protocol documented",
    sourceRefs: ["documentation-summary", "scientific-data"],
    accessibilitySummary:
      "Sequential table of baseline, acquisition, and online recordings.",
    intendedVisualizationType: "protocol-table",
  },
  cleaning: {
    id: "cleaning-plan",
    eyebrow: "Current project",
    title: "Cleaning protocol",
    description:
      "Only authorized formatting changes may occur, with parsed values and scientific files preserved.",
    status: "cleaning-in-progress",
    statusLabel: "Cleaning in progress",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Four-step conservative cleaning procedure.",
    intendedVisualizationType: "protocol-table",
  },
  analysis: {
    id: "planned-analysis",
    eyebrow: "Future project",
    title: "Planned analysis",
    description:
      "Descriptive, explanatory, and forecasting work remains pending until readiness is established.",
    status: "analysis-pending",
    statusLabel: "Analysis pending",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Three planned analytical layers with no current findings.",
    intendedVisualizationType: "definition-list",
  },
  limitations: {
    id: "limitations",
    eyebrow: "Dataset notes",
    title: "Documented exceptions",
    description:
      "Missing runs, questionnaire losses, trigger differences, and published noise remain part of the record.",
    status: "verified",
    statusLabel: "Constraints documented",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Expandable list of documented exceptions that future analysis must retain.",
    intendedVisualizationType: "accordion",
  },
} satisfies Record<string, ResearchSection>;

export const protocolPhases = [
  {
    index: "01",
    label: "Baseline",
    runs: "Two recordings",
    detail: "Eyes-open and eyes-closed reference recordings.",
  },
  {
    index: "02",
    label: "Acquisition",
    runs: "Runs R1–R2",
    detail: "Motor-imagery trials used to establish the participant-specific system.",
  },
  {
    index: "03",
    label: "Online",
    runs: "Runs R3–R6",
    detail: "Feedback-enabled motor-imagery runs for a complete participant record.",
  },
] as const;

export const cleaningSteps = [
  {
    index: "01",
    title: "Preserve source data",
    description:
      "Keep the publisher corpus immutable and separate from derived artifacts.",
  },
  {
    index: "02",
    title: "Inventory the record",
    description:
      "Map participants, runs, documentation, file types, and known exceptions.",
  },
  {
    index: "03",
    title: "Constrain transformations",
    description:
      "Limit cleaning to authorized encoding and line-ending changes.",
  },
  {
    index: "04",
    title: "Verify traceability",
    description:
      "Require documented integrity checks before exploratory work begins.",
  },
] as const;

export const plannedAnalysisLayers = [
  {
    label: "Descriptive",
    title: "Characterize observed variability",
    description:
      "Participant and run summaries, distributions, and uncertainty remain pending.",
  },
  {
    label: "Explanatory",
    title: "Investigate supported contributors",
    description:
      "Cohort, signal, questionnaire, and protocol context will be used only where documentation supports comparison.",
  },
  {
    label: "Forecasting",
    title: "Evaluate out-of-sample prediction",
    description:
      "Model design, evaluation, and uncertainty reporting are future work.",
  },
] as const;

export const limitations = [
  {
    title: "Participant A1",
    description:
      "Acquisition runs were reconstructed from a concatenated recording and lack end-of-trial and end-of-run triggers.",
  },
  {
    title: "Participant A59",
    description:
      "Online runs R5 and R6 were not completed; associated recordings and filters are absent.",
  },
  {
    title: "Frequency-band selection",
    description:
      "A9 and A11 used only R1 for selection, while both acquisition recordings remain present.",
  },
  {
    title: "Questionnaire availability",
    description:
      "Thirteen Dataset B participants have documented losses; C83 has documented ILS and 16PF5 losses.",
  },
  {
    title: "Published noise and notes",
    description:
      "Noisy channels, trials, and experimenter comments are part of the record and must not be silently removed.",
  },
] as const;

export const researchStages: ResearchStage[] = [
  {
    id: "source",
    index: "01",
    title: "Preserve source corpus",
    status: "verified",
    stateLabel: "Source available",
    description: "Publisher materials remain read-only inputs.",
    nextRequirement: "Maintain separation from derived artifacts.",
  },
  {
    id: "documentation",
    index: "02",
    title: "Map documentation",
    status: "verified",
    stateLabel: "Source mapped",
    description: "Study structure and documented exceptions are recorded.",
    nextRequirement: "Retain every exception during preparation.",
  },
  {
    id: "cleaning",
    index: "03",
    title: "Clean conservatively",
    status: "cleaning-in-progress",
    stateLabel: "Cleaning in progress",
    description: "Authorized formatting checks continue.",
    nextRequirement: "Preserve parsed values and scientific content.",
  },
  {
    id: "validation",
    index: "04",
    title: "Validate readiness",
    status: "analysis-pending",
    stateLabel: "Validation pending",
    description: "Traceability must be established before analysis.",
    nextRequirement: "Pass the documented readiness gate.",
  },
  {
    id: "analysis",
    index: "05",
    title: "Perform analysis",
    status: "analysis-pending",
    stateLabel: "Analysis pending",
    description: "Exploratory and forecasting work has not begun.",
    nextRequirement: "Produce reproducible analytical artifacts.",
  },
  {
    id: "publication",
    index: "06",
    title: "Publish findings",
    status: "results-pending",
    stateLabel: "Results pending",
    description: "The public results area remains empty.",
    nextRequirement: "Verify evidence, uncertainty, and limitations.",
  },
];

export const futureDirections = [
  {
    index: "01",
    title: "Complete cleaning and validation",
    description:
      "Finish the authorized preparation workflow and document the readiness decision.",
    status: "cleaning-in-progress" as const,
    statusLabel: "Current priority",
  },
  {
    index: "02",
    title: "Describe performance variability",
    description:
      "Summarize participant and run-level variation with appropriate uncertainty.",
    status: "analysis-pending" as const,
    statusLabel: "Planned",
  },
  {
    index: "03",
    title: "Investigate supported contributors",
    description:
      "Evaluate documented cohort, signal, and protocol context without over-interpreting association.",
    status: "analysis-pending" as const,
    statusLabel: "Planned",
  },
  {
    index: "04",
    title: "Evaluate forecasting models",
    description:
      "Test future models out of sample and report uncertainty and limitations.",
    status: "results-pending" as const,
    statusLabel: "Evidence required",
  },
] as const;

export const resultsSections = {
  intro: {
    id: "results",
    eyebrow: "Results",
    title: "Results pending",
    description:
      "Cleaning and validation are not complete. The frames below describe planned outputs without values or conclusions.",
    status: "results-pending",
    statusLabel: "Awaiting verified analysis",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Introduction stating that no research findings are available.",
    intendedVisualizationType: "editorial-copy",
  },
  gate: {
    id: "publication-gate",
    eyebrow: "Publication criteria",
    title: "Requirements for a verified result",
    description:
      "A placeholder may be replaced only when its analysis, validation, and interpretation are documented.",
    status: "results-pending",
    statusLabel: "Evidence required",
    sourceRefs: ["documentation-summary"],
    accessibilitySummary:
      "Three requirements for replacing a placeholder with a verified result.",
    intendedVisualizationType: "publication-gate",
  },
} satisfies Record<string, ResearchSection>;

export const publicationRequirements = [
  {
    label: "Reproducible artifact",
    title: "Versioned notebook or analysis script",
  },
  {
    label: "Validation record",
    title: "Documented checks, assumptions, and caveats",
  },
  {
    label: "Interpretive boundary",
    title: "Clear separation of observation and inference",
  },
] as const;

export const resultPlaceholders: ResultPlaceholder[] = [
  {
    id: "performance",
    tabLabel: "Performance",
    title: "Performance variability",
    description:
      "Reserved for verified participant- and run-level outcomes with uncertainty.",
    status: "results-pending",
    statusLabel: "Results pending",
    intendedVisualizationType: "distribution",
    accessibilitySummary:
      "Empty frame reserved for verified performance variability results.",
    intendedEvidence: "Reproducible analysis and uncertainty notes",
    sourceRefs: ["documentation-summary"],
  },
  {
    id: "cohorts",
    tabLabel: "Cohorts",
    title: "Cohort context",
    description:
      "Reserved for comparisons supported by documented grouping logic.",
    status: "results-pending",
    statusLabel: "Results pending",
    intendedVisualizationType: "comparison",
    accessibilitySummary:
      "Empty frame reserved for verified cohort comparisons.",
    intendedEvidence: "Documented grouping logic and comparative analysis",
    sourceRefs: ["documentation-summary"],
  },
  {
    id: "signal-quality",
    tabLabel: "Signal quality",
    title: "Signal-quality context",
    description:
      "Reserved for validated signal-quality evidence and documented caveats.",
    status: "results-pending",
    statusLabel: "Results pending",
    intendedVisualizationType: "signal",
    accessibilitySummary:
      "Empty frame reserved for verified signal-quality context.",
    intendedEvidence: "Documented quality rules and signal summaries",
    sourceRefs: ["documentation-summary"],
  },
  {
    id: "frequency-bands",
    tabLabel: "Frequency bands",
    title: "Frequency-band analysis",
    description:
      "Reserved for reproducible spectral analysis and its limitations.",
    status: "results-pending",
    statusLabel: "Results pending",
    intendedVisualizationType: "spectrum",
    accessibilitySummary:
      "Empty frame reserved for verified frequency-band analysis.",
    intendedEvidence: "Validated selection artifacts and spectral analysis",
    sourceRefs: ["documentation-summary"],
  },
];
