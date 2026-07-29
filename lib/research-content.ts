export type JourneyStatus = "verified" | "process" | "pending";

export type Metric = {
  value: string;
  label: string;
  detail: string;
};

export type SourceReference = {
  label: string;
  href: string;
};

export type CameraCue = {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  highlight: "whole" | "left" | "deep" | "network" | "out";
};

export type JourneyStop = {
  id: string;
  navLabel: string;
  eyebrow: string;
  question: string;
  simpleAnswer: string;
  technicalDetail: string;
  status: JourneyStatus;
  statusLabel: string;
  side: "left" | "right" | "center";
  camera: CameraCue;
  metrics?: readonly Metric[];
  sources: readonly SourceReference[];
};

export const primarySources = {
  zenodo: {
    label: "Zenodo dataset record",
    href: "https://zenodo.org/records/8089820",
  },
  paper: {
    label: "Scientific Data descriptor",
    href: "https://www.nature.com/articles/s41597-023-02445-z",
  },
} as const satisfies Record<string, SourceReference>;

export const journeyStops: readonly JourneyStop[] = [
  {
    id: "start",
    navLabel: "Start",
    eyebrow: "A journey through brain signals",
    question: "Can computers read minds?",
    simpleAnswer:
      "Not quite. A brain–computer interface listens for tiny electrical patterns and learns what those signals may mean.",
    technicalDetail:
      "This project studies motor imagery: measurable changes in brain activity while a person imagines moving their left or right hand. The system never receives private thoughts, memories, or inner speech.",
    status: "verified",
    statusLabel: "Plain-language orientation",
    side: "left",
    camera: {
      position: [0, 0, 7.8],
      target: [0, 0, 0],
      highlight: "whole",
    },
    sources: [primarySources.paper],
  },
  {
    id: "background",
    navLabel: "Why",
    eyebrow: "Stop 01 · Background",
    question: "What are we listening for?",
    simpleAnswer:
      "When you imagine a movement, groups of brain cells change rhythm. EEG sensors can measure part of that change from the scalp.",
    technicalDetail:
      "The study focuses on left- versus right-hand motor imagery. These patterns are subtle, vary across people, and can change from run to run—so a useful model must generalize beyond the people it learned from.",
    status: "verified",
    statusLabel: "Source-backed context",
    side: "right",
    camera: {
      position: [2.45, 0.55, 5.2],
      target: [-0.7, 0.3, 0],
      highlight: "left",
    },
    sources: [primarySources.paper],
  },
  {
    id: "dataset",
    navLabel: "Dataset",
    eyebrow: "Stop 02 · Dataset",
    question: "How much did the researchers record?",
    simpleAnswer:
      "Eighty-seven volunteers completed one session each, producing hundreds of carefully documented recordings.",
    technicalDetail:
      "The published corpus contains participant groups A1–A60, B61–B81, and C82–C87. A complete motor-imagery run contains 40 trials: 20 left-hand and 20 right-hand trials.",
    status: "verified",
    statusLabel: "Verified dataset facts",
    side: "left",
    camera: {
      position: [-2.25, 0.15, 4.7],
      target: [0.6, 0, 0],
      highlight: "deep",
    },
    metrics: [
      {
        value: "87",
        label: "participants",
        detail: "60 in A, 21 in B, and 6 in C",
      },
      {
        value: "694",
        label: "GDF recordings",
        detail: "published electrophysiology files",
      },
      {
        value: "32",
        label: "signal channels",
        detail: "27 EEG · 3 EOG · 2 EMG",
      },
      {
        value: "512 Hz",
        label: "sampling rate",
        detail: "512 measurements each second",
      },
    ],
    sources: [primarySources.zenodo, primarySources.paper],
  },
  {
    id: "method",
    navLabel: "Method",
    eyebrow: "Stop 03 · Acquisition",
    question: "What did one session look like?",
    simpleAnswer:
      "People rested, followed visual cues, imagined hand movements, and then received feedback as the system learned.",
    technicalDetail:
      "The documented complete structure includes two baseline recordings, acquisition runs R1–R2, and online runs R3–R6. Exceptions—such as missing runs or trigger differences—remain part of the record rather than being silently repaired.",
    status: "verified",
    statusLabel: "Documented protocol",
    side: "right",
    camera: {
      position: [0.55, -0.45, 3.9],
      target: [0, 0.15, 0],
      highlight: "deep",
    },
    metrics: [
      {
        value: "40",
        label: "trials per MI run",
        detail: "for a complete run",
      },
      {
        value: "20 + 20",
        label: "balanced cues",
        detail: "left-hand and right-hand imagery",
      },
    ],
    sources: [primarySources.paper, primarySources.zenodo],
  },
  {
    id: "integrity",
    navLabel: "Integrity",
    eyebrow: "Stop 04 · Cleaning",
    question: "How do we protect the evidence?",
    simpleAnswer:
      "We keep the original science untouched, make only authorized changes, and leave a trail that can be checked.",
    technicalDetail:
      "Scientific measurements, identifiers, spreadsheets, questionnaires, and configuration files remain unchanged. Authorized text normalization must preserve parsed cells exactly; known noisy channels, trial notes, and missing assets are documented—not guessed away.",
    status: "verified",
    statusLabel: "Post-clean validation passed",
    side: "left",
    camera: {
      position: [-1.65, 0.65, 4.15],
      target: [0.35, -0.1, 0],
      highlight: "network",
    },
    metrics: [
      {
        value: "1,073",
        label: "raw files checked",
        detail: "against the immutable source",
      },
      {
        value: "1,068",
        label: "cleaned files found",
        detail: "the expected web-independent output set",
      },
      {
        value: "0",
        label: "missing or unexpected",
        detail: "cleaned files in validation",
      },
      {
        value: "0",
        label: "failed traceability rows",
        detail: "participant IDs preserved",
      },
    ],
    sources: [primarySources.zenodo],
  },
  {
    id: "pipeline",
    navLabel: "Pipeline",
    eyebrow: "Stop 05 · Data science",
    question: "How does a signal become a prediction?",
    simpleAnswer:
      "The work moves through a locked sequence: understand, verify, prepare, measure, train, and test.",
    technicalDetail:
      "The analysis policy separates participants across development and evaluation, controls information leakage, and reserves the locked test for a one-time final check. Public claims stay gated until their artifacts are approved and versioned.",
    status: "process",
    statusLabel: "Protocol defined · results gated",
    side: "right",
    camera: {
      position: [1.8, 0.35, 4.2],
      target: [-0.35, 0, 0],
      highlight: "network",
    },
    sources: [primarySources.paper],
  },
  {
    id: "results",
    navLabel: "Results",
    eyebrow: "Stop 06 · Results status",
    question: "What did the models find?",
    simpleAnswer:
      "The evaluation artifacts exist locally, but they are not yet approved for public reporting.",
    technicalDetail:
      "Model comparisons, performance distributions, spectral findings, and subgroup analyses will appear here only after the corresponding outputs are reviewed, versioned, and traceable to the locked protocol.",
    status: "pending",
    statusLabel: "Awaiting verified analysis",
    side: "left",
    camera: {
      position: [-1.9, -0.45, 4.45],
      target: [0.5, 0.15, 0],
      highlight: "network",
    },
    sources: [primarySources.zenodo, primarySources.paper],
  },
  {
    id: "future",
    navLabel: "Limits",
    eyebrow: "Stop 07 · Limits & next steps",
    question: "What should we stay cautious about?",
    simpleAnswer:
      "Brain signals are noisy, people differ, and one dataset cannot answer every question.",
    technicalDetail:
      "The study covers one session per participant and a specific left/right motor-imagery task. Future work should test robustness across sessions, equipment, settings, and broader participant groups without tuning against the locked evaluation.",
    status: "verified",
    statusLabel: "Scope stated explicitly",
    side: "right",
    camera: {
      position: [1.35, 0.2, 5.35],
      target: [-0.2, 0, 0],
      highlight: "out",
    },
    sources: [primarySources.paper],
  },
  {
    id: "return",
    navLabel: "Return",
    eyebrow: "Journey complete",
    question: "So, can computers read minds?",
    simpleAnswer:
      "No. But with careful experiments, they can learn small, measurable patterns in brain activity—and help us ask better questions.",
    technicalDetail:
      "The promise of BCI research depends on the same things that make it difficult: transparent methods, honest uncertainty, participant-aware validation, and evidence that can be reproduced.",
    status: "verified",
    statusLabel: "What we know—and what we do not",
    side: "center",
    camera: {
      position: [0, 0, 8.4],
      target: [0, 0, 0],
      highlight: "whole",
    },
    sources: [primarySources.zenodo, primarySources.paper],
  },
] as const;

export const pipelineSteps = [
  "Read the documentation",
  "Inventory every file",
  "Apply conservative cleaning",
  "Define signal windows",
  "Explore features",
  "Split by participant",
  "Train without leakage",
  "Run the locked evaluation once",
  "Package reproducibility evidence",
] as const;

export const resultPanels = [
  {
    title: "Model comparison",
    description: "Relative performance across approved model families.",
  },
  {
    title: "Participant distribution",
    description: "How performance varies across held-out people.",
  },
  {
    title: "Spectral evidence",
    description: "Reviewed sensorimotor rhythm findings and uncertainty.",
  },
] as const;
