export type ResearchStatus = "verified" | "process" | "pending";
export type ScenePhase = "exterior" | "interior" | "return";
export type VisualType =
  | "orientation"
  | "signal"
  | "dataset"
  | "acquisition"
  | "integrity"
  | "pipeline"
  | "models"
  | "results"
  | "figures"
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

export type ResultFigure = {
  src: string;
  width: number;
  height: number;
  eyebrow: string;
  title: string;
  description: string;
  alt: string;
};

export type ResultFigureGroup = {
  id: string;
  label: string;
  title: string;
  description: string;
  open: boolean;
  figures: readonly ResultFigure[];
};

export type ResultTable = {
  id: string;
  title: string;
  description: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  open?: boolean;
};

const analysisCommit = "591d9e4994a1e6ee1edd37d2328e280544df65a9";
const analysisBase =
  `https://github.com/ucd-cosmos-data/26-the-data-miners-analysis/blob/${analysisCommit}`;

export const primarySources = {
  zenodo: {
    label: "Zenodo dataset record",
    href: "https://zenodo.org/records/8089820",
  },
  paper: {
    label: "Scientific Data descriptor",
    href: "https://www.nature.com/articles/s41597-023-02445-z",
  },
  analysisRepository: {
    label: "Data Miners analysis repository",
    href: `https://github.com/ucd-cosmos-data/26-the-data-miners-analysis/tree/${analysisCommit}`,
  },
  cspNotebook: {
    label: "Versioned CSP–MLP notebook",
    href: `${analysisBase}/bci_cleaning/data/csp_neural_net.ipynb`,
  },
  performanceNotebook: {
    label: "Versioned performance notebook",
    href: `${analysisBase}/bci_cleaning/data/performance_cleaning.ipynb`,
  },
  comparisonNotebook: {
    label: "Versioned comparison notebook",
    href: `${analysisBase}/bci_cleaning/data/comparison.ipynb`,
  },
  exploratoryFigures: {
    label: "Versioned exploratory figure book",
    href: `${analysisBase}/Figures/FullBCIDatasetFigures.pdf`,
  },
} as const satisfies Record<string, SourceReference>;

