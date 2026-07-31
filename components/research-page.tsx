"use client";

import Image from "next/image";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  comparisonFigures,
  developmentModels,
  edaFigures,
  evaluationFigures,
  lockedModels,
  modelingFigures,
  pipelineSteps,
  predictionFigures,
  primarySources,
  validationFigures,
  type FigureChoice,
  type PipelineStep,
} from "../lib/research-content";

const BrainScene = lazy(() => import("./brain-scene"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smooth(value: number) {
  const bounded = clamp(value);
  return bounded * bounded * (3 - 2 * bounded);
}

export function ResearchPage() {
  const [activeId, setActiveId] = useState("intro");
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [webGL, setWebGL] = useState(true);
  const autoScrollFrameRef = useRef(0);
  const autoScrollTimeRef = useRef(0);
  const autoScrollPauseRef = useRef(0);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("bci-theme");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const setup = window.requestAnimationFrame(() => {
      setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark");
      setMotionEnabled(!reducedMotion);
      setWebGL(supportsWebGL());
    });
    const idle = window.setTimeout(() => setSceneReady(true), 180);
    return () => {
      window.cancelAnimationFrame(setup);
      window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("bci-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "full" : "reduced";
  }, [motionEnabled]);

  useEffect(() => {
    const sections = ["intro", ...pipelineSteps.map((step) => step.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-24% 0px -42% 0px", threshold: [0.12, 0.35, 0.65] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(pageHeight > 0 ? clamp(window.scrollY / pageHeight) : 0);
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!autoScrollEnabled) {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollTimeRef.current = 0;
      autoScrollPauseRef.current = 0;
      return;
    }

    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const pixelsPerSecond = motionEnabled ? 82 : 44;

    const advance = (time: number) => {
      if (!autoScrollTimeRef.current) autoScrollTimeRef.current = time;
      const elapsed = Math.min(time - autoScrollTimeRef.current, 64);
      autoScrollTimeRef.current = time;
      const maximum =
        document.documentElement.scrollHeight - window.innerHeight;

      if (time >= autoScrollPauseRef.current) {
        if (window.scrollY >= maximum - 2) {
          window.scrollTo(0, 0);
          autoScrollPauseRef.current = time + 1200;
        } else {
          window.scrollBy(0, (pixelsPerSecond * elapsed) / 1000);
        }
      }
      autoScrollFrameRef.current = window.requestAnimationFrame(advance);
    };

    autoScrollFrameRef.current = window.requestAnimationFrame(advance);
    return () => {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [autoScrollEnabled, motionEnabled]);

  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        pipelineSteps.findIndex((step) => step.id === activeId),
    ),
    [activeId],
  );
  const introActive = activeId === "intro";
  const journeyProgress = motionEnabled
    ? progress
    : activeIndex / (pipelineSteps.length - 1);
  const enterZoom = smooth(journeyProgress / 0.15);
  const exitZoom = smooth((journeyProgress - 0.88) / 0.12);
  const brainOpacity = Math.max(
    1 - smooth((journeyProgress - 0.075) / 0.11),
    exitZoom,
  );
  const brainScale =
    exitZoom > 0 ? 5.8 - exitZoom * 4.8 : 1 + enterZoom * 4.8;

  return (
    <>
      <a className="skip-link" href="#problem">
        Skip to the pipeline
      </a>

      <header className="site-header">
        <a className="brand" href="#intro" aria-label="Motor Imagery BCI home">
          <span className="brand-mark" aria-hidden="true">
            BCI
          </span>
          <span>
            <strong>EEG → Prediction</strong>
            <small>Data science pipeline</small>
          </span>
        </a>

        <nav className="pipeline-nav" aria-label="Data science pipeline">
          {pipelineSteps.map((step) => (
            <a
              href={`#${step.id}`}
              key={step.id}
              aria-current={step.id === activeId ? "step" : undefined}
              title={step.title}
            >
              <span>{step.number}</span>
              <b>{step.navLabel}</b>
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className={`auto-scroll-button ${
              autoScrollEnabled ? "is-active" : ""
            }`}
            type="button"
            onClick={() => setAutoScrollEnabled((value) => !value)}
            aria-pressed={autoScrollEnabled}
          >
            Auto <b>{autoScrollEnabled ? "On" : "Off"}</b>
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => setMotionEnabled((value) => !value)}
            aria-pressed={!motionEnabled}
          >
            Motion <b>{motionEnabled ? "On" : "Off"}</b>
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() =>
              setTheme((value) => (value === "light" ? "dark" : "light"))
            }
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <div className="page-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      {!introActive && (
        <div
          className="pipeline-position"
          aria-live="polite"
          aria-label={`Step ${activeIndex + 1} of ${pipelineSteps.length}: ${
            pipelineSteps[activeIndex].title
          }`}
        >
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(pipelineSteps.length).padStart(2, "0")}</span>
        </div>
      )}

      <div
        className="visual-backdrop"
        aria-hidden="true"
        data-phase={
          introActive ||
          activeIndex === 0 ||
          activeIndex === pipelineSteps.length - 1
            ? "surface"
            : "interior"
        }
      >
        <div className="ambient-grid" />
        <Image
          className="backdrop-brain"
          src="/brain-anatomy.svg"
          alt=""
          width={1200}
          height={1200}
          priority
          unoptimized
          style={{
            opacity: brainOpacity,
            transform: `translate3d(-50%, -50%, 0) rotate(${
              motionEnabled ? -2 + enterZoom * 4 - exitZoom * 2 : 0
            }deg) scale(${brainScale})`,
          }}
        />
        {sceneReady && webGL ? (
          <Suspense fallback={null}>
            <BrainScene
              progress={journeyProgress}
              motionEnabled={motionEnabled}
              dark={theme === "dark"}
            />
          </Suspense>
        ) : null}
        <div className="neural-field">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <main>
        <IntroSection active={introActive} />
        {pipelineSteps.map((step, index) => (
          <PipelineSection
            active={step.id === activeId}
            first={index === 0}
            key={step.id}
            step={step}
          />
        ))}
      </main>

      <footer className="site-footer">
        <div>
          <span>Motor Imagery BCI</span>
          <strong>Motor imagery EEG research.</strong>
        </div>
        <nav aria-label="Research sources">
          <a href={primarySources.zenodo.href} target="_blank" rel="noreferrer">
            Dataset ↗
          </a>
          <a href={primarySources.paper.href} target="_blank" rel="noreferrer">
            Paper ↗
          </a>
          <a href={primarySources.analysis.href} target="_blank" rel="noreferrer">
            Analysis ↗
          </a>
        </nav>
      </footer>
    </>
  );
}

function IntroSection({ active }: { active: boolean }) {
  return (
    <section
      className={`intro-section ${active ? "is-active" : ""}`}
      id="intro"
      aria-labelledby="intro-title"
    >
      <div className="intro-layout">
        <div className="intro-copy">
          <p className="intro-kicker">
            Motor imagery <span>·</span> EEG <span>·</span> Machine learning
          </p>
          <h1 id="intro-title">
            Can computers <span>read minds?</span>
          </h1>
          <p className="intro-answer">
            No. EEG does not read thoughts. It records changes in brain activity
            while a person imagines moving a hand.
          </p>
          <p className="intro-project">
            We tested whether machine-learning models can recognize those
            patterns consistently across different people.
          </p>
          <dl className="intro-facts">
            <div>
              <dd>87</dd>
              <dt>participants</dt>
            </div>
            <div>
              <dd>694</dd>
              <dt>recordings</dt>
            </div>
            <div>
              <dd>2</dd>
              <dt>imagined movements</dt>
            </div>
          </dl>
          <a className="intro-action" href="#problem">
            <span>See how we tested it</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
        <div className="intro-visual-note" aria-hidden="true">
          <span>EEG measures activity</span>
          <strong>The model uses EEG patterns, not private thoughts.</strong>
        </div>
      </div>
    </section>
  );
}

function PipelineSection({
  step,
  active,
  first,
}: {
  step: PipelineStep;
  active: boolean;
  first: boolean;
}) {
  return (
    <section
      className={`pipeline-section is-${step.side} has-${step.visual} ${
        active ? "is-active" : ""
      } ${first ? "is-first" : ""}`}
      id={step.id}
      aria-labelledby={`${step.id}-title`}
    >
      <div className="pipeline-layout">
        <div className="stage-copy">
          <div className="stage-label">
            <span>{step.number}</span>
            <b>Data science pipeline</b>
          </div>
          <h1 id={`${step.id}-title`}>{step.title}</h1>
          <p className="stage-statement">{step.statement}</p>
          <p className="stage-takeaway">{step.takeaway}</p>
          <MetricStrip metrics={step.metrics} />
          <div className="stage-sources" aria-label="Sources">
            {step.sources.map((source) => (
              <a
                href={source.href}
                key={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="stage-visual">
          <StepVisual visual={step.visual} />
        </div>
      </div>
    </section>
  );
}

function MetricStrip({
  metrics,
}: {
  metrics: readonly { value: string; label: string; note: string }[];
}) {
  return (
    <dl className="metric-strip">
      {metrics.map((metric) => (
        <div key={`${metric.label}-${metric.value}`}>
          <dd>{metric.value}</dd>
          <dt>{metric.label}</dt>
          <small>{metric.note}</small>
        </div>
      ))}
    </dl>
  );
}

function StepVisual({ visual }: { visual: PipelineStep["visual"] }) {
  if (visual === "question") return <ProblemVisual />;
  if (visual === "acquisition") return <AcquisitionVisual />;
  if (visual === "cleaning") return <CleaningVisual />;
  if (visual === "eda") return <FigureSwitcher choices={edaFigures} />;
  if (visual === "extra-trees") return <ExtraTreesVisual />;
  if (visual === "modeling") {
    return (
      <FigureSwitcher
        choices={modelingFigures}
        renderCustom={(id) =>
          id === "comparison" ? (
            <BarComparison
              ariaLabel="Development balanced accuracy"
              data={developmentModels}
              max={70}
              min={50}
              scaleLabel="Scale: 50 to 70% balanced accuracy"
            />
          ) : null
        }
      />
    );
  }
  if (visual === "prediction") {
    return (
      <FigureSwitcher
        choices={predictionFigures}
        renderCustom={(id) =>
          id === "classifier" ? <PredictionFlow /> : null
        }
      />
    );
  }
  if (visual === "evaluation") {
    return (
      <FigureSwitcher
        choices={evaluationFigures}
        renderCustom={(id) =>
          id === "locked" ? (
            <BarComparison
              ariaLabel="Final test accuracy by system"
              data={lockedModels}
              max={70}
              min={50}
              scaleLabel="Scale: 50 to 70% · research goal at 70%"
              showGoal
            />
          ) : null
        }
      />
    );
  }
  if (visual === "validation") {
    return (
      <FigureSwitcher
        choices={validationFigures}
        renderCustom={(id) =>
          id === "split" ? <ValidationSplit /> : null
        }
      />
    );
  }
  if (visual === "comparison") {
    return <FigureSwitcher choices={comparisonFigures} />;
  }
  return <CommunicationVisual />;
}

function ProblemVisual() {
  return (
    <div className="problem-visual" role="img" aria-label="Binary EEG classification task">
      <span className="visual-kicker">Input / EEG signal</span>
      <div className="signal-line">
        {Array.from({ length: 22 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="binary-choice">
        <div>
          <span>769</span>
          <strong>Imagine left</strong>
        </div>
        <b>or</b>
        <div>
          <span>770</span>
          <strong>Imagine right</strong>
        </div>
      </div>
      <div className="visual-answer">
        <span>Output</span>
        <strong>One predicted class</strong>
      </div>
    </div>
  );
}

function AcquisitionVisual() {
  return (
    <div className="acquisition-visual" role="img" aria-label="BCI recording sequence">
      <div className="electrode-map">
        {Array.from({ length: 27 }, (_, index) => (
          <span key={index} />
        ))}
        <strong>27 EEG</strong>
      </div>
      <div className="run-sequence">
        {[
          ["Baseline", "Rest"],
          ["R1 to R2", "Acquire"],
          ["R3 to R6", "Online"],
          ["40 trials", "per run"],
        ].map(([value, label]) => (
          <div key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CleaningVisual() {
  const [activePipeline, setActivePipeline] = useState<"performance" | "eeg">(
    "performance",
  );
  const performanceSteps = [
    ["Load CSV", "skip source headings"],
    ["Participant rows", "keep 87 · no duplicates"],
    ["Clean values", "trim · standardize missing"],
    ["Numeric fields", "convert comma decimals"],
    ["Runs 3 to 6", "calculate mean accuracy"],
  ];
  const eegSteps = [
    ["Load GDF", "separate EEG · EOG · EMG"],
    ["Reference EEG", "common-average reference"],
    ["Remove eye noise", "ICA · EOG regression"],
    ["Filter signals", "mu 8 to 13 · beta 13 to 30 Hz"],
    ["Cue epochs", "0.5 to 3.0 seconds"],
    ["Reject muscle noise", "EMG-informed trial rule"],
  ];
  const activeSteps =
    activePipeline === "performance" ? performanceSteps : eegSteps;

  return (
    <div className="cleaning-visual" aria-label="Data cleaning pipelines">
      <div
        className="figure-tabs cleaning-tabs"
        role="tablist"
        aria-label="Choose a cleaning pipeline"
      >
        <button
          className={activePipeline === "performance" ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={activePipeline === "performance"}
          aria-controls="performance-cleaning-panel"
          id="performance-cleaning-tab"
          onClick={() => setActivePipeline("performance")}
        >
          Performance CSV
        </button>
        <button
          className={activePipeline === "eeg" ? "is-active" : ""}
          type="button"
          role="tab"
          aria-selected={activePipeline === "eeg"}
          aria-controls="eeg-cleaning-panel"
          id="eeg-cleaning-tab"
          onClick={() => setActivePipeline("eeg")}
        >
          EEG GDF files
        </button>
      </div>
      <div
        className="cleaning-panel"
        id={`${activePipeline}-cleaning-panel`}
        role="tabpanel"
        aria-labelledby={`${activePipeline}-cleaning-tab`}
      >
        <ol>
          {activeSteps.map(([title, label], index) => (
          <li key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{title}</strong>
            <small>{label}</small>
          </li>
          ))}
        </ol>
        <div className="quality-stamp">
          <strong>{activePipeline === "performance" ? "Saved" : "Prepared"}</strong>
          <span>
            {activePipeline === "performance"
              ? "Perfomances_cleaned.csv · 87 × 73"
              : "clean EEG epochs · participant splits preserved"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ExtraTreesVisual() {
  const models = [
    { name: "Extra Trees", value: 15.825, width: "93%" },
    { name: "Random forest", value: 15.914, width: "96%" },
    { name: "Dummy mean", value: 16.031, width: "100%" },
  ] as const;

  return (
    <div
      className="extra-trees-visual"
      role="img"
      aria-label="Extra Trees held-out profile analysis was inconclusive"
    >
      <div className="extra-trees-heading">
        <span>Repeated nested cross-validation</span>
        <strong>Lower RMSE is better</strong>
      </div>
      <ol>
        {models.map((model) => (
          <li key={model.name}>
            <div>
              <span>{model.name}</span>
              <strong>{model.value.toFixed(3)}</strong>
            </div>
            <i
              style={{ "--tree-width": model.width } as CSSProperties}
              aria-hidden="true"
            />
          </li>
        ))}
      </ol>
      <div className="extra-trees-warning">
        <strong>Inconclusive</strong>
        <p>
          The RMSE gain over the dummy was only 0.206 points. Held-out R² was
          negative, and RMSE rose from 5.789 in training to 15.825 on held-out
          participants.
        </p>
      </div>
      <small>
        Profile-feature rankings are exploratory and require an independent
        participant cohort.
      </small>
    </div>
  );
}

function FigureSwitcher({
  choices,
  renderCustom,
}: {
  choices: readonly FigureChoice[];
  renderCustom?: (id: string) => ReactNode;
}) {
  const [activeId, setActiveId] = useState(choices[0].id);
  const active = choices.find((choice) => choice.id === activeId) ?? choices[0];
  const custom = renderCustom?.(active.id);

  return (
    <div className="figure-switcher">
      <div className="figure-tabs" role="group" aria-label="Choose a figure">
        {choices.map((choice) => (
          <button
            className={choice.id === active.id ? "is-active" : ""}
            key={choice.id}
            type="button"
            onClick={() => setActiveId(choice.id)}
            aria-pressed={choice.id === active.id}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <div className="figure-stage">
        {custom ??
          (active.src ? (
            <a
              href={active.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full-size chart: ${active.title}`}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="(max-width: 809px) calc(100vw - 32px), 54vw"
              />
            </a>
          ) : null)}
      </div>
      <div className="figure-caption">
        <strong>{active.title}</strong>
        <p>{active.note}</p>
      </div>
    </div>
  );
}

function BarComparison({
  data,
  min,
  max,
  ariaLabel,
  scaleLabel,
  showGoal = false,
}: {
  data: readonly {
    name: string;
    value: number;
    label: string;
    selected: boolean;
  }[];
  min: number;
  max: number;
  ariaLabel: string;
  scaleLabel: string;
  showGoal?: boolean;
}) {
  return (
    <div className="bar-comparison" role="img" aria-label={ariaLabel}>
      <ul>
        {data.map((item) => {
          const width = ((item.value - min) / (max - min)) * 100;
          return (
            <li className={item.selected ? "is-selected" : ""} key={item.name}>
              <div>
                <span>{item.name}</span>
                <strong>{item.label}</strong>
              </div>
              <i
                style={{ "--bar-width": `${width}%` } as CSSProperties}
                aria-hidden="true"
              />
            </li>
          );
        })}
      </ul>
      <div className="bar-scale">
        <span>{min}%</span>
        <span>{scaleLabel}</span>
        <span>{max}%</span>
      </div>
      {showGoal && <span className="goal-marker">70% goal</span>}
    </div>
  );
}

function PredictionFlow() {
  const layers = [
    {
      label: "Input layer",
      value: "12 CSP inputs",
      note: "6 mu · 6 beta",
      nodes: 12,
      className: "is-input",
    },
    {
      label: "Hidden layer 1",
      value: "16 units",
      note: "ReLU activation",
      nodes: 16,
      className: "is-hidden",
    },
    {
      label: "Hidden layer 2",
      value: "8 units",
      note: "ReLU activation",
      nodes: 8,
      className: "is-hidden",
    },
    {
      label: "Output layer",
      value: "2 outputs",
      note: "left · right",
      nodes: 2,
      className: "is-output",
    },
  ] as const;
  const layerX = [72, 328, 584, 840] as const;
  const top = 42;
  const bottom = 350;
  const nodePositions = layers.map((layer, layerIndex) =>
    Array.from({ length: layer.nodes }, (_, nodeIndex) => ({
      x: layerX[layerIndex],
      y: top + (nodeIndex * (bottom - top)) / (layer.nodes - 1),
    })),
  );

  return (
    <div
      className="prediction-flow"
      role="img"
      aria-label="MLP architecture with 12 CSP inputs, hidden layers of 16 and 8 units, and 2 outputs for left-hand and right-hand predictions"
    >
      <svg
        className="prediction-tree"
        viewBox="0 0 912 448"
        aria-hidden="true"
      >
        <g className="network-connections">
          {nodePositions.slice(0, -1).flatMap((sourceLayer, layerIndex) =>
            sourceLayer.flatMap((source, sourceIndex) =>
              nodePositions[layerIndex + 1].map((target, targetIndex) => (
                <line
                  key={`${layerIndex}-${sourceIndex}-${targetIndex}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                />
              )),
            ),
          )}
        </g>
        {nodePositions.map((nodes, layerIndex) => (
          <g
            className={`network-tree-layer ${layers[layerIndex].className}`}
            key={layers[layerIndex].label}
          >
            {nodes.map((node, nodeIndex) => (
              <g key={nodeIndex}>
                <circle cx={node.x} cy={node.y} r="8" />
                {layers[layerIndex].className === "is-output" ? (
                  <text x={node.x} y={node.y + 3.5}>
                    {nodeIndex === 0 ? "L" : "R"}
                  </text>
                ) : null}
              </g>
            ))}
            <text
              className="network-layer-kicker"
              x={layerX[layerIndex]}
              y="388"
            >
              {layers[layerIndex].label}
            </text>
            <text
              className="network-layer-value"
              x={layerX[layerIndex]}
              y="414"
            >
              {layers[layerIndex].value}
            </text>
            <text
              className="network-layer-note"
              x={layerX[layerIndex]}
              y="434"
            >
              {layers[layerIndex].note}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ValidationSplit() {
  return (
    <div
      className="validation-split"
      role="img"
      aria-label="Sixty-seven development participants and twelve test participants remain in separate groups"
    >
      <div className="split-heading">
        <span>Participant split</span>
        <strong>Participants stay in separate groups.</strong>
      </div>
      <div className="split-groups">
        <div>
          <span>Development</span>
          <strong>67</strong>
          <small>55 train · 12 validate</small>
          <i style={{ "--split-width": "84.8%" } as CSSProperties} />
        </div>
        <div>
          <span>Final test</span>
          <strong>12</strong>
          <small>evaluate once</small>
          <i style={{ "--split-width": "15.2%" } as CSSProperties} />
        </div>
      </div>
      <p>
        <span aria-hidden="true">✓</span>
        No participant appears in both groups
      </p>
    </div>
  );
}

function CommunicationVisual() {
  return (
    <div className="communication-visual">
      <div className="final-score">
        <span>Final test result</span>
        <strong>68.25%</strong>
        <p>CSP MLP · 12 unseen participants</p>
      </div>
      <div className="result-context">
        <span>Result in context</span>
        <dl>
          <div>
            <dt>Participant mean MLP</dt>
            <dd>68.73%</dd>
            <i style={{ "--result-width": "68.73%" } as CSSProperties} />
          </div>
          <div>
            <dt>Behavioral BCI mean</dt>
            <dd>63.74%</dd>
            <i style={{ "--result-width": "63.74%" } as CSSProperties} />
          </div>
          <div>
            <dt>Research goal</dt>
            <dd>70.00%</dd>
            <i style={{ "--result-width": "70%" } as CSSProperties} />
          </div>
        </dl>
      </div>
      <p className="communication-status">
        <span aria-hidden="true">✓</span>
        Limits included in the report
      </p>
    </div>
  );
}
