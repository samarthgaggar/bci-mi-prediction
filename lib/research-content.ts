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
  | "modeling"
  | "prediction"
  | "evaluation"
  | "validation"
  | "communication";

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
      { value: "70%", label: "research goal", note: "set before testing" },
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
      "We kept the raw files unchanged and recorded each cleaning step.",
    takeaway: "The cleaning process was fixed before we tested the models.",
    visual: "cleaning",
    side: "left",
    metrics: [
      { value: "694 / 694", label: "hashes verified", note: "zero failures" },
      { value: "135", label: "EEG features", note: "spectral inputs" },
      { value: "0", label: "post-test changes", note: "no refit or tuning" },
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
      { value: "−.24 to +.24", label: "ILS correlations", note: "weak patterns" },
    ],
    sources: [primarySources.analysis, primarySources.zenodo],
  },
  {
    id: "modeling",
    number: "05",
    navLabel: "Model",
    title: "Modeling",
    statement:
      "Logistic regression had the highest development score. The MLP was close behind.",
    takeaway: "More complex did not automatically mean more accurate.",
    visual: "modeling",
    side: "left",
    metrics: [
      { value: "60.40%", label: "logistic", note: "development accuracy" },
      { value: "60.07%", label: "general MLP", note: "development accuracy" },
      { value: "58.58%", label: "XGBoost", note: "development accuracy" },
    ],
    sources: [primarySources.analysis],
  },
  {
    id: "prediction",
    number: "06",
    navLabel: "Predict",
    title: "Inference & Prediction",
    statement:
      "The final models use EEG features from each trial to predict left-hand or right-hand motor imagery.",
    takeaway:
      "The output is a left or right label. It does not read a person's thoughts.",
    visual: "prediction",
    side: "right",
    metrics: [
      { value: "135", label: "input features", note: "mu + beta power" },
      { value: "2", label: "output classes", note: "left or right" },
      { value: "1", label: "prediction", note: "for each trial" },
    ],
    sources: [primarySources.analysis, primarySources.paper],
  },
  {
    id: "evaluation",
    number: "07",
    navLabel: "Evaluate",
    title: "Evaluation",
    statement:
      "The final MLP reached 60.20% on 22 participants excluded from development.",
    takeaway:
      "Our MLP was our best model, but it scored below the original BCI and the 70% goal.",
    visual: "evaluation",
    side: "left",
    metrics: [
      { value: "60.20%", label: "general MLP", note: "final test accuracy" },
      { value: "62.61%", label: "original BCI", note: "same people and runs" },
      { value: "−2.41 pp", label: "difference", note: "MLP minus original" },
      { value: "5,280", label: "test trials", note: "22 participants" },
    ],
    sources: [primarySources.analysis, primarySources.paper],
  },
  {
    id: "validation",
    number: "08",
    navLabel: "Validate",
    title: "Validation",
    statement:
      "We split the data by participant before final testing. Trials from one person stayed in the same group.",
    takeaway:
      "We used the test set once and did not change the models afterward.",
    visual: "validation",
    side: "right",
    metrics: [
      { value: "65", label: "development people", note: "model selection only" },
      { value: "22", label: "test participants", note: "never used to fit" },
      { value: "5,280", label: "test trials", note: "Runs 3 to 6" },
      { value: "0", label: "post-test changes", note: "model stayed unchanged" },
    ],
    sources: [primarySources.analysis],
  },
  {
    id: "communication",
    number: "09",
    navLabel: "Report",
    title: "Report the Results",
    statement:
      "This is a research result. It is not a clinical tool.",
    takeaway:
      "The report includes the final score, the missed goal, and the study limits.",
    visual: "communication",
    side: "left",
    metrics: [
      { value: "60.20%", label: "our MLP", note: "final test accuracy" },
      { value: "62.61%", label: "original BCI", note: "final test accuracy" },
      { value: "−2.41 pp", label: "difference", note: "our MLP minus BCI" },
      { value: "112", label: "checks passed", note: "final package" },
    ],
    sources: [
      primarySources.analysis,
      primarySources.zenodo,
      primarySources.paper,
    ],
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
    id: "learning-style",
    label: "Learning style",
    title: "No strong linear pattern",
    note:
      "The correlations range from −0.24 to +0.24. They do not show cause and effect.",
    src: "/results/learning-style-correlations.png",
    width: 2683,
    height: 1330,
    alt: "Scatter plots comparing learning-style scores with mean online BCI performance.",
  },
] as const;

export const developmentModels = [
  { name: "Logistic", value: 60.4, label: "60.40%", selected: true },
  { name: "General MLP", value: 60.07, label: "60.07%", selected: false },
  { name: "XGBoost", value: 58.58, label: "58.58%", selected: false },
  { name: "Chance", value: 51.07, label: "51.07%", selected: false },
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
    title: "Validation leveled near 60%",
    note: "The compact networks improved quickly, then flattened. The final model used nine epochs.",
    src: "/results/model/stage-6/training_curves.png",
    width: 1601,
    height: 916,
    alt: "Validation accuracy by epoch for three compact neural-network architectures.",
  },
] as const;

export const predictionFigures: readonly FigureChoice[] = [
  {
    id: "classifier",
    label: "Classifier path",
    title: "One trial produces one prediction",
    note:
      "The model receives EEG features. It does not receive thoughts, words, or images.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
  {
    id: "xgboost",
    label: "XGBoost features",
    title: "Visual-verbal score had the highest importance",
    note:
      "This separate model predicted participant performance. The chart shows relationships, not cause and effect.",
    src: "/results/model/stage-2/xgboost_permutation_importance.png",
    width: 1591,
    height: 1186,
    alt: "Held-out permutation importance for the participant-performance XGBoost model.",
  },
] as const;

export const lockedModels = [
  { name: "Original BCI", value: 62.61, label: "62.61%", selected: false },
  { name: "General MLP", value: 60.2, label: "60.20%", selected: true },
  { name: "Routed", value: 59.32, label: "59.32%", selected: false },
  { name: "Logistic", value: 58.81, label: "58.81%", selected: false },
  { name: "Specialist", value: 58.04, label: "58.04%", selected: false },
] as const;

export const evaluationFigures: readonly FigureChoice[] = [
  {
    id: "locked",
    label: "Final scores",
    title: "Final model comparison",
    note: "The general MLP led our models. The original BCI scored higher.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
  {
    id: "summary",
    label: "Final summary",
    title: "Overall and actual-low results",
    note:
      "This subgroup has only six people, so it is too small for a firm conclusion.",
    src: "/results/model/stage-9/final_locked_summary.png",
    width: 2132,
    height: 890,
    alt: "Final test summary for all participants and the actual-low subgroup.",
  },
] as const;

export const validationFigures: readonly FigureChoice[] = [
  {
    id: "split",
    label: "Split design",
    title: "People stay in one partition",
    note: "The development and test groups contain different participants.",
    src: "",
    width: 0,
    height: 0,
    alt: "",
  },
  {
    id: "differences",
    label: "Who improved?",
    title: "Results differ by person and run",
    note: "Blue favors the MLP; red favors the original BCI. One average hides this variation.",
    src: "/results/model/stage-9/participant_run_difference.png",
    width: 995,
    height: 1240,
    alt: "Heatmap of general MLP minus original BCI accuracy by participant and run.",
  },
] as const;
