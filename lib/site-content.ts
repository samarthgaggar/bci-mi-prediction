export type ResearchStatus =
  | "documented"
  | "validated"
  | "under-review"
  | "publication-gated";

export type SourceId =
  | "documentation-summary"
  | "post-clean-validation"
  | "zenodo"
  | "scientific-data";

export interface SourceReference {
  id: SourceId;
  label: string;
  href?: string;
  note: string;
}

export interface SiteSection {
  id:
    | "overview"
    | "dataset"
    | "pipeline"
    | "integrity"
    | "project-areas"
    | "evidence"
    | "faq";
  navigationLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  status: ResearchStatus;
  sourceRefs: SourceId[];
}

export interface ContentCard {
  title: string;
  description: string;
}

export const siteTitle =
  "BCI Performance Variability · The Data Miners";

export const siteDescription =
  "A source-traced research record studying performance variability in motor-imagery brain-computer interfaces.";

export const sourceReferences: SourceReference[] = [
  {
    id: "documentation-summary",
    label: "Dataset documentation summary",
    note: "Local synthesis of the study documents and database structure.",
  },
  {
    id: "post-clean-validation",
    label: "Post-clean validation",
    note: "Local validation report confirming preservation and traceability.",
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

export const sections: SiteSection[] = [
  {
    id: "overview",
    navigationLabel: "Overview",
    eyebrow: "Research overview",
    title: "Designing BCI research around the people behind the signals.",
    description:
      "This project studies why motor-imagery BCI performance varies across participants and how future systems might better account for that variation.",
    status: "documented",
    sourceRefs: ["documentation-summary", "scientific-data"],
  },
  {
    id: "dataset",
    navigationLabel: "Dataset",
    eyebrow: "Documented dataset",
    title: "A rich record of signals, sessions, and human variability.",
    description:
      "The Dreyer database combines physiological recordings, performance records, participant context, and documented exceptions in one research corpus.",
    status: "documented",
    sourceRefs: ["documentation-summary", "zenodo"],
  },
  {
    id: "pipeline",
    navigationLabel: "Pipeline",
    eyebrow: "Research workflow",
    title: "A complete path from preserved source to publishable evidence.",
    description:
      "Each stage has a defined boundary, provenance requirement, and review state. New modeling outputs stay under review until they are versioned.",
    status: "under-review",
    sourceRefs: ["documentation-summary", "post-clean-validation"],
  },
  {
    id: "integrity",
    navigationLabel: "Integrity",
    eyebrow: "Scientific integrity",
    title: "Focused on defensible evidence, not convenient conclusions.",
    description:
      "The workflow is designed to keep raw data immutable, surface exceptions, prevent leakage, and separate active analysis from public findings.",
    status: "validated",
    sourceRefs: ["documentation-summary", "post-clean-validation"],
  },
  {
    id: "project-areas",
    navigationLabel: "Project Areas",
    eyebrow: "Project areas",
    title: "What the research record helps readers understand.",
    description:
      "The site moves from a plain-language orientation to enough methodological detail for careful scientific review.",
    status: "documented",
    sourceRefs: ["documentation-summary", "scientific-data"],
  },
  {
    id: "evidence",
    navigationLabel: "Evidence",
    eyebrow: "Evidence notes",
    title: "The exceptions are part of the evidence.",
    description:
      "Missing runs, questionnaire losses, trigger differences, and published noise remain visible rather than being silently repaired.",
    status: "documented",
    sourceRefs: ["documentation-summary"],
  },
  {
    id: "faq",
    navigationLabel: "FAQ",
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    description:
      "A concise guide to the dataset, the research boundary, and the current publication state.",
    status: "publication-gated",
    sourceRefs: ["documentation-summary", "zenodo", "scientific-data"],
  },
];

export const overviewCards: ContentCard[] = [
  {
    title: "Participant Focused",
    description:
      "Performance is treated as a human-variability question, not only a model score. The research asks who benefits, who struggles, and what evidence could explain the difference.",
  },
  {
    title: "Clarity Driven",
    description:
      "Published study design, current project work, and future analysis are kept distinct so readers can tell what is documented, validated, under review, or still gated.",
  },
  {
    title: "Leakage Aware",
    description:
      "Participant boundaries and frozen decisions are central to the modeling plan, reducing the chance that information from evaluation data shapes development.",
  },
  {
    title: "Precision Crafted",
    description:
      "Every public statement must connect to a source artifact. Unknown values stay unknown, and documented anomalies remain part of the scientific record.",
  },
];

export const datasetMetrics = [
  {
    value: 87,
    suffix: "",
    label: "Anonymized participants",
    detail: "Cohorts A, B, and C",
  },
  {
    value: 694,
    suffix: "",
    label: "GDF recordings",
    detail: "Across baseline, acquisition, and online runs",
  },
  {
    value: 32,
    suffix: "",
    label: "Physiological channels",
    detail: "27 EEG, 3 EOG, and 2 EMG",
  },
  {
    value: 512,
    suffix: " Hz",
    label: "Sampling frequency",
    detail: "Documented acquisition rate",
  },
] as const;

export const pipelineStages = [
  {
    index: "01",
    title: "Dataset documentation",
    description: "Map participants, runs, channels, files, and known exceptions.",
    state: "Documented",
  },
  {
    index: "02",
    title: "Source preservation",
    description: "Keep the publisher corpus immutable and verify traceability.",
    state: "Validated",
  },
  {
    index: "03",
    title: "Analysis protocol",
    description: "Freeze participant boundaries, targets, and decision rules.",
    state: "Under review",
  },
  {
    index: "04",
    title: "Participant context",
    description: "Assess what pre-session characteristics can responsibly support.",
    state: "Under review",
  },
  {
    index: "05",
    title: "Spectral features",
    description: "Create cue-aligned EEG summaries with participant provenance.",
    state: "Under review",
  },
  {
    index: "06",
    title: "Linear baseline",
    description: "Establish a compact, interpretable EEG reference model.",
    state: "Under review",
  },
  {
    index: "07",
    title: "General neural model",
    description: "Evaluate a compact nonlinear model under grouped validation.",
    state: "Under review",
  },
  {
    index: "08",
    title: "Specialist routing",
    description: "Test whether a targeted pathway helps lower performers.",
    state: "Under review",
  },
  {
    index: "09",
    title: "Locked evaluation",
    description: "Protect the final comparison from post-test tuning.",
    state: "Under review",
  },
  {
    index: "10",
    title: "Reproducibility package",
    description: "Verify frozen artifacts before any public result is released.",
    state: "Publication gated",
  },
] as const;

export const integrityCards: ContentCard[] = [
  {
    title: "Raw stays raw",
    description:
      "Scientific recordings and source workbooks remain outside the website and are never rewritten to make the dataset look cleaner.",
  },
  {
    title: "Every change is traced",
    description:
      "Authorized formatting changes must preserve parsed values and connect each derived artifact back to its source.",
  },
  {
    title: "People stay grouped",
    description:
      "Participant-level boundaries prevent recordings from the same person appearing on both sides of a model evaluation.",
  },
  {
    title: "Findings stay gated",
    description:
      "Local modeling outputs are not public results. They remain explicitly under review until versioned and approved.",
  },
];

export const projectAreas: ContentCard[] = [
  {
    title: "Research Context",
    description:
      "Why performance variability matters for motor-imagery brain-computer interfaces.",
  },
  {
    title: "Dataset Record",
    description:
      "Who participated, what was recorded, and how the published corpus is organized.",
  },
  {
    title: "Acquisition Protocol",
    description:
      "The documented progression from baseline recordings to feedback-enabled online runs.",
  },
  {
    title: "Conservative Cleaning",
    description:
      "A preservation-first process that reports anomalies instead of guessing corrections.",
  },
  {
    title: "Analysis Workflow",
    description:
      "A leakage-aware plan for participant context, EEG features, and grouped evaluation.",
  },
  {
    title: "Results Gate",
    description:
      "A clear boundary between active local analysis and reviewed public scientific claims.",
  },
];

export const evidenceNotes = [
  {
    title: "A1 trigger structure",
    description:
      "Acquisition runs were reconstructed from a concatenated recording and lack end-of-trial and end-of-run triggers.",
    type: "Protocol exception",
  },
  {
    title: "A59 missing runs",
    description:
      "The participant did not complete online Runs 5 or 6, so their associated EEG recordings and filters are absent.",
    type: "Missing record",
  },
  {
    title: "Dataset B questionnaires",
    description:
      "Thirteen participants have documented questionnaire losses that remain missing in the research record.",
    type: "Documented loss",
  },
  {
    title: "C83 missing assets",
    description:
      "The ILS and 16PF5 questionnaire assets are documented as missing and are never reconstructed.",
    type: "Documented loss",
  },
  {
    title: "Published signal noise",
    description:
      "Noisy channels, noisy trials, and experimenter comments are intentionally retained for transparent analysis.",
    type: "Preserved evidence",
  },
] as const;

export const faqs = [
  {
    question: "What is this BCI project studying?",
    answer:
      "The project examines how motor-imagery BCI performance varies across participants and what evidence could eventually support responsible performance forecasting.",
  },
  {
    question: "What does the dataset contain?",
    answer:
      "The documented corpus covers 87 anonymized participants, 694 GDF recordings, 32 physiological channels, performance records, participant context, and study documentation.",
  },
  {
    question: "How are the original files protected?",
    answer:
      "The publisher corpus is treated as immutable. Raw recordings, workbooks, configuration files, and other scientific sources remain outside the website and are never silently corrected.",
  },
  {
    question: "Are modeling results public yet?",
    answer:
      "No. New local analysis artifacts are still unversioned and under review, so this site does not publish their metrics or present them as completed findings.",
  },
  {
    question: "Why are some records missing?",
    answer:
      "The source documentation identifies missing runs, questionnaire losses, trigger differences, and noisy recordings. Those exceptions are preserved because they affect interpretation.",
  },
  {
    question: "Where can I find the original sources?",
    answer:
      "The original database is available through Zenodo, and the acquisition protocol is described in the peer-reviewed Scientific Data article linked in the footer.",
  },
] as const;

export const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Overview", href: "#overview" },
      { label: "Dataset", href: "#dataset" },
      { label: "Integrity", href: "#integrity" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Pipeline", href: "#pipeline" },
      { label: "Project Areas", href: "#project-areas" },
      { label: "Evidence", href: "#evidence" },
    ],
  },
  {
    title: "Sources",
    links: [
      {
        label: "Zenodo record",
        href: "https://zenodo.org/records/8089820",
      },
      {
        label: "Scientific Data paper",
        href: "https://www.nature.com/articles/s41597-023-02445-z",
      },
      { label: "Publication status", href: "#faq" },
    ],
  },
] as const;