export const researchSections: readonly ResearchSection[] = [
  {
    id: "start",
    navLabel: "Overview",
    sectionLabel: "Project overview",
    question: "Predicting Motor Imagery from EEG",
    simpleAnswer:
      "The CSP–MLP reached a 69.6% mean participant balanced accuracy across all 79 evaluated participants. Its held-out test accuracy was 68.25%.",
    technicalDetail:
      "The 69.6% headline is the unweighted mean of participant-level balanced accuracies. It combines 55 in-sample training participants with 12 held-out validation and 12 held-out test participants, so it is not a fully held-out score. The independent test result is 68.25% accuracy and 68.30% balanced accuracy.",
    status: "verified",
    statusLabel: "Versioned notebook results",
    side: "left",
    phase: "exterior",
    visualType: "orientation",
    accessibilitySummary:
      "A complete luminous brain introduces the CSP–MLP study and separates the all-participant mean from held-out test performance.",
    camera: {
      position: [0, 0, 8],
      target: [0, 0, 0],
      highlight: "whole",
    },
    metrics: [
      {
        value: "69.6%",
        label: "all-participant mean BA",
        detail: "79 participant-level balanced accuracies",
      },
      {
        value: "68.25%",
        label: "held-out test accuracy",
        detail: "1,812 correct of 2,655 retained trials",
      },
      {
        value: "68.30%",
        label: "held-out test BA",
        detail: "balanced accuracy across left and right classes",
      },
    ],
    sources: [primarySources.cspNotebook, primarySources.paper],
  },
  {
    id: "bci",
    navLabel: "BCI basics",
    sectionLabel: "01 — BCI basics",
    question: "What does a brain–computer interface measure?",
    simpleAnswer:
      "A BCI records signals from the nervous system and learns patterns tied to a specific, predefined task.",
    technicalDetail:
      "This project studies motor imagery: changes in recorded brain activity while a person imagines moving their left or right hand. The classifier receives sensor measurements—not thoughts, memories, intentions outside the task, or inner speech.",
    status: "verified",
    statusLabel: "Plain-language orientation",
    side: "right",
    phase: "interior",
    visualType: "signal",
    accessibilitySummary:
      "The first section explains that the classifier recognizes task-related EEG patterns rather than reading thoughts.",
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
      "The study focuses on left- versus right-hand motor imagery. These patterns are subtle, vary across people, and can change from run to run—so participant-separated validation matters.",
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
      "The public corpus contains one recorded session from each of 87 participants.",
    technicalDetail:
      "The corpus contains participant groups A1–A60, B61–B81, and C82–C87. A complete motor-imagery run contains 40 trials: 20 left-hand and 20 right-hand cues.",
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
      "Participants completed baseline recordings, calibration runs, and four online motor-imagery runs.",
    technicalDetail:
      "The analysis preserves the documented event structure and uses cue-locked left/right trials. It excludes documented paper-flagged participants from the time-frequency transformation and records structural exclusions rather than silently repairing them.",
    status: "verified",
    statusLabel: "Documented acquisition protocol",
    side: "left",
    phase: "interior",
    visualType: "acquisition",
    accessibilitySummary:
      "A four-step sequence shows baseline, acquisition, imagery, and feedback.",
    camera: {
      position: [-0.9, 0.1, -29],
      target: [0.4, 0, -34],
      highlight: "deep",
    },
    metrics: [
      {
        value: "40",
        label: "trials per complete run",
        detail: "20 left and 20 right cues",
      },
      {
        value: "520",
        label: "candidate task recordings",
        detail: "476 valid transformed recordings",
      },
    ],
    sources: [primarySources.paper, primarySources.cspNotebook],
  },
  {
    id: "integrity",
    navLabel: "Integrity",
    sectionLabel: "05 — Data integrity",
    question: "How were artifacts and leakage controlled?",
    simpleAnswer:
      "Raw recordings remained immutable, participants were separated by split, and physiological artifacts were removed before CSP features were learned.",
    technicalDetail:
      "Amplitude screening retained 17,598 of 19,040 time-frequency trials. The modeling index then retained 17,439 trials from 79 participants. Physiological cleaning used EOG regression, ICA, EMG rejection, Ledoit–Wolf covariance estimation, and label-free participant alignment.",
    status: "verified",
    statusLabel: "Leakage controls preserved",
    side: "right",
    phase: "interior",
    visualType: "integrity",
    accessibilitySummary:
      "Integrity metrics show trial retention, participant separation, and physiological cleaning.",
    camera: {
      position: [0.85, -0.15, -36],
      target: [-0.3, 0.1, -41],
      highlight: "network",
    },
    metrics: [
      {
        value: "7.57%",
        label: "amplitude rejection rate",
        detail: "1,442 of 19,040 trials",
      },
      {
        value: "79",
        label: "modeled participants",
        detail: "55 train · 12 validation · 12 test",
      },
      {
        value: "389 / 389",
        label: "ICA runs converged",
        detail: "development recordings only",
      },
      {
        value: "0",
        label: "participant overlap",
        detail: "every participant belongs to one split",
      },
    ],
    sources: [primarySources.cspNotebook, primarySources.analysisRepository],
  },
  {
    id: "pipeline",
    navLabel: "Pipeline",
    sectionLabel: "06 — Modeling pipeline",
    question: "How was the CSP–MLP built?",
    simpleAnswer:
      "The model combines participant-aligned covariance matrices, CSP spatial filters, and a compact 12-input neural network.",
    technicalDetail:
      "Window and frequency-band selection used only participant-separated training cross-validation. The chosen 0.5–3.0 second window reached 69.13% training-CV balanced accuracy. The best alternative band pair improved balanced accuracy by only 0.016 percentage points, below the 0.20-point adoption threshold, so the original 8–13 Hz and 13–30 Hz bands were retained.",
    status: "verified",
    statusLabel: "Training-only selection",
    side: "left",
    phase: "interior",
    visualType: "pipeline",
    accessibilitySummary:
      "The pipeline lists artifact cleaning, participant alignment, CSP extraction, neural-network fitting, and held-out evaluation.",
    camera: {
      position: [-0.75, 0.25, -43],
      target: [0.35, 0, -48],
      highlight: "network",
    },
    metrics: [
      {
        value: "27",
        label: "EEG electrodes",
        detail: "all scalp EEG channels",
      },
      {
        value: "12",
        label: "CSP features",
        detail: "six mu and six beta features",
      },
      {
        value: "0.5–3.0 s",
        label: "selected cue window",
        detail: "best training-only CV result",
      },
      {
        value: "12 → 16 → 8 → 2",
        label: "MLP architecture",
        detail: "compact binary classifier",
      },
    ],
    sources: [primarySources.cspNotebook],
  },
  {
    id: "models",
    navLabel: "Model training",
    sectionLabel: "07 — Model development",
    question: "What did development evaluation show?",
    simpleAnswer:
      "Training fit reached 70.45%, five-fold out-of-fold training accuracy reached 69.10%, and held-out validation accuracy reached 66.43%.",
    technicalDetail:
      "The 70.45% training number is an in-sample diagnostic. The stronger development estimate is the 69.10% participant-separated out-of-fold score. The final checkpoint was selected by validation loss at epoch 48 and stopped at epoch 60.",
    status: "verified",
    statusLabel: "Evaluation boundary stated",
    side: "right",
    phase: "interior",
    visualType: "models",
    accessibilitySummary:
      "Development cards distinguish in-sample fitting, participant-separated cross-validation, and held-out validation.",
    camera: {
      position: [0.75, -0.25, -50],
      target: [-0.4, 0.1, -55],
      highlight: "network",
    },
    sources: [primarySources.cspNotebook],
  },
  {
    id: "results",
    navLabel: "Test results",
    sectionLabel: "08 — Held-out test",
    question: "How well did the frozen CSP–MLP perform?",
    simpleAnswer:
      "On 12 held-out participants, the model reached 68.25% accuracy, 68.30% balanced accuracy, and 76.16% ROC AUC.",
    technicalDetail:
      "The test began with 2,713 trials and retained 2,655 after 58 EMG rejections. The frozen model made 1,812 correct predictions. No test labels were used for feature selection, model fitting, threshold tuning, or parameter updates.",
    status: "verified",
    statusLabel: "Held-out participant test",
    side: "left",
    phase: "interior",
    visualType: "results",
    accessibilitySummary:
      "Scorecards separate the 69.6% mixed all-participant mean from the 68.25% held-out test result.",
    camera: {
      position: [-0.65, 0.2, -57],
      target: [0.3, 0, -62],
      highlight: "network",
    },
    metrics: [
      {
        value: "68.25%",
        label: "test accuracy",
        detail: "1,812 / 2,655 retained trials",
      },
      {
        value: "68.30%",
        label: "test balanced accuracy",
        detail: "balanced class recall",
      },
      {
        value: "68.19%",
        label: "test macro F1",
        detail: "equal weighting across classes",
      },
      {
        value: "76.16%",
        label: "test ROC AUC",
        detail: "probability-ranking performance",
      },
    ],
    sources: [primarySources.cspNotebook],
  },
  {
    id: "figures",
    navLabel: "Results ledger",
    sectionLabel: "09 — Complete results ledger",
    question: "What are all the reported results?",
    simpleAnswer:
      "The tables below preserve every reported split, selection, participant, performance, correlation, and comparison metric found in the versioned notebooks.",
    technicalDetail:
      "Tables default to compact precision while retaining the notebook values. Exploratory correlations describe association only. Training rows labeled in-sample must not be interpreted as held-out generalization.",
    status: "verified",
    statusLabel: "Complete metric inventory",
    side: "right",
    phase: "interior",
    visualType: "figures",
    accessibilitySummary:
      "Expandable tables contain split metrics, feature selection, participant results, behavioral performance, correlations, and comparison outputs.",
    camera: {
      position: [0.55, -0.2, -64],
      target: [-0.25, 0, -69],
      highlight: "network",
    },
    sources: [
      primarySources.cspNotebook,
      primarySources.performanceNotebook,
      primarySources.comparisonNotebook,
    ],
  },
  {
    id: "future",
    navLabel: "Limitations",
    sectionLabel: "10 — Limitations",
    question: "What should we conclude—and not conclude?",
    simpleAnswer:
      "The CSP–MLP performed above chance, but 68.25% held-out accuracy is not sufficient for a clinical or high-stakes claim.",
    technicalDetail:
      "The all-participant 69.6% mean includes in-sample training participants. The held-out test contains 12 participants from one public corpus. Participant-level performance varies substantially, and exploratory profile correlations do not imply causality.",
    status: "verified",
    statusLabel: "Scope stated explicitly",
    side: "left",
    phase: "interior",
    visualType: "limitations",
    accessibilitySummary:
      "Limitations distinguish mixed-split summaries from held-out evidence and state that correlations are descriptive.",
    camera: {
      position: [-0.45, 0.2, -71],
      target: [0.2, 0, -76],
      highlight: "out",
    },
    sources: [primarySources.cspNotebook, primarySources.paper],
  },
  {
    id: "return",
    navLabel: "Sources",
    sectionLabel: "Research sources and scope",
    question: "What is the most defensible result?",
    simpleAnswer:
      "The frozen CSP–MLP reached 68.25% accuracy and 68.30% balanced accuracy on 12 held-out participants.",
    technicalDetail:
      "The 69.6% all-participant mean is useful as a descriptive summary, but the held-out test is the defensible generalization result. Future work should confirm performance on a separately collected cohort.",
    status: "verified",
    statusLabel: "Final research status",
    side: "center",
    phase: "return",
    visualType: "summary",
    accessibilitySummary:
      "The camera returns to the full brain while the held-out result and source boundaries are summarized.",
    camera: {
      position: [0, 0, 8.4],
      target: [0, 0, 0],
      highlight: "whole",
    },
    sources: [
      primarySources.cspNotebook,
      primarySources.performanceNotebook,
      primarySources.comparisonNotebook,
      primarySources.zenodo,
      primarySources.paper,
    ],
  },
] as const;

