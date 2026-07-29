export type JourneyStatus = "verified" | "process" | "pending";
export type JourneyStage = "exterior" | "interior" | "return";
export type VisualType =
  | "orientation"
  | "signal"
  | "dataset"
  | "acquisition"
  | "integrity"
  | "pipeline"
  | "results"
  | "limitations"
  | "summary";

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
  stationLabel: string;
  question: string;
  simpleAnswer: string;
  technicalDetail: string;
  status: JourneyStatus;
  statusLabel: string;
  side: "left" | "right" | "center";
  stage: JourneyStage;
  visualType: VisualType;
  accessibilitySummary: string;
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
    navLabel: "Departure",
    stationLabel: "Departure platform",
    question: "Signals in Motion",
    simpleAnswer:
      "A journey through motor-imagery brain–computer interface research.",
    technicalDetail:
      "This experience follows a research project that studies measurable brain-signal patterns while people imagine moving their left or right hand. It does not receive private thoughts, memories, or inner speech.",
    status: "process",
    statusLabel: "Research in progress",
    side: "left",
    stage: "exterior",
    visualType: "orientation",
    accessibilitySummary:
      "A complete luminous brain is shown before the journey begins.",
    camera: {
      position: [0, 0, 8],
      target: [0, 0, 0],
      highlight: "whole",
    },
    sources: [primarySources.paper],
  },
  {
    id: "bci",
    navLabel: "BCI",
    stationLabel: "Station 01 · What is a BCI?",
    question: "Can computers read minds?",
    simpleAnswer:
      "Not quite. A BCI measures tiny electrical patterns and learns what a small, defined signal may mean.",
    technicalDetail:
      "This project studies motor imagery: changes in recorded brain activity while a person imagines moving their left or right hand. The classifier receives sensor measurements—not thoughts, memories, intentions outside the task, or inner speech.",
    status: "verified",
    statusLabel: "Plain-language orientation",
    side: "right",
    stage: "interior",
    visualType: "signal",
    accessibilitySummary:
      "The first interior station explains the difference between brain-signal classification and mind reading.",
    camera: {
      position: [0.25, 0.05, -8],
      target: [0, 0, -12],
      highlight: "left",
    },
    sources: [primarySources.paper],
  },
  {
    id: "background",
    navLabel: "Background",
    stationLabel: "Station 02 · Research background",
    question: "What are we listening for?",
    simpleAnswer:
      "When you imagine movement, groups of brain cells change rhythm. EEG sensors can measure part of that change from the scalp.",
    technicalDetail:
      "The study focuses on left- versus right-hand motor imagery. These patterns are subtle, vary across people, and can change from run to run—so a useful model must generalize beyond the people it learned from.",
    status: "verified",
    statusLabel: "Source-backed context",
    side: "left",
    stage: "interior",
    visualType: "signal",
    accessibilitySummary:
      "Animated signal paths illustrate that EEG measures changing electrical rhythms from the scalp.",
    camera: {
      position: [-0.8, 0.35, -15],
      target: [0.4, 0, -20],
      highlight: "left",
    },
    sources: [primarySources.paper],
  },
  {
    id: "dataset",
    navLabel: "Dataset",
    stationLabel: "Station 03 · The dataset",
    question: "How much did researchers record?",
    simpleAnswer:
      "Eighty-seven volunteers completed one session each, producing hundreds of carefully documented recordings.",
    technicalDetail:
      "The published corpus contains participant groups A1–A60, B61–B81, and C82–C87. A complete motor-imagery run contains 40 trials: 20 left-hand and 20 right-hand trials.",
    status: "verified",
    statusLabel: "Verified dataset facts",
    side: "right",
    stage: "interior",
    visualType: "dataset",
    accessibilitySummary:
      "Four ticket-shaped metric cards summarize the verified dataset composition.",
    camera: {
      position: [0.9, -0.2, -22],
      target: [-0.4, 0.1, -27],
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
    navLabel: "Acquisition",
    stationLabel: "Station 04 · Experiment & acquisition",
    question: "What did one session look like?",
    simpleAnswer:
      "People rested, followed visual cues, imagined hand movements, and then received feedback as the system learned.",
    technicalDetail:
      "The documented complete structure includes two baseline recordings, acquisition runs R1–R2, and online runs R3–R6. Exceptions—such as missing runs or trigger differences—remain part of the record rather than being silently repaired.",
    status: "verified",
    statusLabel: "Documented protocol",
    side: "left",
    stage: "interior",
    visualType: "acquisition",
    accessibilitySummary:
      "A four-step diagram shows baseline, acquisition, imagined movement, and feedback.",
    camera: {
      position: [-0.65, 0.35, -29],
      target: [0.45, -0.1, -34],
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
    stationLabel: "Station 05 · Cleaning & integrity",
    question: "How do we protect the evidence?",
    simpleAnswer:
      "We keep the original science untouched, make only authorized changes, and leave a trail that can be checked.",
    technicalDetail:
      "Scientific measurements, identifiers, spreadsheets, questionnaires, and configuration files remain unchanged. Authorized text normalization must preserve parsed cells exactly; known noisy channels, trial notes, and missing assets are documented—not guessed away.",
    status: "verified",
    statusLabel: "Post-clean validation passed",
    side: "right",
    stage: "interior",
    visualType: "integrity",
    accessibilitySummary:
      "Verified traceability counts are presented with a clear explanation of immutable source data.",
    camera: {
      position: [0.85, -0.3, -36],
      target: [-0.35, 0.1, -41],
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
    stationLabel: "Station 06 · Data-science pipeline",
    question: "How does a signal become a prediction?",
    simpleAnswer:
      "The work moves through a locked sequence: understand, verify, prepare, measure, train, and test.",
    technicalDetail:
      "The analysis policy separates participants across development and evaluation, controls information leakage, and reserves the locked test for a one-time final check. Public claims stay gated until their artifacts are approved and versioned.",
    status: "process",
    statusLabel: "Protocol defined · results gated",
    side: "left",
    stage: "interior",
    visualType: "pipeline",
    accessibilitySummary:
      "A nine-step route shows the analysis path and its participant-disjoint evaluation gate.",
    camera: {
      position: [-0.85, 0.2, -43],
      target: [0.35, 0, -48],
      highlight: "network",
    },
    sources: [primarySources.paper],
  },
  {
    id: "results",
    navLabel: "Results",
    stationLabel: "Station 07 · Results status",
    question: "What did the models find?",
    simpleAnswer:
      "The evaluation artifacts exist locally, but they are not yet approved for public reporting.",
    technicalDetail:
      "Model comparisons, performance distributions, spectral findings, and subgroup analyses will appear here only after the corresponding outputs are reviewed, versioned, and traceable to the locked protocol.",
    status: "pending",
    statusLabel: "Awaiting verified analysis",
    side: "right",
    stage: "interior",
    visualType: "results",
    accessibilitySummary:
      "Three empty visualization frames are explicitly labeled as awaiting verified analysis.",
    camera: {
      position: [0.75, -0.25, -50],
      target: [-0.4, 0.1, -55],
      highlight: "network",
    },
    sources: [primarySources.zenodo, primarySources.paper],
  },
  {
    id: "future",
    navLabel: "Next",
    stationLabel: "Station 08 · Limits & future directions",
    question: "What should we stay cautious about?",
    simpleAnswer:
      "Brain signals are noisy, people differ, and one dataset cannot answer every question.",
    technicalDetail:
      "The study covers one session per participant and a specific left/right motor-imagery task. Future work should test robustness across sessions, equipment, settings, and broader participant groups without tuning against the locked evaluation.",
    status: "verified",
    statusLabel: "Scope stated explicitly",
    side: "left",
    stage: "interior",
    visualType: "limitations",
    accessibilitySummary:
      "Three limitation notes explain the single-session task, narrow cue set, and differences between people.",
    camera: {
      position: [-0.5, 0.2, -57],
      target: [0.2, 0, -62],
      highlight: "out",
    },
    sources: [primarySources.paper],
  },
  {
    id: "return",
    navLabel: "Terminus",
    stationLabel: "Final stop · Return to the full brain",
    question: "Small signals. Careful answers.",
    simpleAnswer:
      "A computer cannot read a mind—but careful experiments can help it recognize a small, measurable pattern in brain activity.",
    technicalDetail:
      "The promise of BCI research depends on the same things that make it difficult: transparent methods, honest uncertainty, participant-aware validation, and evidence that can be reproduced.",
    status: "verified",
    statusLabel: "Journey complete",
    side: "center",
    stage: "return",
    visualType: "summary",
    accessibilitySummary:
      "The camera returns to the full brain while the final takeaway and primary sources are presented.",
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
