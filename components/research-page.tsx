"use client";

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
  const [activeId, setActiveId] = useState("start");
  const [progress, setProgress] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [webGL, setWebGL] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const transitionRef = useRef<HTMLElement>(null);
  const contentsButtonRef = useRef<HTMLButtonElement>(null);
  const contentsPanelRef = useRef<HTMLElement>(null);
  const autoScrollFrameRef = useRef(0);
  const autoScrollTimeRef = useRef(0);
  const autoScrollLoopPauseRef = useRef(0);

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
    if (!autoScrollEnabled) {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollTimeRef.current = 0;
      autoScrollLoopPauseRef.current = 0;
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pixelsPerSecond = reducedMotion ? 36 : 64;
    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const advance = (time: number) => {
      if (!autoScrollTimeRef.current) autoScrollTimeRef.current = time;
      const elapsed = Math.min(time - autoScrollTimeRef.current, 64);
      autoScrollTimeRef.current = time;

      if (!contentsOpen && time >= autoScrollLoopPauseRef.current) {
        const maximum =
          document.documentElement.scrollHeight - window.innerHeight;

        if (window.scrollY >= maximum - 2) {
          window.scrollTo(0, 0);
          autoScrollLoopPauseRef.current = time + 1100;
        } else {
          window.scrollBy(0, (pixelsPerSecond * elapsed) / 1000);
        }
      }

      autoScrollFrameRef.current = window.requestAnimationFrame(advance);
    };

    autoScrollFrameRef.current = window.requestAnimationFrame(advance);
    return () => {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollTimeRef.current = 0;
      autoScrollLoopPauseRef.current = 0;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [autoScrollEnabled, contentsOpen]);

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
          <span className="brand-mark" aria-hidden="true">MI</span>
          <span className="brand-copy">
            <strong>Motor Imagery BCI</strong>
            <small>EEG classification study</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="research-state">
            <span className="state-dot" aria-hidden="true" />
            Analysis in progress
          </span>
          <button
            className={`auto-scroll-button ${
              autoScrollEnabled ? "is-active" : ""
            }`}
            type="button"
            onClick={() => setAutoScrollEnabled((value) => !value)}
            aria-pressed={autoScrollEnabled}
            aria-label={
              autoScrollEnabled
                ? "Turn off automatic scrolling"
                : "Turn on automatic scrolling"
            }
          >
            <span className="auto-scroll-label">Auto scroll</span>
            <span className="auto-scroll-state">
              {autoScrollEnabled ? "On" : "Off"}
            </span>
          </button>
          <button
            ref={contentsButtonRef}
            className="contents-button"
            type="button"
            onClick={() => setContentsOpen((value) => !value)}
            aria-expanded={contentsOpen}
            aria-controls="contents-panel"
          >
            <span>Index</span>
          </button>
          <button
            className="text-control"
            type="button"
            onClick={() => setMotionEnabled((value) => !value)}
            aria-pressed={!motionEnabled}
            aria-label={motionEnabled ? "Pause visual motion" : "Resume visual motion"}
          >
            <span>Motion</span>
            <b>{motionEnabled ? "On" : "Off"}</b>
          </button>
          <button
            className="text-control"
            type="button"
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            <span>Theme</span>
            <b>{theme === "light" ? "Light" : "Dark"}</b>
          </button>
        </div>
      </header>
      <span className="auto-scroll-announcement" aria-live="polite">
        Automatic scrolling is {autoScrollEnabled ? "on" : "off"}.
      </span>

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
                      {section.statusLabel}
                    </span>
                    <span className="section-index">
                      {isFinal ? "Primary references" : String(index).padStart(2, "0")}
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
                      <span>{isFinal ? "Scope and interpretation" : "Methods, scope, and sources"}</span>
                      <span className="details-mark" aria-hidden="true" />
                    </summary>
                    <div className="technical-body">
                      <p>{section.technicalDetail}</p>
                      <div className="source-links" aria-label="Sources for this section">
                        {section.sources.map((source) => (
                          <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                            {source.label}
                            <span aria-hidden="true">↗</span>
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
      <div className="section-inner hero-layout">
        <article className="hero-copy">
          <p className="hero-kicker">Motor imagery BCI / EEG classification</p>
          <h1 id="start-title">
            Predicting Motor Imagery
            <span>from EEG</span>
          </h1>
          <p className="hero-summary">{section.simpleAnswer}</p>
          <div className="hero-meta" aria-label="Verified dataset summary">
            <span><b>87</b> participants</span>
            <span><b>694</b> recordings</span>
            <span><b>512 Hz</b> sampling</span>
          </div>
          <p className="hero-status">Current stage <span>Analysis in progress</span></p>
        </article>
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
        <span id="contents-title">Project index</span>
        <button
          className="contents-close"
          type="button"
          onClick={onClose}
          aria-label="Close contents"
          tabIndex={open ? 0 : -1}
        >
          <span aria-hidden="true">×</span>
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
    { title: "Baseline", detail: "Resting signals" },
    { title: "Acquire", detail: "R1–R2" },
    { title: "Imagine", detail: "Left or right" },
    { title: "Feedback", detail: "R3–R6" },
  ];

  return (
    <div className="method-diagram" aria-label="Documented session sequence">
      {steps.map((step, index) => (
        <div className="method-step" key={step.title}>
          <span className="method-number">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <strong>{step.title}</strong>
            <small>{step.detail}</small>
          </span>
          {index < steps.length - 1 && <span className="method-line" aria-hidden="true" />}
        </div>
      ))}
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
        </li>
      ))}
    </ol>
  );
}

function PendingResults() {
  return (
    <div className="pending-grid">
      {resultPanels.map((panel, index) => (
        <article className="pending-panel" key={panel.title}>
          <span className="pending-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{panel.title}</h3>
            <p>{panel.description}</p>
          </div>
          <span className="pending-badge">Not published</span>
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
      ].map(([title, detail], index) => (
        <div key={title}>
          <span className="limitation-number">{String(index + 1).padStart(2, "0")}</span>
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
      <a
        className="source-card"
        href={primarySources.zenodo.href}
        target="_blank"
        rel="noreferrer"
      >
        <div>
          <span>Open dataset</span>
          <strong>Zenodo 8089820</strong>
        </div>
        <b aria-hidden="true">↗</b>
      </a>
      <a
        className="source-card"
        href={primarySources.paper.href}
        target="_blank"
        rel="noreferrer"
      >
        <div>
          <span>Study descriptor</span>
          <strong>Scientific Data</strong>
        </div>
        <b aria-hidden="true">↗</b>
      </a>
    </div>
  );
}