export const pipelineSteps = [
  "Verify the public corpus and preserve raw recordings",
  "Transform 476 eligible recordings into cue-locked trials",
  "Reject extreme-amplitude and flat-electrode artifacts",
  "Create participant-disjoint train, validation, and test splits",
  "Regress EOG, run ICA, and reject high-EMG trials",
  "Align participant covariance matrices without labels",
  "Select the cue window and frequency bands using training folds",
  "Fit CSP filters and the compact 12-input MLP",
  "Evaluate the frozen model on validation and held-out test participants",
] as const;

export const developmentModelMetrics = [
  {
    model: "Training fit",
    role: "In-sample diagnostic",
    value: "70.45%",
    metric: "accuracy",
    detail: "70.45% balanced accuracy · 12,029 trials",
  },
  {
    model: "Five-fold training OOF",
    role: "Participant-separated cross-validation",
    value: "69.10%",
    metric: "accuracy",
    detail: "69.10% balanced accuracy · 12,029 trials",
  },
  {
    model: "Held-out validation",
    role: "12 unseen development participants",
    value: "66.43%",
    metric: "accuracy",
    detail: "66.42% balanced accuracy · 2,535 trials",
  },
] as const;

export const selectionMetrics = [
  {
    value: "69.13%",
    label: "window CV BA",
    detail: "selected 0.5–3.0 second cue window",
  },
  {
    value: "8–13 Hz",
    label: "retained mu band",
    detail: "original band retained after CV",
  },
  {
    value: "13–30 Hz",
    label: "retained beta band",
    detail: "original band retained after CV",
  },
  {
    value: "+0.016 pp",
    label: "best band gain",
    detail: "below the required +0.20 pp threshold",
  },
] as const;

