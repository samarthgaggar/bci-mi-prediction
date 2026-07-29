export type ResearchStatus = "verified" | "process" | "pending";
export type ScenePhase = "exterior" | "interior" | "return";
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

export type ResearchSection = {
  id: string;
  navLabel: string;
  sectionLabel: string;
  question: string;
  simpleAnswer: string;
  technicalDetail: string;
  status: ResearchStatus;
  statusLabel: string;
  side: "left" | "right" | "center";
  phase: ScenePhase;
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
  exploratoryFigures: {
    label: "Versioned exploratory figures",
    href: "https://github.com/ucd-cosmos-data/26-the-data-miners-analysis/blob/591d9e4994a1e6ee1edd37d2328e280544df65a9/Figures/FullBCIDatasetFigures.pdf",
  },
} as const satisfies Record<string, SourceReference>;

export const researchSections: readonly ResearchSection[] = [
  {
    id: "start",
    navLabel: "Overview",
    sectionLabel: "Project overview",
    question: "Predicting Motor Imagery from EEG",
    simpleAnswer:
      "This project tests whether machine-learning models can distinguish imagined left- and right-hand movement from EEG recordings.",
    technicalDetail:
      "The analysis uses a public motor-imagery dataset and a participant-disjoint evaluation process. It focuses on one defined classification task and does not attempt to recover private thoughts, memories, or inner speech.",
    status: "process",
    statusLabel: "Research in progress",
    side: "left",
    phase: "exterior",
    visualType: "orientation",
    accessibilitySummary:
      "A complete luminous brain introduces the motor-imagery EEG classification project.",
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
    sectionLabel: "01 — BCI basics",
    question: "What does a brain–computer interface measure?",
    simpleAnswer:
      "A BCI records signals from the nervous system and uses them to recognize a specific, predefined task.",
    technicalDetail:
      "This project studies motor imagery: changes in recorded brain activity while a person imagines moving their left or right hand. The classifier receives sensor measurements—not thoughts, memories, intentions outside the task, or inner speech.",
    status: "verified",
    statusLabel: "Plain-language orientation",
    side: "right",
    phase: "interior",
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
    sectionLabel: "02 — Research background",
    question: "Why study imagined movement?",
    simpleAnswer:
      "Imagining a movement can change measurable EEG rhythms even when the body does not move.",
    technicalDetail:
      "The study focuses on left- versus right-hand motor imagery. These patterns are subtle, vary across people, and can change from run to run—so a useful model must generalize beyond the people it learned from.",
    status: "verified",
    statusLabel: "Source-backed context",
    side: "left",
    phase: "interior",
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
    sectionLabel: "03 — Dataset",
    question: "What data does this project use?",
    simpleAnswer:
      "The public dataset contains one recorded session from each of 87 participants.",
    technicalDetail:
      "The published corpus contains participant groups A1–A60, B61–B81, and C82–C87. A complete motor-imagery run contains 40 trials: 20 left-hand and 20 right-hand trials.",
    status: "verified",
    statusLabel: "Verified dataset facts",
    side: "right",
    phase: "interior",
    visualType: "dataset",
    accessibilitySummary:
      "Four metric cards summarize the verified dataset composition.",
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
    sectionLabel: "04 — Experiment and acquisition",
    question: "How were the EEG recordings collected?",
    simpleAnswer:
      "Participants rested, followed visual cues, imagined hand movements, and received feedback during the online runs.",
    technicalDetail:
      "The documented complete structure includes two baseline recordings, acquisition runs R1–R2, and online runs R3–R6. Exceptions—such as missing runs or trigger differences—remain part of the record rather than being silently repaired.",
    status: "verified",
    statusLabel: "Documented protocol",
    side: "left",
    phase: "interior",
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
    sectionLabel: "05 — Cleaning and integrity",
    question: "How is the data kept reliable?",
    simpleAnswer:
      "The original files remain unchanged, and every approved cleaning step is documented and checked.",
    technicalDetail:
      "Scientific measurements, identifiers, spreadsheets, questionnaires, and configuration files remain unchanged. Authorized text normalization must preserve parsed cells exactly; known noisy channels, trial notes, and missing assets are documented—not guessed away.",
    status: "verified",
    statusLabel: "Post-clean validation passed",
    side: "right",
    phase: "interior",
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
    sectionLabel: "06 — Data-science pipeline",
    question: "How are the models developed and tested?",
    simpleAnswer:
      "The pipeline prepares the signals, develops models, and evaluates them on participants excluded from model development.",
    technicalDetail:
      "The analysis policy separates participants across development and evaluation, controls information leakage, and reserves the locked test for a one-time final check. Public claims stay gated until their artifacts are approved and versioned.",
    status: "process",
    statusLabel: "Protocol defined · results gated",
    side: "left",
    phase: "interior",
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
    sectionLabel: "07 — Exploratory results",
    question: "What does the recorded performance show?",
    simpleAnswer:
      "Online BCI performance varies widely between participants, while the average remains similar across Runs 3–6.",
    technicalDetail:
      "These versioned figures describe the published online BCI performance fields and exploratory questionnaire relationships. They do not report the participant-disjoint model evaluation, establish causality, or prove statistical significance. Final model comparisons remain gated until their approved artifacts are published.",
    status: "verified",
    statusLabel: "Versioned descriptive figures",
    side: "right",
    phase: "interior",
    visualType: "results",
    accessibilitySummary:
      "Three source-backed charts show participant performance distributions, run-level means with confidence intervals, and weak exploratory learning-style correlations.",
    camera: {
      position: [0.75, -0.25, -50],
      target: [-0.4, 0.1, -55],
      highlight: "network",
    },
    sources: [
      primarySources.exploratoryFigures,
      primarySources.zenodo,
      primarySources.paper,
    ],
  },
  {
    id: "future",
    navLabel: "Limitations",
    sectionLabel: "08 — Limitations and future work",
    question: "What are the study’s limitations?",
    simpleAnswer:
      "The dataset covers one session and one motor-imagery task, and EEG patterns can differ substantially between people.",
    technicalDetail:
      "The study covers one session per participant and a specific left/right motor-imagery task. Future work should test robustness across sessions, equipment, settings, and broader participant groups without tuning against the locked evaluation.",
    status: "verified",
    statusLabel: "Scope stated explicitly",
    side: "left",
    phase: "interior",
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
    navLabel: "Sources",
    sectionLabel: "Research sources and scope",
    question: "What is this project designed to test?",
    simpleAnswer:
      "The project tests whether left- and right-hand motor imagery can be classified from EEG recordings across participants.",
    technicalDetail:
      "Any public conclusion must be supported by transparent methods, participant-disjoint validation, stated uncertainty, and reproducible evidence.",
    status: "verified",
    statusLabel: "Project scope",
    side: "center",
    phase: "return",
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
  "Fit models without leakage",
  "Run the locked evaluation once",
  "Package reproducibility evidence",
] as const;

export const resultFigures = [
  {
    src: "/results/performance-by-run.png",
    width: 1484,
    height: 889,
    eyebrow: "Participant variation",
    title: "Performance spans a wide range",
    description:
      "Each panel shows the distribution of published online BCI accuracy for one run. Participants occupy a broad range in every panel, so the average alone does not describe how differently people performed.",
    alt: "Four histograms showing participant performance accuracy distributions for online Runs 3, 4, 5, and 6.",
  },
  {
    src: "/results/mean-performance-by-run.png",
    width: 1333,
    height: 884,
    eyebrow: "Run-level average",
    title: "The four run means are close",
    description:
      "Mean successful-run performance ranges from 61.92% in Run 3 to 64.83% in Run 6. The 95% confidence intervals overlap, so this chart alone does not establish a reliable improvement between runs.",
    alt: "Line chart of mean successful-run performance with 95% confidence intervals: 61.92% for Run 3, 63.62% for Run 4, 63.14% for Run 5, and 64.83% for Run 6.",
  },
  {
    src: "/results/learning-style-correlations.png",
    width: 2683,
    height: 1330,
    eyebrow: "Exploratory relationship",
    title: "No strong linear learning-style pattern appears",
    description:
      "Across the eight learning-style scores, the displayed correlations with mean online performance range from -0.24 to +0.24. These are weak descriptive relationships and should not be treated as causal or predictive findings.",
    alt: "Eight scatter plots comparing learning-style scores with mean online BCI performance; displayed correlations range from negative 0.24 to positive 0.24.",
  },
] as const;
