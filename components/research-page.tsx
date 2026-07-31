"use client";

import Image from "next/image";
import { Activity, Brain, Hand, Monitor } from "lucide-react";
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
import {
  matchedDistributions,
  participantDifferences,
  personalityFactors,
  runDistributions,
  runMeans,
  trainingHistory,
} from "../lib/chart-data";

const BrainScene = lazy(() => import("./brain-scene"));
const AUTO_SCROLL_CELL_PAUSE_MS = 30_000;
const AUTO_SCROLL_TRANSITION_MS = 2_000;
const BCI_BASICS_STAGE_MS = 8_000;
const BCI_BASICS_ID = "bci-basics";
const PAGE_SECTION_IDS = [
  "intro",
  BCI_BASICS_ID,
  ...pipelineSteps.map((step) => step.id),
];
const BCI_BASICS_STAGES = [
  {
    id: "brain",
    label: "Brain",
    note: "creates a signal",
    eyebrow: "Step 1 · Brain activity",
    title: "Imagine a hand movement",
    description:
      "Even without moving, imagining the left or right hand changes activity around the brain's movement areas.",
    icon: Brain,
  },
  {
    id: "eeg",
    label: "EEG",
    note: "records the signal",
    eyebrow: "Step 2 · EEG recording",
    title: "Measure, do not read",
    description:
      "Electroencephalography uses small sensors on the scalp to measure tiny voltage changes. The sensors listen; they do not put electricity into the brain.",
    icon: Activity,
  },
  {
    id: "bci",
    label: "BCI",
    note: "uses the signal",
    eyebrow: "Step 3 · Computer output",
    title: "Turn a pattern into one choice",
    description:
      "A trained model looks for a familiar EEG pattern and produces a limited output. Here, it chooses imagined left hand or imagined right hand.",
    icon: Monitor,
  },
] as const;

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
    const sections = PAGE_SECTION_IDS
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
      return;
    }

    const sections = PAGE_SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const getHeaderHeight = () =>
      document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const getCurrentIndex = () => {
      const currentPosition = window.scrollY + getHeaderHeight() + 2;
      return sections.reduce(
        (index, section, candidateIndex) =>
          section.getBoundingClientRect().top + window.scrollY <= currentPosition
            ? candidateIndex
            : index,
        0,
      );
    };
    let currentIndex = getCurrentIndex();
    let phase: "paused" | "moving" = "paused";
    let phaseStartedAt = 0;
    let startY = window.scrollY;
    let targetY = window.scrollY;

    const getSectionTop = (section: HTMLElement) => {
      const maximum = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );
      const absoluteTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = section.id === "intro" ? 0 : getHeaderHeight();
      return Math.min(maximum, Math.max(0, absoluteTop - offset));
    };

    const advance = (time: number) => {
      if (!phaseStartedAt) phaseStartedAt = time;

      if (
        phase === "paused" &&
        time - phaseStartedAt >= AUTO_SCROLL_CELL_PAUSE_MS
      ) {
        currentIndex = getCurrentIndex();
        const nextIndex = (currentIndex + 1) % sections.length;

        if (nextIndex === 0) {
          window.scrollTo(0, 0);
          currentIndex = 0;
          phaseStartedAt = time;
        } else {
          startY = window.scrollY;
          targetY = getSectionTop(sections[nextIndex]);
          currentIndex = nextIndex;

          if (motionEnabled) {
            phase = "moving";
          } else {
            window.scrollTo(0, targetY);
          }
          phaseStartedAt = time;
        }
      } else if (phase === "moving") {
        const transitionProgress = clamp(
          (time - phaseStartedAt) / AUTO_SCROLL_TRANSITION_MS,
        );
        window.scrollTo(
          0,
          startY + (targetY - startY) * smooth(transitionProgress),
        );

        if (transitionProgress >= 1) {
          window.scrollTo(0, targetY);
          phase = "paused";
          phaseStartedAt = time;
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
  const basicsActive = activeId === BCI_BASICS_ID;
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
            title="Auto-scroll pauses 30 seconds on each section"
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

      {!introActive && !basicsActive && (
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
          basicsActive ||
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
        <BciBasicsSection
          active={basicsActive}
          dark={theme === "dark"}
          key={basicsActive ? "bci-basics-active" : "bci-basics-idle"}
          motionEnabled={motionEnabled}
        />
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
          <a className="intro-action" href={`#${BCI_BASICS_ID}`}>
            <span>First, learn what BCI and EEG mean</span>
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

function SineWaveCanvas({
  active,
  dark,
  motionEnabled,
}: {
  active: boolean;
  dark: boolean;
  motionEnabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const draw = (time: number) => {
      if (!width || !height) return;

      const styles = window.getComputedStyle(document.documentElement);
      const cyan = styles.getPropertyValue("--cyan").trim();
      const coral = styles.getPropertyValue("--coral").trim();
      const gold = styles.getPropertyValue("--gold").trim();
      const line = styles.getPropertyValue("--line").trim();
      const center = height / 2;
      const phase = motionEnabled ? time * 0.00135 : 0;

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = line;
      context.globalAlpha = 0.72;
      for (let row = 1; row < 4; row += 1) {
        const y = (height / 4) * row;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const waves = [
        { amplitude: 0.27, color: cyan, frequency: 2.25, offset: 0, width: 4.5 },
        { amplitude: 0.16, color: coral, frequency: 3.8, offset: 1.7, width: 2.5 },
        { amplitude: 0.1, color: gold, frequency: 5.6, offset: 3.4, width: 1.7 },
      ];

      waves.forEach((wave, waveIndex) => {
        context.beginPath();
        context.globalAlpha = waveIndex === 0 ? 1 : 0.64;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = wave.width;
        context.strokeStyle = wave.color;
        context.shadowBlur = waveIndex === 0 ? 18 : 8;
        context.shadowColor = wave.color;

        for (let x = 0; x <= width; x += 2) {
          const normalizedX = x / width;
          const carrier = Math.sin(
            normalizedX * Math.PI * 2 * wave.frequency +
              phase * (1 + waveIndex * 0.16) +
              wave.offset,
          );
          const modulation = Math.sin(
            normalizedX * Math.PI * 2 * 0.82 - phase * 0.42 + waveIndex,
          );
          const y =
            center +
            carrier * height * wave.amplitude * (0.78 + modulation * 0.2);

          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;
    };

    const animate = (time: number) => {
      draw(time);
      if (active && motionEnabled) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const resize = () => {
      window.cancelAnimationFrame(animationFrame);
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [active, dark, motionEnabled]);

  return (
    <canvas
      className="bci-sine-canvas"
      ref={canvasRef}
      role="img"
      aria-label="Animated EEG-like sine waves representing changing voltage over time"
    />
  );
}

function BciBasicsSection({
  active,
  dark,
  motionEnabled,
}: {
  active: boolean;
  dark: boolean;
  motionEnabled: boolean;
}) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = BCI_BASICS_STAGES[activeStageIndex];

  useEffect(() => {
    if (!active || !motionEnabled) return;

    const interval = window.setInterval(() => {
      setActiveStageIndex(
        (current) => (current + 1) % BCI_BASICS_STAGES.length,
      );
    }, BCI_BASICS_STAGE_MS);

    return () => window.clearInterval(interval);
  }, [active, motionEnabled]);

  return (
    <section
      className={`bci-basics-section ${active ? "is-active" : ""}`}
      id={BCI_BASICS_ID}
      aria-labelledby="bci-basics-title"
    >
      <div className="bci-basics-layout">
        <div className="bci-basics-heading">
          <div>
            <p className="bci-basics-kicker">
              Before the pipeline · the basic idea
            </p>
            <h1 id="bci-basics-title">What is a BCI?</h1>
          </div>
          <p className="bci-basics-lede">
            A <strong>brain-computer interface</strong> turns measured brain
            activity into a simple computer command. <strong>EEG</strong>, or
            electroencephalography, is the noninvasive recording method used
            here.
          </p>
        </div>

        <div className="bci-basics-visual">
          <div className="bci-visual-heading">
            <div>
              <span>Automatic visual walkthrough</span>
              <strong>Brain activity → EEG signal → computer decision</strong>
            </div>
            <small>
              <i aria-hidden="true" />
              {motionEnabled ? "Playing automatically" : "Motion paused"}
            </small>
          </div>

          <ol className="bci-stage-track" aria-label="Three stages of a BCI">
            {BCI_BASICS_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeStageIndex;
              return (
                <li
                  className={isActive || !motionEnabled ? "is-active" : ""}
                  key={stage.id}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" size={34} strokeWidth={1.65} />
                  <div>
                    <strong>{stage.label}</strong>
                    <small>{stage.note}</small>
                  </div>
                  <i aria-hidden="true" />
                </li>
              );
            })}
          </ol>

          <div
            className="bci-flow-scene"
            data-active={motionEnabled ? activeStage.id : "all"}
          >
            <div className="bci-demo-node bci-brain-node">
              <span className="bci-node-number">01 · BRAIN</span>
              <div className="bci-head-shell">
                <Brain aria-hidden="true" size={126} strokeWidth={1.25} />
                <div className="bci-electrodes">
                  {Array.from({ length: 9 }, (_, index) => (
                    <i key={index} />
                  ))}
                </div>
              </div>
              <div className="bci-imagined-hands">
                <Hand aria-hidden="true" size={36} strokeWidth={1.4} />
                <span>OR</span>
                <Hand aria-hidden="true" size={36} strokeWidth={1.4} />
              </div>
              <strong>Imagine left or right</strong>
            </div>

            <div className="bci-flow-connector" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <div className="bci-demo-node bci-eeg-node">
              <span className="bci-node-number">02 · EEG</span>
              <div className="bci-eeg-display">
                <div className="bci-eeg-labels" aria-hidden="true">
                  <span>VOLTAGE</span>
                  <span>TIME →</span>
                </div>
                <SineWaveCanvas
                  active={active}
                  dark={dark}
                  motionEnabled={motionEnabled}
                />
              </div>
              <strong>Record scalp voltage</strong>
            </div>

            <div className="bci-flow-connector" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <div className="bci-demo-node bci-computer-node">
              <span className="bci-node-number">03 · BCI</span>
              <Monitor aria-hidden="true" size={102} strokeWidth={1.25} />
              <div className="bci-output-choices" aria-label="Possible outputs">
                <span>
                  <Hand aria-hidden="true" size={24} /> LEFT
                </span>
                <span>
                  <Hand aria-hidden="true" size={24} /> RIGHT
                </span>
              </div>
              <strong>Predict one label</strong>
            </div>
          </div>

          <div className="bci-stage-explanation" key={activeStage.id}>
            <span>{activeStage.eyebrow}</span>
            <strong>{activeStage.title}</strong>
            <p>{activeStage.description}</p>
          </div>

          <div className="bci-plain-language">
            <strong>EEG only measures.</strong>
            <span>
              It does not read private thoughts, and the scalp sensors do not
              send electricity into the brain.
            </span>
          </div>
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
  if (visual === "eda") {
    return (
      <FigureSwitcher
        choices={edaFigures}
        renderCustom={(id) => {
          if (id === "spread") return <RunDistributionChart />;
          if (id === "run-means") return <RunMeanChart />;
          return <PersonalityFactorsChart />;
        }}
      />
    );
  }
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
          ) : (
            <TrainingHistoryChart />
          )
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
              scaleLabel="Scale: 50 to 70% · project benchmark at 70%"
              showGoal
            />
          ) : (
            <ParticipantDifferenceChart />
          )
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
    return (
      <FigureSwitcher
        choices={comparisonFigures}
        renderCustom={(id) =>
          id === "histograms" ? (
            <MatchedDistributionChart />
          ) : (
            <BottomOverlapChart />
          )
        }
      />
    );
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
    { name: "Extra Trees", value: 15.825, width: "98.72%" },
    { name: "Random forest", value: 15.914, width: "99.27%" },
    { name: "Dummy mean", value: 16.031, width: "100%" },
  ] as const;
  const highestFeatures = [
    ["PRE_Motivation", "0.247"],
    ["PRE_Stim_normal", "0.237"],
    ["Level of study", "0.152"],
    ["Vision", "0.143"],
    ["Q4", "0.111"],
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
      <div className="extra-trees-features">
        <div>
          <strong>Highest exploratory features</strong>
          <small>held-out RMSE increase when shuffled</small>
        </div>
        <ul>
          {highestFeatures.map(([feature, importance]) => (
            <li key={feature}>
              <span>{feature}</span>
              <strong>+{importance}</strong>
            </li>
          ))}
        </ul>
      </div>
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
  renderCustom: (id: string) => ReactNode;
}) {
  const [activeId, setActiveId] = useState(choices[0].id);
  const active = choices.find((choice) => choice.id === activeId) ?? choices[0];
  const custom = renderCustom(active.id);

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
      <div className="figure-stage">{custom}</div>
      <div className="figure-caption">
        <strong>{active.title}</strong>
        <p>{active.note}</p>
      </div>
    </div>
  );
}

function RunDistributionChart() {
  const maxCount = 17;

  return (
    <div
      className="native-chart run-distribution-chart"
      role="img"
      aria-label="Four distributions of participant online BCI accuracy from Runs 3 through 6, with means between 61.92 and 64.83 percent"
    >
      <div className="chart-summary">
        <span>4 online runs</span>
        <strong>Wide spread, similar centers</strong>
        <small>Each bar covers 5 percentage points</small>
      </div>
      <div className="run-distribution-grid">
        {runDistributions.map((item, runIndex) => (
          <section key={item.run}>
            <header>
              <div>
                <span>{item.run}</span>
                <small>n = {item.n}</small>
              </div>
              <strong>{item.mean.toFixed(2)}%</strong>
            </header>
            <div className="histogram-bars" aria-hidden="true">
              <span className="chance-line" />
              {item.counts.map((count, index) => (
                <i
                  key={`${item.run}-${index}`}
                  style={
                    {
                      "--bar-height": `${(count / maxCount) * 100}%`,
                      "--bar-delay": `${runIndex * 70 + index * 12}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="mini-axis"><span>0</span><span>50 chance</span><span>100%</span></div>
          </section>
        ))}
      </div>
    </div>
  );
}

function RunMeanChart() {
  const xPositions = [92, 274, 456, 638];
  const y = (value: number) => 300 - ((value - 55) / 16) * 230;
  const points = runMeans.map((item, index) => `${xPositions[index]},${y(item.mean)}`).join(" ");

  return (
    <div
      className="native-chart run-mean-chart"
      role="img"
      aria-label="Mean online BCI performance from Run 3 to Run 6 with overlapping 95 percent confidence intervals"
    >
      <div className="chart-summary is-horizontal">
        <div><span>Run 3 to Run 6</span><strong>+2.91 points</strong></div>
        <p>Means rise slightly, but the 95% confidence intervals overlap.</p>
      </div>
      <svg viewBox="0 0 730 360" aria-hidden="true">
        {[55, 60, 65, 70].map((tick) => (
          <g className="chart-gridline" key={tick}>
            <line x1="64" x2="680" y1={y(tick)} y2={y(tick)} />
            <text x="48" y={y(tick) + 4}>{tick}%</text>
          </g>
        ))}
        <polyline className="mean-path" points={points} />
        {runMeans.map((item, index) => (
          <g className="mean-point" key={item.run}>
            <line x1={xPositions[index]} x2={xPositions[index]} y1={y(item.high)} y2={y(item.low)} />
            <line x1={xPositions[index] - 8} x2={xPositions[index] + 8} y1={y(item.high)} y2={y(item.high)} />
            <line x1={xPositions[index] - 8} x2={xPositions[index] + 8} y1={y(item.low)} y2={y(item.low)} />
            <circle cx={xPositions[index]} cy={y(item.mean)} r="8" />
            <text className="point-value" x={xPositions[index]} y={y(item.mean) - 17}>{item.mean.toFixed(2)}%</text>
            <text className="point-label" x={xPositions[index]} y="334">{item.run}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function PersonalityFactorsChart() {
  return (
    <div
      className="native-chart personality-chart"
      role="img"
      aria-label="Five aggregated personality factor plots, all showing weak correlations with BCI performance"
    >
      <div className="chart-summary is-horizontal">
        <div><span>Strongest absolute correlation</span><strong>|r| = 0.13</strong></div>
        <p>No broad personality factor shows a strong linear relationship.</p>
      </div>
      <div className="factor-grid">
        {personalityFactors.map((factor) => {
          const points = factor.points.map((point) => {
            const x = 24 + ((point.x - factor.min) / (factor.max - factor.min)) * 212;
            const y = 118 - ((point.y - 52) / 20) * 92;
            return { ...point, px: x, py: y };
          });
          return (
            <section key={factor.id}>
              <header><span>{factor.id}</span><div><strong>{factor.label}</strong><small>r = {factor.corr.toFixed(2)}</small></div></header>
              <svg viewBox="0 0 260 140" aria-hidden="true">
                <line className="factor-chance" x1="20" x2="240" y1="118" y2="118" />
                <polyline className="factor-path" points={points.map((point) => `${point.px},${point.py}`).join(" ")} />
                {points.map((point, index) => <circle key={index} cx={point.px} cy={point.py} r={3 + Math.sqrt(point.n) / 1.7} />)}
              </svg>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TrainingHistoryChart() {
  const x = (epoch: number) => 56 + ((epoch - 1) / 59) * 540;
  const lossY = (value: number) => 238 - ((value - 0.55) / 0.11) * 174;
  const accuracyY = (value: number) => 238 - ((value - 0.64) / 0.04) * 174;
  const trainingPoints = trainingHistory.epochs.map((epoch, index) => `${x(epoch)},${lossY(trainingHistory.trainingLoss[index])}`).join(" ");
  const validationPoints = trainingHistory.epochs.map((epoch, index) => `${x(epoch)},${lossY(trainingHistory.validationLoss[index])}`).join(" ");
  const accuracyPoints = trainingHistory.epochs.map((epoch, index) => `${x(epoch)},${accuracyY(trainingHistory.validationBalancedAccuracy[index])}`).join(" ");

  return (
    <div
      className="native-chart training-history-chart"
      role="img"
      aria-label="CSP MLP training and validation history across 60 epochs, with the selected checkpoint at epoch 48"
    >
      <div className="training-readout">
        <span>Selected checkpoint</span><strong>Epoch 48</strong><small>lowest validation loss</small>
      </div>
      <div className="training-plot">
        <div className="chart-legend"><span className="is-training">Training loss</span><span className="is-validation">Validation loss</span><span className="is-accuracy">Validation BA</span></div>
        <svg viewBox="0 0 650 300" aria-hidden="true">
          {[64, 122, 180, 238].map((line) => <line className="training-gridline" key={line} x1="56" x2="596" y1={line} y2={line} />)}
          <line className="checkpoint-line" x1={x(48)} x2={x(48)} y1="48" y2="248" />
          <polyline className="training-loss-line" points={trainingPoints} />
          <polyline className="validation-loss-line" points={validationPoints} />
          <polyline className="accuracy-line" points={accuracyPoints} />
          <text className="axis-note" x="56" y="278">Epoch 1</text><text className="axis-note" x="548" y="278">Epoch 60</text>
        </svg>
      </div>
      <dl className="training-metrics"><div><dt>Final validation BA</dt><dd>66.8%</dd></div><div><dt>Final validation loss</dt><dd>0.5991</dd></div></dl>
    </div>
  );
}

function ParticipantDifferenceChart() {
  return (
    <div
      className="native-chart participant-difference-chart"
      role="img"
      aria-label="Ranked model minus behavioral BCI differences for 66 matched participants: 48 favor the model, 18 favor behavioral BCI, and the average is plus 4.99 percentage points"
    >
      <div className="difference-head"><div><span>Average difference</span><strong>+4.99 pp</strong></div><p><b>48</b> model higher <i /> <b>18</b> behavior higher</p></div>
      <div className="difference-bars" aria-hidden="true">
        <span className="difference-zero">0</span>
        {participantDifferences.map((value, index) => (
          <i
            className={value >= 0 ? "is-positive" : "is-negative"}
            key={index}
            style={{ "--difference-size": `${(Math.abs(value) / 31.4) * 46}%`, "--bar-delay": `${index * 10}ms` } as CSSProperties}
          />
        ))}
      </div>
      <div className="difference-axis"><span>Model higher</span><span>Ranked matched participants</span><span>Behavior higher</span></div>
    </div>
  );
}

function MatchedDistributionChart() {
  return (
    <div
      className="native-chart matched-distribution-chart"
      role="img"
      aria-label="Matched participant distributions: held-out CSP MLP mean 68.73 percent and behavioral BCI mean 63.74 percent"
    >
      <div className="distribution-delta"><span>Same 66 people</span><strong>+4.99 pp</strong><small>model mean minus behavior mean</small></div>
      <div className="matched-panels">
        {matchedDistributions.map((distribution) => (
          <section className={`is-${distribution.id}`} key={distribution.id}>
            <header><span>{distribution.label}</span><strong>{distribution.mean.toFixed(2)}%</strong></header>
            <div className="matched-histogram" aria-hidden="true">
              <span className="matched-chance" /><span className="matched-mean" style={{ "--mean-position": `${((distribution.mean - 40) / 60) * 100}%` } as CSSProperties} />
              {distribution.counts.map((count, index) => <i key={index} style={{ "--bar-height": `${(count / 13) * 100}%`, "--bar-delay": `${index * 28}ms` } as CSSProperties} />)}
            </div>
            <div className="mini-axis"><span>40%</span><span>50 chance</span><span>100%</span></div>
          </section>
        ))}
      </div>
      <div className="matched-legend"><span>Dashed line: chance</span><span>Solid line: group mean</span></div>
    </div>
  );
}

function BottomOverlapChart() {
  return (
    <div
      className="native-chart overlap-chart"
      role="img"
      aria-label="Bottom 27 overlap: 9 participants appear only in the model list, 18 are shared, and 9 appear only in the behavioral performance list"
    >
      <div className="overlap-copy"><span>Bottom 27 lists</span><strong>66.7%</strong><p>of low performers appear in both lists</p></div>
      <div className="overlap-venn" aria-hidden="true">
        <div className="is-model"><span>9</span><small>model only</small></div>
        <div className="is-shared"><span>18</span><small>shared</small></div>
        <div className="is-behavior"><span>9</span><small>behavior only</small></div>
      </div>
      <p className="overlap-note">The same participants tend to struggle in both systems, but the match is not perfect.</p>
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
      {showGoal && <span className="goal-marker">70% benchmark</span>}
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
            <dt>Project benchmark</dt>
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