export const finalTestMetrics = [
  {
    value: "2,655",
    label: "retained test trials",
    detail: "58 of 2,713 rejected by EMG rule",
  },
  {
    value: "68.19%",
    label: "macro F1",
    detail: "equal class weighting",
  },
  {
    value: "76.16%",
    label: "ROC AUC",
    detail: "probability ranking",
  },
  {
    value: "0.3656",
    label: "Cohen’s κ",
    detail: "agreement beyond chance",
  },
] as const;

export const lockedModelMetrics = [
  {
    model: "All-participant mean",
    accuracy: "69.6%",
    rawAccuracy: 69.6,
    note: "Mean participant balanced accuracy; training participants are in-sample",
    recommended: true,
  },
  {
    model: "Held-out test balanced accuracy",
    accuracy: "68.30%",
    rawAccuracy: 68.2986,
    note: "12 unseen participants · 2,655 retained trials",
    recommended: false,
  },
  {
    model: "Held-out test accuracy",
    accuracy: "68.25%",
    rawAccuracy: 68.2486,
    note: "1,812 correct predictions",
    recommended: false,
  },
  {
    model: "Held-out validation accuracy",
    accuracy: "66.43%",
    rawAccuracy: 66.43,
    note: "12 unseen development participants",
    recommended: false,
  },
] as const;

export const featuredResultFigures: readonly ResultFigure[] = [
  {
    src: "/results/performance-by-run.png",
    width: 1484,
    height: 889,
    eyebrow: "Behavioral performance",
    title: "Online accuracy varies widely by participant",
    description:
      "Run-level histograms show why a single group mean cannot describe every participant.",
    alt: "Four histograms showing participant online BCI accuracy in Runs 3 through 6.",
  },
  {
    src: "/results/mean-performance-by-run.png",
    width: 1333,
    height: 884,
    eyebrow: "Behavioral performance",
    title: "Mean online accuracy was similar across runs",
    description:
      "Means ranged from 61.92% in Run 3 to 64.83% in Run 6, with overlapping confidence intervals.",
    alt: "Mean online BCI accuracy and 95 percent confidence intervals for Runs 3 through 6.",
  },
  {
    src: "/results/learning-style-correlations.png",
    width: 2683,
    height: 1330,
    eyebrow: "Exploratory association",
    title: "Learning-style correlations were weak",
    description:
      "Correlations with mean online performance ranged from −0.24 to +0.24 and are descriptive only.",
    alt: "Eight scatter plots comparing learning-style scores with mean online BCI performance.",
  },
] as const;

export const resultFigureGroups: readonly ResultFigureGroup[] = [
  {
    id: "exploratory",
    label: "Figure set",
    title: "Verified exploratory dataset figures",
    description:
      "Fifteen figures from the performance analysis; none are presented as causal evidence.",
    open: false,
    figures: [
      {
        src: "/results/eda/eeg-signal-example.png",
        width: 1155,
        height: 1159,
        eyebrow: "Signal inspection",
        title: "Example multichannel recording",
        description:
          "A time-window view shows the EEG, EOG, and EMG channel structure.",
        alt: "Example multichannel physiological recording with EEG, EOG, and EMG traces.",
      },
      {
        src: "/results/eda/participant-gender.png",
        width: 1033,
        height: 734,
        eyebrow: "Participant context",
        title: "Source gender-code counts",
        description:
          "The source-coded categories contain 45 and 42 participants.",
        alt: "Bar chart showing 45 participants with source gender code 1 and 42 with code 2.",
      },
      {
        src: "/results/eda/birth-year-distribution.png",
        width: 1184,
        height: 734,
        eyebrow: "Participant context",
        title: "Birth-year distribution",
        description:
          "Birth years span several decades and concentrate in the 1990s.",
        alt: "Histogram of participant birth years.",
      },
      {
        src: "/results/eda/birth-year-density.png",
        width: 863,
        height: 680,
        eyebrow: "Participant context",
        title: "Birth-year density",
        description:
          "A smoothed view emphasizes the concentration in the 1990s.",
        alt: "Density estimate of participant birth years.",
      },
      featuredResultFigures[0],
      {
        src: "/results/eda/personality-categories.png",
        width: 1933,
        height: 1330,
        eyebrow: "Pre-session context",
        title: "Broad 16PF categories",
        description:
          "Box plots summarize four broad personality-factor groups.",
        alt: "Box plots of broader 16PF personality categories.",
      },
      {
        src: "/results/eda/personality-vs-performance.png",
        width: 2083,
        height: 1183,
        eyebrow: "Exploratory association",
        title: "Personality factors versus performance",
        description:
          "Five broad-factor correlations with mean performance ranged from −0.13 to +0.08.",
        alt: "Scatter plots comparing broad 16PF factors with mean online BCI performance.",
      },
      {
        src: "/results/eda/personality-pairwise.png",
        width: 2984,
        height: 1183,
        eyebrow: "Exploratory association",
        title: "Pairwise personality relationships",
        description:
          "Ten pairwise correlations range from −0.58 to +0.33.",
        alt: "Ten scatter plots of pairwise relationships among broad 16PF factors.",
      },
      featuredResultFigures[2],
      {
        src: "/results/eda/mental-rotation-vs-performance.png",
        width: 1783,
        height: 1330,
        eyebrow: "Exploratory association",
        title: "Mental rotation versus online performance",
        description:
          "Run-specific correlations ranged from −0.21 to −0.06.",
        alt: "Four scatter plots comparing mental-rotation score with Runs 3 through 6.",
      },
      {
        src: "/results/eda/performance-group-1.png",
        width: 1783,
        height: 1183,
        eyebrow: "Behavioral performance",
        title: "Run distributions for source gender code 1",
        description:
          "Four histograms summarize the 45 participants in code group 1.",
        alt: "Run performance histograms for source gender code 1.",
      },
      {
        src: "/results/eda/performance-group-2.png",
        width: 1784,
        height: 1183,
        eyebrow: "Behavioral performance",
        title: "Run distributions for source gender code 2",
        description:
          "Four histograms summarize the 42 participants in code group 2.",
        alt: "Run performance histograms for source gender code 2.",
      },
      {
        src: "/results/eda/pre-session-vs-performance.png",
        width: 2992,
        height: 1771,
        eyebrow: "Exploratory association",
        title: "Pre-session measures versus performance",
        description:
          "Fourteen correlations ranged from −0.21 to +0.14.",
        alt: "Grid of pre-session measures compared with mean online BCI performance.",
      },
      featuredResultFigures[1],
      {
        src: "/results/eda/left-handed-performance.png",
        width: 1033,
        height: 883,
        eyebrow: "Small subgroup",
        title: "Left-handed participant performance",
        description:
          "Six left-handed participants averaged 61.25%; the group is too small for broad inference.",
        alt: "Dot plot of six left-handed participants with a mean performance of 61.25 percent.",
      },
    ],
  },
] as const;

