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
    navLabel: "Overview",
    stationLabel: "Project overview",
    question: "Predicting Motor Imagery from EEG",
    simpleAnswer:
      "This project studies whether machine-learning models can distinguish imagined left- and right-hand movements from EEG recordings.",
    technicalDetail:
      "The analysis uses a public motor-imagery dataset and a participant-disjoint evaluation process. It focuses on one defined classification task and does not attempt to recover private thoughts, memories, or inner speech.",
    status: "process",
    statusLabel: "Research in progress",
    side: "left",
    stage: "exterior",
    visualType: "orientation",
    accessibilitySummary:
      "A complete luminous brain introduces a research walkthrough about classifying motor-imagery EEG signals.",
    camera: {
      position: [0, 0, 8],
      target: [0, 0, 0],
      highlight: "whole",
    },
    sources: [primarySources.paper],
  },
  {
    id: "bci",
    navLabel: "BCI basics",
    stationLabel: "Section 01 · What is a BCI?",
    question: "What does a brain–computer interface measure?",
    simpleAnswer:
      "A BCI records signals from the nervous system and uses them to recognize a specific, predefined task.",
    technicalDetail:
      "This project studies motor imagery: changes in recorded brain activity while a person imagines moving their left or right hand. The classifier receives sensor measurements—not thoughts, memories, intentions outside the task, or inner speech.",
    status: "verified",
    statusLabel: "Plain-language orientation",
    side: "right",
    stage: "interior",
    visualType: "signal",
    accessibilitySummary:
      "The first section explains that this project classifies task-related EEG patterns rather than reading thoughts.",
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
    stationLabel: "Section 02 · Research background",
    question: "Why study imagined movement?",
    simpleAnswer:
      "Imagining a movement can change measurable EEG rhythms even when the body does not move.",
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
    stationLabel: "Section 03 · Dataset",
    question: "What data does this project use?",
    simpleAnswer:
      "The public dataset contains one recorded session from each of 87 participants.",
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
    stationLabel: "Section 04 · Experiment and acquisition",
    question: "How were the EEG recordings collected?",
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
    stationLabel: "Section 05 · Cleaning and integrity",
    question: "How is the data kept reliable?",
    simpleAnswer:
      "The original files remain unchanged, and every approved cleaning step is documented and checked.",
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
    stationLabel: "Section 06 · Data-science pipeline",
    question: "How are the models developed and tested?",
    simpleAnswer:
      "The pipeline prepares the signals, develops models, and evaluates them on participants excluded from training.",
    technicalDetail:
      "The analysis policy separates participants across development and evaluation, controls information leakage, and reserves the locked test for a one-time final check. Public claims stay gated until their artifacts are approved and versioned.",
    status: "process",
    statusLabel: "Protocol defined · results gated",
    side: "left",
    stage: "interior",
    visualType: "pipeline",
    accessibilitySummary:
      "A nine-step diagram shows the analysis path and its participant-disjoint evaluation gate.",
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
    stationLabel: "Section 07 · Results status",
    question: "What results are currently available?",
    simpleAnswer:
      "Final model results are not shown because the analysis outputs have not yet been approved and versioned for publication.",
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
    navLabel: "Limitations",
    stationLabel: "Section 08 · Limitations and future work",
    question: "What are the study’s limitations?",
    simpleAnswer:
      "The dataset covers one session and one motor-imagery task, and EEG patterns can differ substantially between people.",
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
    navLabel: "Summary",
    stationLabel: "Project summary",
    question: "What is this project designed to test?",
    simpleAnswer:
      "The project tests whether left- and right-hand motor imagery can be classified from EEG recordings across participants.",
    technicalDetail:
      "Any public conclusion must be supported by transparent methods, participant-disjoint validation, stated uncertainty, and reproducible evidence.",
    status: "verified",
    statusLabel: "Project scope",
    side: "center",
    stage: "return",
    visualType: "summary",
    accessibilitySummary:
      "The camera returns to the full brain while the project scope and primary sources are presented.",
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
