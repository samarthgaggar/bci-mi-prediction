"use client";

import {
  Activity,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Database,
  FlaskConical,
  Gauge,
  Info,
  List,
  Moon,
  Pause,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  pipelineSteps,
  primarySources,
  researchSections,
  resultPanels,
  type ResearchStatus,
} from "../lib/research-content";

const BrainScene = lazy(() => import("./brain-scene"));

const statusIcons = {
  verified: ShieldCheck,
  process: FlaskConical,
  pending: Gauge,
} satisfies Record<ResearchStatus, typeof ShieldCheck>;

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
  const [activeId, setActiveId] = useState("start");
  const [progress, setProgress] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [webGL, setWebGL] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [contentsOpen, setContentsOpen] = useState(false);
  const transitionRef = useRef<HTMLElement>(null);
  const contentsButtonRef = useRef<HTMLButtonElement>(null);
  const contentsPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const savedTheme = window.localStorage.getItem("bci-theme");
    const setup = window.requestAnimationFrame(() => {
      setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark");
      setMotionEnabled(!prefersReduced);
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
    const sections = researchSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-26% 0px -48% 0px", threshold: [0.08, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(pageHeight > 0 ? clamp(window.scrollY / pageHeight) : 0);

      const transition = transitionRef.current;
      if (transition) {
        const rect = transition.getBoundingClientRect();
        const distance = rect.height - window.innerHeight;
        setTransitionProgress(distance > 0 ? clamp(-rect.top / distance) : 0);
      }
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
    if (!contentsOpen) return;
    const panel = contentsPanelRef.current;
    const contentsButton = contentsButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContentsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      contentsButton?.focus();
    };
  }, [contentsOpen]);

  const activeIndex = useMemo(
    () => Math.max(0, researchSections.findIndex((section) => section.id === activeId)),
    [activeId],
  );
  const activeSection = researchSections[activeIndex];
  const approachZoom = smooth(transitionProgress);
  const returnZoom = smooth(clamp((progress - 0.955) / 0.045));
  const brainOpacity = Math.max(
    1 - smooth(clamp((transitionProgress - 0.68) / 0.28)),
    returnZoom,
  );
  const brainScale =
    returnZoom > 0
      ? 6.25 - returnZoom * 5.25
      : 1 + approachZoom * 5.25;

  return (
    <>
      <a className="skip-link" href="#start">
        Skip to the project overview
      </a>

      <header className="site-header">
        <a className="brand" href="#start" aria-label="Motor Imagery BCI project home">
          <span className="brand-mark" aria-hidden="true">
            <Brain size={19} strokeWidth={2.2} />
          </span>
          <span className="brand-copy">
            <strong>Motor Imagery BCI</strong>
            <small>EEG classification research</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="research-state">
            <span className="state-dot" aria-hidden="true" />
            Research in progress
          </span>
          <button
            ref={contentsButtonRef}
            className="contents-button"
            type="button"
            onClick={() => setContentsOpen((value) => !value)}
            aria-expanded={contentsOpen}
            aria-controls="contents-panel"
          >
            <List size={17} aria-hidden="true" />
            <span>Contents</span>
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setMotionEnabled((value) => !value)}
            aria-pressed={!motionEnabled}
            aria-label={motionEnabled ? "Pause visual motion" : "Resume visual motion"}
          >
            {motionEnabled ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </header>

      {contentsOpen && (
        <div
          className="contents-backdrop"
          aria-hidden="true"
          onClick={() => setContentsOpen(false)}
        />
      )}
      <ContentsPanel
        activeId={activeId}
        activeIndex={activeIndex}
        open={contentsOpen}
        onClose={() => setContentsOpen(false)}
        panelRef={contentsPanelRef}
      />

      <div className="page-progress" aria-hidden="true">
        <span className="page-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        <span className="page-progress-node" style={{ left: `${progress * 100}%` }} />
      </div>

      <div className="scene-layer" aria-hidden="true" data-phase={activeSection.phase}>
        <div className="scene-grid" />
        <div className="scene-halo scene-halo-coral" />
        <div className="scene-halo scene-halo-blue" />
        <Image
          className="anatomical-brain"
          src="/brain-anatomy.svg"
          alt=""
          width={1200}
          height={1200}
          priority
          unoptimized
          style={{
            opacity: brainOpacity,
            transform: `translate(-50%, -50%) rotate(${(-1.5 + approachZoom * 3) * (motionEnabled ? 1 : 0)}deg) scale(${brainScale})`,
          }}
        />
        {sceneReady && webGL ? (
          <Suspense fallback={<BrainFallback label="Preparing the brain visualization" />}>
            <BrainScene progress={progress} motionEnabled={motionEnabled} dark={theme === "dark"} />
          </Suspense>
        ) : (
          <BrainFallback
            label={webGL ? "Preparing the brain visualization" : "Static brain visualization"}
          />
        )}
      </div>

      <main className="research-main">
        <HeroSection active={activeId === "start"} />

        <section
          ref={transitionRef}
          className="brain-transition"
          id="approach"
          aria-label="Brain and EEG signal visualization"
        >
          <div className="brain-transition-sticky">
            <div
              className="brain-focus-neuron"
              aria-hidden="true"
              style={{
                opacity: 0.28 + transitionProgress * 0.58,
                transform: `translate(-50%, -50%) scale(${1.18 - transitionProgress * 0.38})`,
              }}
            >
              <svg viewBox="0 0 240 240" role="presentation">
                <g className="neuron-dendrites">
                  <path d="M120 112 94 91 68 88 51 70 31 72" />
                  <path d="M96 92 82 67 86 45 73 27" />
                  <path d="M112 91 111 64 126 44 124 22" />
                  <path d="M130 94 151 69 176 65 190 45" />
                  <path d="M145 105 172 93 197 99 216 86" />
                  <path d="M144 123 172 132 194 126 215 143" />
                  <path d="M101 129 76 145 52 142 33 158" />
                  <path d="M92 116 66 111 45 121 23 113" />
                </g>
                <path
                  className="neuron-axon"
                  d="M124 129 C132 149 122 165 139 178 S171 194 178 219"
                />
                <g className="neuron-terminals">
                  <circle cx="31" cy="72" r="4" />
                  <circle cx="73" cy="27" r="4" />
                  <circle cx="124" cy="22" r="4" />
                  <circle cx="190" cy="45" r="4" />
                  <circle cx="216" cy="86" r="4" />
                  <circle cx="215" cy="143" r="4" />
                  <circle cx="33" cy="158" r="4" />
                  <circle cx="23" cy="113" r="4" />
                </g>
                <circle className="neuron-soma" cx="120" cy="112" r="25" />
                <circle className="neuron-nucleus" cx="114" cy="107" r="8" />
                <circle className="neuron-signal" cx="178" cy="219" r="6" />
              </svg>
            </div>
          </div>
        </section>

        {researchSections.slice(1).map((section, visibleIndex) => {
          const index = visibleIndex + 1;
          const StatusIcon = statusIcons[section.status];
          const isFinal = section.id === "return";
          return (
            <section
              className={`research-section research-section-${section.side} ${
                isFinal ? "final-section" : ""
              } ${activeId === section.id ? "is-active" : ""}`}
              id={section.id}
              key={section.id}
              aria-labelledby={`${section.id}-title`}
              data-phase={section.phase}
            >
              <div className="section-pulse" aria-hidden="true" />
              <div className="section-inner">
                <article className="section-card">
                  <div className="section-marker">{section.sectionLabel}</div>

                  <div className="eyebrow">
                    <span className={`status-chip status-${section.status}`}>
                      <StatusIcon size={14} aria-hidden="true" />
                      {section.statusLabel}
                    </span>
                    <span className="section-index">
                      {isFinal ? "Primary references" : `Research section ${String(index).padStart(2, "0")}`}
                    </span>
                  </div>

                  <h2 id={`${section.id}-title`}>{section.question}</h2>
                  <p className="simple-answer">{section.simpleAnswer}</p>

                  {section.metrics && <Metrics metrics={section.metrics} />}
                  {section.id === "method" && <MethodDiagram />}
                  {section.id === "pipeline" && <Pipeline />}
                  {section.id === "results" && <PendingResults />}
                  {section.id === "future" && <Limitations />}

                  <details className="technical-note" open={isFinal}>
                    <summary>
                      <span>{isFinal ? "Project scope and interpretation" : "View technical details"}</span>
                      <ChevronDown size={17} aria-hidden="true" />
                    </summary>
                    <div className="technical-body">
                      <p>{section.technicalDetail}</p>
                      <div className="source-links" aria-label="Sources for this section">
                        {section.sources.map((source) => (
                          <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                            {source.label}
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </details>

                  {isFinal && <FinalSources />}
                </article>
              </div>
            </section>
          );
        })}
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-kicker">Motor imagery BCI research</span>
          <p>Methods, evidence, and limitations.</p>
        </div>
        <div className="footer-links">
          <a href={primarySources.zenodo.href} target="_blank" rel="noreferrer">
            Dataset
          </a>
          <a href={primarySources.paper.href} target="_blank" rel="noreferrer">
            Paper
          </a>
          <a href="#integrity">Integrity</a>
          <a href="#start">Back to overview</a>
        </div>
        <p className="asset-credit">
          Anatomical brain graphic:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Brain-diagram-pink-6289600.svg"
            target="_blank"
            rel="noreferrer"
          >
            CC0 lateral-view illustration via Wikimedia Commons
          </a>
          . The neuron animation is an educational visualization, not a diagnostic
          model. Research facts link to the public Zenodo record and Scientific Data
          descriptor.
        </p>
      </footer>
    </>
  );
}

function HeroSection({ active }: { active: boolean }) {
  const section = researchSections[0];
  return (
    <section
      className={`research-section hero-section ${active ? "is-active" : ""}`}
      id="start"
      aria-labelledby="start-title"
    >
      <div className="hero-network hero-network-one" aria-hidden="true" />
      <div className="hero-network hero-network-two" aria-hidden="true" />
      <div className="section-inner hero-layout">
        <article className="hero-copy">
          <p className="hero-kicker">Motor imagery BCI · EEG classification</p>
          <h1 id="start-title">
            Predicting Motor Imagery
            <span>from EEG</span>
          </h1>
          <p className="hero-summary">{section.simpleAnswer}</p>
          <span className="hero-status">
            <FlaskConical size={16} aria-hidden="true" />
            Research in progress
          </span>
        </article>
      </div>
      <div className="hero-continuity" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

function ContentsPanel({
  activeId,
  activeIndex,
  open,
  onClose,
  panelRef,
}: {
  activeId: string;
  activeIndex: number;
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLElement | null>;
}) {
  return (
    <aside
      ref={panelRef}
      className={`contents-panel ${open ? "is-open" : ""}`}
      id="contents-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contents-title"
      aria-hidden={!open}
    >
      <div className="contents-head">
        <span id="contents-title">
          <List size={17} aria-hidden="true" />
          Contents
        </span>
        <button
          className="contents-close"
          type="button"
          onClick={onClose}
          aria-label="Close contents"
          tabIndex={open ? 0 : -1}
        >
          <X size={18} />
        </button>
      </div>
      <div className="contents-current">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <p>
          Current section
          <strong>{researchSections[activeIndex].navLabel}</strong>
        </p>
      </div>
      <nav aria-label="Research contents">
        <ol>
          {researchSections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={activeId === section.id ? "location" : undefined}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                <span className="contents-number" aria-hidden="true">
                  {index === 0
                    ? "00"
                    : index === researchSections.length - 1
                      ? "09"
                      : String(index).padStart(2, "0")}
                </span>
                <strong>{section.navLabel}</strong>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

function BrainFallback({ label }: { label: string }) {
  return (
    <div className="brain-fallback" role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

function Metrics({
  metrics,
}: {
  metrics: readonly { value: string; label: string; detail: string }[];
}) {
  return (
    <dl className="metrics-grid">
      {metrics.map((metric, index) => (
        <div className="metric-card" key={`${metric.label}-${metric.value}`}>
          <dt>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {metric.label}
          </dt>
          <dd>{metric.value}</dd>
          <p>{metric.detail}</p>
        </div>
      ))}
    </dl>
  );
}

function MethodDiagram() {
  const steps = [
    { icon: Radio, title: "Baseline", detail: "Resting signals" },
    { icon: Activity, title: "Acquire", detail: "R1–R2" },
    { icon: Brain, title: "Imagine", detail: "Left or right" },
    { icon: Gauge, title: "Feedback", detail: "R3–R6" },
  ];

  return (
    <div className="method-diagram" aria-label="Documented session sequence">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div className="method-step" key={step.title}>
            <span className="method-icon">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </span>
            {index < steps.length - 1 && <span className="method-line" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}

function Pipeline() {
  return (
    <ol className="pipeline-list">
      {pipelineSteps.map((step, index) => (
        <li key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{step}</p>
          <Check size={15} aria-label="Protocol step defined" />
        </li>
      ))}
    </ol>
  );
}

function PendingResults() {
  return (
    <div className="pending-grid">
      {resultPanels.map((panel) => (
        <article className="pending-panel" key={panel.title}>
          <div className="pending-visual" aria-hidden="true">
            <Gauge size={22} />
            <span />
          </div>
          <div>
            <h3>{panel.title}</h3>
            <p>{panel.description}</p>
          </div>
          <span className="pending-badge">
            <Info size={13} aria-hidden="true" />
            Awaiting verified analysis
          </span>
        </article>
      ))}
    </div>
  );
}

function Limitations() {
  return (
    <div className="limitations">
      {[
        ["One session", "This dataset does not measure long-term stability."],
        ["One task", "The cues cover left- and right-hand motor imagery."],
        ["People differ", "A group average can hide important variation."],
      ].map(([title, detail]) => (
        <div key={title}>
          <Sparkles size={17} aria-hidden="true" />
          <span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function FinalSources() {
  return (
    <div className="final-sources">
      <div className="source-card">
        <Database size={21} aria-hidden="true" />
        <div>
          <span>Open dataset</span>
          <strong>Zenodo 8089820</strong>
        </div>
        <a
          href={primarySources.zenodo.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the Zenodo dataset record"
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="source-card">
        <FlaskConical size={21} aria-hidden="true" />
        <div>
          <span>Study descriptor</span>
          <strong>Scientific Data</strong>
        </div>
        <a
          href={primarySources.paper.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the Scientific Data paper"
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