export const resultTables: readonly ResultTable[] = [
  {
    id: "split-metrics",
    title: "Model split metrics",
    description:
      "Training is in-sample; validation and test are participant-held-out.",
    columns: [
      "Split",
      "Participants",
      "Trials",
      "Accuracy",
      "Balanced accuracy",
      "Macro F1",
      "ROC AUC",
      "κ",
    ],
    rows: [
      ["Train · in-sample", "55", "12,029", "70.45%", "70.45%", "70.45%", "78.59%", "0.4090"],
      ["Validation · held-out", "12", "2,535", "66.43%", "66.42%", "66.40%", "73.09%", "0.3285"],
      ["Test · held-out", "12", "2,655", "68.25%", "68.30%", "68.19%", "76.16%", "0.3656"],
    ],
    open: true,
  },
  {
    id: "window-selection",
    title: "Training-only cue-window selection",
    description:
      "Five-fold participant-separated training cross-validation.",
    columns: ["Window", "Balanced accuracy", "Accuracy", "Macro F1", "ROC AUC"],
    rows: [
      ["0.5–3.0 s", "69.1326%", "69.1329%", "69.1326%", "76.5044%"],
      ["0.5–4.0 s", "68.8633%", "68.8669%", "68.8621%", "76.4901%"],
      ["0.5–5.0 s", "68.4445%", "68.4512%", "68.4369%", "75.5593%"],
      ["1.0–4.0 s", "67.5542%", "67.5617%", "67.5438%", "74.6146%"],
      ["1.0–5.0 s", "67.1061%", "67.1128%", "67.0983%", "73.8819%"],
    ],
  },
  {
    id: "band-selection",
    title: "Training-only frequency-band selection",
    description:
      "The highest row did not clear the predeclared improvement threshold, so 8–13/13–30 Hz was retained.",
    columns: ["Mu / beta", "Balanced accuracy", "Accuracy", "Macro F1", "ROC AUC"],
    rows: [
      ["8–14 / 13–30", "69.1489%", "69.1496%", "69.1490%", "76.8896%"],
      ["8–13 / 13–30 · retained", "69.1326%", "69.1329%", "69.1326%", "76.5044%"],
      ["8–14 / 15–30", "69.0743%", "69.0747%", "69.0743%", "76.8271%"],
      ["8–14 / 15–25", "68.9677%", "68.9667%", "68.9667%", "76.5598%"],
      ["8–14 / 13–25", "68.8754%", "68.8752%", "68.8751%", "76.6090%"],
      ["8–13 / 15–30", "68.8584%", "68.8586%", "68.8583%", "76.3984%"],
      ["8–13 / 13–25", "68.7501%", "68.7505%", "68.7501%", "76.1936%"],
      ["8–12 / 13–30", "68.3177%", "68.3182%", "68.3178%", "75.2802%"],
      ["8–13 / 15–25", "68.1611%", "68.1603%", "68.1603%", "76.0121%"],
      ["7–12 / 13–30", "68.1021%", "68.1021%", "68.1019%", "74.7880%"],
      ["7–12 / 15–30", "67.9026%", "67.9026%", "67.9024%", "74.5761%"],
      ["8–12 / 15–30", "67.8433%", "67.8444%", "67.8434%", "75.0016%"],
      ["8–12 / 13–25", "67.7297%", "67.7280%", "67.7278%", "74.7426%"],
      ["7–12 / 13–25", "67.6456%", "67.6449%", "67.6449%", "74.3105%"],
      ["8–12 / 15–25", "67.3780%", "67.3788%", "67.3781%", "74.4636%"],
      ["7–12 / 15–25", "67.0549%", "67.0546%", "67.0545%", "73.9779%"],
    ],
  },
  {
    id: "validation-participants",
    title: "Held-out validation participants",
    description:
      "Accuracy and balanced accuracy for each of the 12 validation participants.",
    columns: ["Participant", "Trials", "Accuracy", "Balanced accuracy", "Behavioral mean"],
    rows: [
      ["A1", "180", "83.33%", "83.24%", "84.375%"],
      ["B65", "230", "82.61%", "82.55%", "82.500%"],
      ["A20", "207", "80.68%", "80.64%", "83.125%"],
      ["A52", "239", "78.66%", "78.65%", "88.750%"],
      ["A21", "155", "74.84%", "75.29%", "56.875%"],
      ["A31", "232", "66.81%", "66.77%", "52.500%"],
      ["B66", "224", "63.84%", "63.93%", "58.750%"],
      ["A48", "146", "61.64%", "61.37%", "56.625%"],
      ["A28", "230", "57.39%", "57.41%", "48.125%"],
      ["A45", "234", "52.56%", "52.56%", "54.375%"],
      ["C82", "222", "51.80%", "51.79%", "49.375%"],
      ["B77", "236", "48.73%", "48.77%", "53.750%"],
    ],
  },
  {
    id: "test-participants",
    title: "Held-out test participants",
    description:
      "All participant-level test metrics reported by the frozen model.",
    columns: ["Participant", "Trials", "Accuracy", "Balanced accuracy", "Macro F1", "ROC AUC"],
    rows: [
      ["A10", "236", "88.98%", "88.98%", "88.98%", "95.43%"],
      ["B62", "205", "88.29%", "88.38%", "88.29%", "96.27%"],
      ["A18", "213", "85.92%", "85.90%", "85.89%", "93.32%"],
      ["C83", "225", "79.11%", "79.25%", "79.07%", "86.00%"],
      ["A23", "238", "76.47%", "76.47%", "76.47%", "83.26%"],
      ["A22", "237", "74.68%", "74.65%", "74.48%", "80.52%"],
      ["B81", "231", "59.74%", "60.03%", "59.14%", "62.38%"],
      ["A46", "177", "58.76%", "58.62%", "58.63%", "64.25%"],
      ["A7", "236", "55.08%", "55.08%", "54.35%", "57.96%"],
      ["A11", "237", "52.32%", "52.38%", "52.24%", "56.86%"],
      ["B71", "198", "50.51%", "50.53%", "50.48%", "55.21%"],
      ["A43", "222", "47.30%", "47.24%", "47.06%", "47.92%"],
    ],
  },
  {
    id: "behavioral-runs",
    title: "Published online performance by run",
    description:
      "Means and normal-approximation 95% confidence intervals from the cleaned participant table.",
    columns: ["Run", "n", "Mean", "95% CI"],
    rows: [
      ["Run 3", "87", "61.92%", "58.38–65.47%"],
      ["Run 4", "87", "63.62%", "59.79–67.45%"],
      ["Run 5", "86", "63.14%", "59.48–66.80%"],
      ["Run 6", "86", "64.83%", "61.20–68.45%"],
    ],
  },
  {
    id: "correlations",
    title: "All reported exploratory correlations",
    description:
      "Pearson r values from the performance notebook. These are descriptive, not causal.",
    columns: ["Group", "Measure", "n", "r"],
    rows: [
      ["Broad factor vs performance", "EX", "86", "+0.05"],
      ["Broad factor vs performance", "AX", "86", "−0.04"],
      ["Broad factor vs performance", "TM", "86", "+0.02"],
      ["Broad factor vs performance", "IN", "86", "−0.13"],
      ["Broad factor vs performance", "SC", "86", "+0.08"],
      ["Broad-factor pair", "EX / AX", "86", "−0.09"],
      ["Broad-factor pair", "EX / TM", "86", "−0.30"],
      ["Broad-factor pair", "EX / IN", "86", "+0.33"],
      ["Broad-factor pair", "EX / SC", "86", "−0.09"],
      ["Broad-factor pair", "AX / TM", "86", "−0.03"],
      ["Broad-factor pair", "AX / IN", "86", "+0.09"],
      ["Broad-factor pair", "AX / SC", "86", "+0.16"],
      ["Broad-factor pair", "TM / IN", "86", "−0.58"],
      ["Broad-factor pair", "TM / SC", "86", "+0.30"],
      ["Broad-factor pair", "IN / SC", "86", "−0.01"],
      ["Learning style", "active", "86", "−0.19"],
      ["Learning style", "reflexive", "86", "+0.19"],
      ["Learning style", "sensory", "86", "+0.02"],
      ["Learning style", "intuitive", "86", "−0.02"],
      ["Learning style", "visual", "86", "−0.24"],
      ["Learning style", "verbal", "86", "+0.24"],
      ["Learning style", "sequential", "86", "+0.19"],
      ["Learning style", "global", "86", "−0.19"],
      ["Mental rotation", "Run 3", "87", "−0.13"],
      ["Mental rotation", "Run 4", "87", "−0.06"],
      ["Mental rotation", "Run 5", "86", "−0.21"],
      ["Mental rotation", "Run 6", "86", "−0.14"],
      ["Pre-session", "Mood", "87", "+0.14"],
      ["Pre-session", "Mindfulness", "87", "+0.03"],
      ["Pre-session", "Motivation", "87", "−0.21"],
      ["Pre-session", "Last-night sleep", "87", "+0.04"],
      ["Pre-session", "Usual sleep", "87", "−0.02"],
      ["Pre-session", "Alertness", "87", "−0.13"],
      ["Pre-session", "Stimulant doses / 12 h", "73", "−0.13"],
      ["Pre-session", "Stimulant doses / 2 h", "87", "−0.16"],
      ["Pre-session", "Stimulant normality", "87", "−0.03"],
      ["Pre-session", "Tobacco", "87", "−0.00"],
      ["Pre-session", "Tobacco normality", "85", "−0.18"],
      ["Pre-session", "Alcohol", "87", "+0.13"],
      ["Pre-session", "Last meal", "74", "+0.05"],
      ["Pre-session", "Last pills", "87", "+0.08"],
    ],
  },
  {
    id: "comparison",
    title: "Bottom-group comparison",
    description:
      "The lowest 27 model participants and lowest 27 behavioral performers shared 18 participants.",
    columns: ["Result", "Value"],
    rows: [
      ["Behaviorally eligible participants", "86"],
      ["Bottom-27 behavioral cutoff", "51.875%"],
      ["Shared participants", "18 / 27 · 66.7%"],
      ["Shared IDs", "A34, A27, B67, B71, C82, A11, B64, B72, A30, A42, A7, A16, A28, B80, A5, A40, A14, A47"],
      ["Left-handed subgroup", "n = 6 · mean 61.25%"],
    ],
  },
  {
    id: "distributions",
    title: "Participant-level distributions",
    description:
      "Model and behavioral distributions reported before the final held-out test.",
    columns: ["Measure", "Model BA", "Behavioral accuracy"],
    rows: [
      ["Participants", "67", "66"],
      ["Mean", "68.73%", "63.74%"],
      ["Median", "66.77%", "57.81%"],
      ["Standard deviation", "13.64 pp", "15.80 pp"],
      ["Minimum", "46.46%", "40.62%"],
      ["Maximum", "99.15%", "99.38%"],
      ["Above chance", "62", "50"],
      ["10th percentile", "52.07%", "47.81%"],
      ["Worst-decile mean", "49.06%", "45.45%"],
      ["Below 50%", "5", "15"],
    ],
  },
  {
    id: "training-history",
    title: "Printed training history",
    description:
      "Checkpointed epoch readouts from the final fit; early stopping occurred at epoch 60.",
    columns: ["Epoch", "Train loss", "Validation loss", "Validation BA"],
    rows: [
      ["1", "0.6545", "0.6375", "64.7%"],
      ["5", "0.5750", "0.6051", "65.8%"],
      ["10", "0.5682", "0.6029", "65.3%"],
      ["15", "0.5660", "0.6013", "65.4%"],
      ["20", "0.5647", "0.6002", "65.5%"],
      ["25", "0.5612", "0.6005", "66.0%"],
      ["30", "0.5622", "0.6005", "66.5%"],
      ["35", "0.5618", "0.6000", "66.3%"],
      ["40", "0.5616", "0.6001", "66.3%"],
      ["45", "0.5609", "0.5998", "66.0%"],
      ["50", "0.5619", "0.5991", "66.6%"],
      ["55", "0.5565", "0.5993", "66.5%"],
      ["60", "0.5592", "0.5991", "66.8%"],
    ],
  },
  {
    id: "confusion-matrices",
    title: "Confusion matrices",
    description:
      "Counts independently reproduce the reported accuracy, balanced accuracy, macro F1, precision, recall, and κ.",
    columns: ["Split", "Left→left", "Left→right", "Right→left", "Right→right"],
    rows: [
      ["Train · in-sample", "4,341", "1,695", "1,859", "4,134"],
      ["Validation · held-out", "880", "392", "459", "804"],
      ["Test · held-out", "962", "352", "491", "850"],
    ],
  },
  {
    id: "pipeline-counts",
    title: "Pipeline counts and retention",
    description:
      "Recorded transitions from transformed trials through artifact rejection and physiological cleaning.",
    columns: ["Stage", "Input", "Retained", "Excluded / rejected", "Participants"],
    rows: [
      ["Time-frequency recordings", "520 recordings", "476 recordings", "42 paper flag · 2 structure", "80"],
      ["Amplitude artifact screening", "19,040 trials", "17,598 trials", "1,442 · 7.57%", "80"],
      ["Eligible modeling index", "476 runs", "461 runs · 17,439 trials", "15 runs", "79"],
      ["Physiological train cleaning", "12,156 trials", "12,029 trials · 98.96%", "127 EMG", "55"],
      ["Physiological validation cleaning", "2,570 trials", "2,535 trials · 98.64%", "35 EMG", "12"],
      ["Physiological test cleaning", "2,713 trials", "2,655 trials · 97.86%", "58 EMG", "12"],
    ],
  },
  {
    id: "gender-run-means",
    title: "Source gender-code run means",
    description:
      "The website preserves the dataset’s numeric source coding rather than inferring category labels.",
    columns: ["Source code", "n", "Run 3", "Run 4", "Run 5", "Run 6"],
    rows: [
      ["1", "45", "57.97%", "63.33%", "62.50%", "64.11%"],
      ["2", "42", "66.16%", "63.93%", "63.84%", "65.61%"],
    ],
  },
  {
    id: "model-bottom-third",
    title: "Lowest 27 participant model results",
    description:
      "The notebook’s bottom third across 79 train, validation, and test participants. Train rows are in-sample.",
    columns: ["Rank", "Split", "Participant", "Trials", "Accuracy", "BA", "Macro F1", "Precision", "Recall", "ROC AUC"],
    rows: [
      ["1", "Test", "A43", "222", "47.30%", "47.24%", "47.06%", "47.20%", "47.24%", "47.92%"],
      ["2", "Train", "A34", "232", "47.84%", "47.76%", "47.23%", "47.66%", "47.76%", "49.80%"],
      ["3", "Train", "A27", "227", "48.46%", "48.46%", "48.45%", "48.46%", "48.46%", "44.71%"],
      ["4", "Validation", "B77", "236", "48.73%", "48.77%", "48.62%", "48.76%", "48.77%", "47.82%"],
      ["5", "Train", "B67", "235", "50.21%", "50.20%", "50.16%", "50.20%", "50.20%", "50.09%"],
      ["6", "Test", "B71", "198", "50.51%", "50.53%", "50.48%", "50.53%", "50.53%", "55.21%"],
      ["7", "Validation", "C82", "222", "51.80%", "51.79%", "51.79%", "51.79%", "51.79%", "52.89%"],
      ["8", "Train", "B68", "214", "51.87%", "51.87%", "51.74%", "51.89%", "51.87%", "54.57%"],
      ["9", "Test", "A11", "237", "52.32%", "52.38%", "52.24%", "52.40%", "52.38%", "56.86%"],
      ["10", "Train", "A12", "228", "52.63%", "52.39%", "51.55%", "52.59%", "52.39%", "51.28%"],
      ["11", "Validation", "A45", "234", "52.56%", "52.56%", "52.54%", "52.57%", "52.56%", "52.73%"],
      ["12", "Train", "B64", "228", "52.63%", "52.63%", "52.63%", "52.63%", "52.63%", "54.39%"],
      ["13", "Train", "B72", "226", "53.54%", "53.56%", "53.54%", "53.57%", "53.56%", "58.25%"],
      ["14", "Train", "A30", "231", "53.68%", "53.76%", "53.65%", "53.78%", "53.76%", "55.61%"],
      ["15", "Train", "A42", "235", "54.04%", "54.15%", "53.74%", "54.28%", "54.15%", "57.37%"],
      ["16", "Test", "A7", "236", "55.08%", "55.08%", "54.35%", "55.44%", "55.08%", "57.96%"],
      ["17", "Train", "A16", "236", "56.36%", "56.33%", "56.29%", "56.36%", "56.33%", "57.67%"],
      ["18", "Train", "B70", "154", "56.49%", "56.44%", "56.40%", "56.41%", "56.44%", "60.74%"],
      ["19", "Validation", "A28", "230", "57.39%", "57.41%", "57.38%", "57.42%", "57.41%", "61.82%"],
      ["20", "Train", "B80", "233", "58.37%", "58.39%", "58.37%", "58.40%", "58.39%", "65.12%"],
      ["21", "Test", "A46", "177", "58.76%", "58.62%", "58.63%", "58.63%", "58.62%", "64.25%"],
      ["22", "Train", "A5", "237", "59.07%", "59.04%", "59.03%", "59.06%", "59.04%", "61.16%"],
      ["23", "Test", "B81", "231", "59.74%", "60.03%", "59.14%", "60.78%", "60.03%", "62.38%"],
      ["24", "Train", "A40", "188", "60.11%", "60.11%", "60.01%", "60.20%", "60.11%", "65.49%"],
      ["25", "Train", "A14", "227", "60.35%", "60.35%", "60.35%", "60.35%", "60.35%", "64.71%"],
      ["26", "Train", "A47", "235", "60.43%", "60.38%", "60.38%", "60.40%", "60.38%", "63.34%"],
      ["27", "Train", "A36", "232", "60.78%", "60.89%", "60.74%", "60.97%", "60.89%", "65.23%"],
    ],
  },
  {
    id: "behavioral-bottom-27",
    title: "Lowest 27 behavioral performers",
    description:
      "Strict mean online accuracy across Runs 3–6; 86 participants had all four values.",
    columns: ["Rank", "Participant", "Mean accuracy"],
    rows: [
      ["1", "A30", "40.625%"],
      ["2", "B72", "44.375%"],
      ["3", "C83", "44.375%"],
      ["4", "A17", "45.625%"],
      ["5", "A27", "45.625%"],
      ["6", "A47", "46.250%"],
      ["7", "A53", "46.250%"],
      ["8", "A37", "47.500%"],
      ["9", "A54", "47.500%"],
      ["10", "A7", "47.500%"],
      ["11", "B71", "47.500%"],
      ["12", "A28", "48.125%"],
      ["13", "A34", "48.125%"],
      ["14", "A57", "48.750%"],
      ["15", "A40", "49.0625%"],
      ["16", "A14", "49.375%"],
      ["17", "A16", "49.375%"],
      ["18", "B80", "49.375%"],
      ["19", "C82", "49.375%"],
      ["20", "B64", "50.000%"],
      ["21", "A4", "51.250%"],
      ["22", "A5", "51.250%"],
      ["23", "A11", "51.875%"],
      ["24", "A23", "51.875%"],
      ["25", "A41", "51.875%"],
      ["26", "A42", "51.875%"],
      ["27", "B67", "51.875%"],
    ],
  },
] as const;
