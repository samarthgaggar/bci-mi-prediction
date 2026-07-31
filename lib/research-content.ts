export type Metric = {
  value: string;
  label: string;
  note: string;
};

export type SourceReference = {
  label: string;
  href: string;
};

export type PipelineVisual =
  | "question"
  | "acquisition"
  | "cleaning"
  | "eda"
  | "extra-trees"
  | "modeling"
  | "prediction"
  | "evaluation"
  | "validation"
  | "communication"
  | "comparison";

export type PipelineStep = {
  id: string;
  number: string;
  navLabel: string;
  title: string;
  statement: string;
  takeaway: string;
  visual: PipelineVisual;
  side: "left" | "right";
  metrics: readonly Metric[];
  sources: readonly SourceReference[];
};

export type FigureChoice = {
  id: string;
  label: string;
  title: string;
  note: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const primarySources = {
  zenodo: {
    label: "Dataset",
    href: "https://zenodo.org/records/8089820",
  },
  paper: {
    label: "Scientific Data paper",
    href: "https://www.nature.com/articles/s41597-023-02445-z",
  },
  analysis: {
    label: "Analysis repository",
    href: "https://github.com/ucd-cosmos-data/26-the-data-miners-analysis/tree/CleaningEDA",
  },
} as const satisfies Record<string, SourceReference>;

export const pipelineSteps: readonly PipelineStep[] = [
  {
    id: "problem",
    number: "01",
    navLabel: "Problem",
    title: "Problem Formulation",
    statement:
      "How can we improve the prediction of imagined motor movements while achieving consistent performance across participants with diverse demographic, psychological, and behavioral profiles?",
    takeaway:
      "The model predicts left-hand or right-hand motor imagery for people it did not train on.",
    visual: "question",
    side: "left",
    metrics: [
      { value: "2", label: "classes", note: "left or right" },
      { value: "70%", label: "project benchmark", note: "comparison target" },
      { value: "1×", label: "final test", note: "used once" },
    ],
    sources: [primarySources.paper],
  },
  {
    id: "acquisition",
    number: "02",
    navLabel: "Acquire",
    title: "Data Acquisition",
    statement:
      "A public BCI dataset records motor imagery across 87 participants.",
    takeaway:
      "The dataset lets us compare results across many different participants.",
    visual: "acquisition",
    side: "right",
    metrics: [
      { value: "87", label: "participants", note: "A, B, and C cohorts" },
      { value: "694", label: "recordings", note: "GDF files" },
      { value: "512 Hz", label: "sampling", note: "per channel" },
      { value: "32", label: "channels", note: "27 EEG · 3 EOG · 2 EMG" },
    ],
    sources: [primarySources.zenodo, primarySources.paper],
  },
  {
    id: "cleaning",
    number: "03",
    navLabel: "Clean",
    title: "Preprocessing / Data Cleaning",
    statement:
      "We cleaned participant performance data and EEG recordings in separate, reproducible pipelines.",
    takeaway:
      "The CSV supplies the comparison scores, while the cleaned GDF epochs supply the model inputs.",
    visual: "cleaning",
    side: "left",
    metrics: [
      { value: "87", label: "participant rows", note: "headings removed" },
      { value: "73", label: "cleaned columns", note: "numeric and text fields" },
      { value: "4", label: "runs averaged", note: "Perf_RUN_3 to Perf_RUN_6" },
    ],
    sources: [primarySources.analysis],
  },
  {
    id: "eda",
    number: "04",
    navLabel: "Explore",
    title: "Exploratory Data Analysis",
    statement:
      "Performance varies more between people than it changes across online runs.",
    takeaway:
      "The average does not show how much results vary from one person to another.",
    visual: "eda",
    side: "right",
    metrics: [
      { value: "61.92%", label: "Run 3 mean", note: "online accuracy" },
      { value: "64.83%", label: "Run 6 mean", note: "online accuracy" },
      { value: "−.13 to +.08", label: "personality correlations", note: "EX, AX, TM, IN, and SC" },
    ],
    sources: [primarySources.analysis, primarySources.zenodo],
  },
  {
    id: "extra-trees",
    number: "05",
    navLabel: "Profiles",
    title: "Extra Trees Profile Analysis",
    statement:
      "Extra Trees explored whether participant profiles could predict average BCI performance, but the results were inconclusive.",
    takeaway:
      "It ranked first among the tested profile models, but barely improved on the dummy baseline and did not generalize reliably.",
    visual: "extra-trees",
    side: "left",
    metrics: [
      { value: "15.825", label: "Extra Trees RMSE", note: "held-out percentage points" },
      { value: "16.031", label: "dummy RMSE", note: "mean-only prediction" },
      { value: "-0.071", label: "held-out R²", note: "no reliable explained variance" },
      { value: "10.036", label: "overfit gap", note: "test minus train RMSE" },
    ],
    sources: [primarySources.analysis],
  },
  {
    id: "prediction",
    number: "06",
    navLabel: "Predict",
    title: "Inference & Prediction",
    statement:
      "The final model uses 12 CSP features from each trial to predict left-hand or right-hand motor imagery.",
    takeaway:
      "The output is a left or right label. It does not read a person's thoughts.",
    visual: "prediction",
    side: "right",
    metrics: [
      { value: "12", label: "input features", note: "mu + beta CSP" },
      { value: "16 → 8", label: "hidden units", note: "two ReLU layers" },
      { value: "2", label: "output classes", note: "left or right" },
    ],
    sources: [primarySources.analysis, primarySources.paper],
  },
  {
    id: "modeling",
    number: "07",
    navLabel: "Model",
    title: "Modeling",
    statement:
      "The CSP MLP reached 69.10% balanced accuracy in participant-held-out training folds and 66.42% on validation participants.",
    takeaway: "Every development score kept participants in separate groups.",
    visual: "modeling",
    side: "left",
    metrics: [
      { value: "69.10%", label: "training OOF", note: "balanced accuracy" },
      { value: "66.42%", label: "validation", note: "balanced accuracy" },
      { value: "73.09%", label: "validation AUC", note: "held-out participants" },
    ],
    sources: [primarySources.analysis],
  },
  {
    id: "validation",
    number: "08",
    navLabel: "Validate",
    title: "Validation",
    statement:
      "We split the data into training, validation, and test groups by participant. Trials from one person stayed in the same group.",
    takeaway:
      "We used the test set once and did not change the models afterward.",
    visual: "validation",
    side: "right",
    metrics: [
      { value: "55", label: "training people", note: "fit the model" },
      { value: "12", label: "validation people", note: "model selection only" },
      { value: "12", label: "test participants", note: "never used to fit" },
      { value: "17,219", label: "retained trials", note: "across all three splits" },
    ],
    sources: [primarySources.analysis],
  },
  {
    id: "evaluation",
    number: "09",
    navLabel: "Evaluate",
    title: "Evaluation",
    statement:
      "The final MLP reached 68.25% accuracy on 12 participants excluded from development.",
    takeaway:
      "The result was 1.75 percentage points below the 70% project benchmark.",
    visual: "evaluation",
    side: "left",
    metrics: [
      { value: "68.25%", label: "test accuracy", note: "held-out participants" },
      { value: "68.30%", label: "balanced accuracy", note: "left and right weighted equally" },
      { value: "68.46%", label: "macro precision", note: "average across classes" },
      { value: "2,655", label: "test trials", note: "12 participants" },
    ],
    sources: [primarySources.analysis, primarySources.paper],
  },
  {
    id: "communication",
    number: "10",
    navLabel: "Report",
    title: "Report the Results",
    statement:
      "This is a research result. It is not a clinical tool.",
    takeaway:
      "The report includes the final score, the missed benchmark, and the study limits.",
    visual: "communication",
    side: "right",
    metrics: [
      { value: "68.25%", label: "our MLP", note: "final test accuracy" },
      { value: "68.30%", label: "balanced accuracy", note: "final test" },
      { value: "−1.75 pp", label: "benchmark difference", note: "accuracy minus benchmark" },
      { value: "79", label: "model participants", note: "all three splits" },
    ],
    sources: [
      primarySources.analysis,
      primarySources.zenodo,
      primarySources.paper,
    ],
  },
  {
    id: "comparison",
    number: "11",
    navLabel: "Compare",
    title: "Model and Performance Comparison",
    statement:
      "For 66 matched participants, we compared held-out model balanced accuracy with each participant's aggregated mean of Perf_RUN_3, Perf_RUN_4, Perf_RUN_5, and Perf_RUN_6.",
    takeaway:
      "The model mean was 4.99 percentage points higher and varied less between participants than the aggregated behavioral performance scores.",
    visual: "comparison",
    side: "left",
    metrics: [
      { value: "68.73%", label: "model mean", note: "held-out balanced accuracy" },
      { value: "63.74%", label: "performance mean", note: "aggregated Runs 3 to 6" },
      { value: "13.75 vs 15.80", label: "standard deviation", note: "model vs performance" },
      { value: "5 vs 15", label: "below 50%", note: "model vs performance" },
      { value: "18 / 27", label: "shared low performers", note: "66.7% overlap" },
    ],
    sources: [primarySources.analysis],
  },
] as const;

export const edaFigures: readonly FigureChoice[] = [
  {
    id: "spread",
    label: "Participant spread",
    title: "Performance varies widely",
    note: "Each histogram is one online run. The broad spread appears in all four.",
    src: "/results/performance-by-run.png",
    width: 1484,
    height: 889,
    alt: "Four histograms showing participant online BCI accuracy for Runs 3 through 6.",
  },
  {
    id: "run-means",
    label: "Run means",
    title: "The run averages stay close",
    note: "Overlapping confidence intervals do not show a clear run-to-run improvement.",
    src: "/results/mean-performance-by-run.png",
    width: 1333,
    height: 884,
    alt: "Mean online BCI accuracy for Runs 3 through 6 with 95 percent confidence intervals.",
  },
  {
    id: "personality",
    label: "Personality factors",
    title: "Broad personality factors do not separate performance",
    note:
      "EX, AX, TM, IN, and SC scores overlap widely across performance levels, so these plots do not show a reliable predictive pattern.",
    src: "/results/eda/personality-vs-performance.png",
    width: 2083,
    height: 1183,
    alt: "Five scatter plots comparing Extraversion, Anxiety, Tough-Mindedness, Independence, and Self-Control scores with mean online BCI performance.",
  },
] as const;

export const developmentModels = [
  { name: "Training OOF", value: 69.1, label: "69.10%", selected: false },
  { name: "Validation", value: 66.42, label: "66.42%", selected: true },
  { name: "Chance", value: 50, label: "50.00%", selected: false },
] as const;

export const modelingFigures: readonly FigureChoice[] = [
  {
    id: "comparison",
    label: "Model scores",
    title: "Development comparison",
    note:
      "Each score was measured on participants who were not used to train that fold.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
  {
    id: "training",
    label: "MLP training",
    title: "Validation leveled near 66%",
    note: "The selected checkpoint had the lowest validation loss at epoch 48.",
    src: "/results/model/stage-6/training_curves.png",
    width: 1600,
    height: 900,
    alt: "Training loss, validation loss, and validation balanced accuracy across 60 CSP MLP epochs.",
  },
] as const;

export const predictionFigures: readonly FigureChoice[] = [
  {
    id: "classifier",
    label: "MLP architecture",
    title: "Twelve CSP features pass through two hidden layers",
    note:
      "The 12 inputs feed 16 ReLU units, then 8 ReLU units, before the model produces two output scores.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
] as const;

export const lockedModels = [
  { name: "Accuracy", value: 68.25, label: "68.25%", selected: true },
  { name: "Balanced accuracy", value: 68.3, label: "68.30%", selected: false },
  { name: "Macro F1", value: 68.19, label: "68.19%", selected: false },
  { name: "Macro precision", value: 68.46, label: "68.46%", selected: false },
  { name: "Macro recall", value: 68.3, label: "68.30%", selected: false },
] as const;

export const evaluationFigures: readonly FigureChoice[] = [
  {
    id: "locked",
    label: "Final scores",
    title: "Final test metrics",
    note: "Accuracy, balanced accuracy, precision, recall, and F1 all stayed near 68%.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
  {
    id: "differences",
    label: "Who improved?",
    title: "Results differ by person",
    note:
      "Blue favors the MLP; red favors the behavioral BCI. One average hides this variation.",
    src: "/results/model/stage-9/participant_run_difference.png",
    width: 1000,
    height: 1200,
    alt: "CSP MLP minus behavioral BCI accuracy for each of 66 matched participants.",
  },
] as const;

export const validationFigures: readonly FigureChoice[] = [
  {
    id: "split",
    label: "Split design",
    title: "People stay in one partition",
    note: "The 55 training, 12 validation, and 12 test participants never overlap.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
] as const;

export const comparisonFigures: readonly FigureChoice[] = [
  {
    id: "histograms",
    label: "Histograms",
    title: "The model distribution shifts higher",
    note:
      "The same 66 participants are shown in both panels. Red lines mark means; dashed lines mark 50% chance.",
    src: "/results/model/stage-9/final_locked_summary.png",
    width: 1600,
    height: 900,
    alt: "Histograms comparing held-out CSP MLP accuracy with aggregated behavioral BCI accuracy across 66 matched participants.",
  },
  {
    id: "bottom-27-overlap",
    label: "Bottom 27 overlap",
    title: "Most low performers appear in both lists",
    note:
      "Eighteen participants are shared, while nine appear only in each bottom-27 list.",
    src: "/results/model/stage-9/bottom_27_overlap.png",
    width: 1600,
    height: 1000,
    alt: "Overlap diagram showing 18 shared participants, 9 model-only participants, and 9 performance-only participants in the two bottom-27 lists.",
  },
] as const;
