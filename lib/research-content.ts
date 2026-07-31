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
      { value: "12", label: "CSP features", note: "six per band" },
      { value: "220", label: "trials rejected", note: "EMG artifact rule" },
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
      { value: "12", label: "input features", note: "mu + beta CSP" },
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
      "The final MLP reached 68.25% accuracy on 12 participants excluded from development.",
    takeaway:
      "The result was 1.75 percentage points below the 70% research goal.",
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
      { value: "68.25%", label: "our MLP", note: "final test accuracy" },
      { value: "68.30%", label: "balanced accuracy", note: "final test" },
      { value: "−1.75 pp", label: "goal difference", note: "accuracy minus goal" },
      { value: "79", label: "model participants", note: "all three splits" },
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
    label: "Profile factors",
    title: "Motivation had the highest mean importance",
    note:
      "This separate Extra Trees analysis predicted participant performance. Wide error bars show substantial uncertainty.",
    src: "/results/model/stage-2/xgboost_permutation_importance.png",
    width: 1600,
    height: 900,
    alt: "Held-out permutation importance for the participant-performance profile model.",
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
    id: "summary",
    label: "Final summary",
    title: "Participant accuracy summary",
    note:
      "Across 66 matched participants, the MLP mean was 68.73% and the behavioral BCI mean was 63.74%.",
    src: "/results/model/stage-9/final_locked_summary.png",
    width: 1600,
    height: 900,
    alt: "Histograms comparing held-out CSP MLP accuracy with behavioral BCI accuracy across 66 matched participants.",
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
  {
    id: "differences",
    label: "Who improved?",
    title: "Results differ by person",
    note: "Blue favors the MLP; red favors the behavioral BCI. One average hides this variation.",
    src: "/results/model/stage-9/participant_run_difference.png",
    width: 1000,
    height: 1200,
    alt: "CSP MLP minus behavioral BCI accuracy for each of 66 matched participants.",
  },
] as const;
