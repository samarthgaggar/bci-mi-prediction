"use client";

import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Database,
  FlaskConical,
  Gauge,
  Info,
  Moon,
  Pause,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  journeyStops,
  pipelineSteps,
  primarySources,
  resultPanels,
  type JourneyStatus,
} from "../lib/research-content";

const BrainScene = lazy(() => import("./brain-scene"));

const statusIcons = {
  verified: ShieldCheck,
  process: FlaskConical,
  pending: Gauge,
} satisfies Record<JourneyStatus, typeof ShieldCheck>;

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

export function JourneyPage() {
  const [activeId, setActiveId] = useState("start");
  const [progress, setProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [webGL, setWebGL] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const savedTheme = window.localStorage.getItem("bci-theme");
    const setup = window.requestAnimationFrame(() => {
      setTheme(
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : prefersDark
            ? "dark"
            : "light",
      );
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
    const sections = journeyStops
      .map((stop) => document.getElementById(stop.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-28% 0px -44% 0px", threshold: [0.1, 0.35, 0.65] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const root = mainRef.current;
      if (!root) return;
      const journeyHeight = root.scrollHeight - window.innerHeight;
      setProgress(journeyHeight > 0 ? window.scrollY / journeyHeight : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = useMemo(
    () => Math.max(0, journeyStops.findIndex((stop) => stop.id === activeId)),
    [activeId],
  );

  return (
    <>
      <a className="skip-link" href="#start">
        Skip to the brain journey
      </a>

      <header className="site-header">
        <a className="brand" href="#start" aria-label="BCI Signal Journey home">
          <span className="brand-mark" aria-hidden="true">
            <Brain size={19} strokeWidth={2.2} />
          </span>
          <span>BCI / Signal Journey</span>
        </a>
        <div className="header-actions">
          <span className="research-state">
            <span className="state-dot" aria-hidden="true" />
            Research in progress
          </span>
          <button
            className="icon-button"
            type="button"
            onClick={() => setMotionEnabled((value) => !value)}
            aria-pressed={!motionEnabled}
            aria-label={motionEnabled ? "Pause cinematic motion" : "Resume cinematic motion"}
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

      <nav className="journey-nav" aria-label="Journey progress">
        <span className="journey-count" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(journeyStops.length).padStart(2, "0")}
        </span>
        <div className="progress-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
        </div>
        <ol>
          {journeyStops.map((stop) => (
            <li key={stop.id}>
              <a
                href={`#${stop.id}`}
                aria-current={activeId === stop.id ? "step" : undefined}
              >
                <span className="nav-dot" aria-hidden="true" />
                <span className="nav-label">{stop.navLabel}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="scene-layer" aria-hidden="true">
        <div className="scene-halo scene-halo-coral" />
        <div className="scene-halo scene-halo-blue" />
        {sceneReady && webGL ? (
          <Suspense fallback={<BrainFallback label="Preparing the brain…" />}>
            <BrainScene
              progress={progress}
              motionEnabled={motionEnabled}
              dark={theme === "dark"}
            />
          </Suspense>
        ) : (
          <BrainFallback label={webGL ? "Preparing the brain…" : "Static brain view"} />
        )}
      </div>

      <main ref={mainRef} className="journey-main">
        {journeyStops.map((stop, index) => {
          const StatusIcon = statusIcons[stop.status];
          const isHero = index === 0;
          const isFinal = index === journeyStops.length - 1;
          return (
            <section
              className={`story-stop story-stop-${stop.side} ${isHero ? "hero-stop" : ""} ${
                isFinal ? "final-stop" : ""
              }`}
              id={stop.id}
              key={stop.id}
              aria-labelledby={`${stop.id}-title`}
            >
              <div className="story-inner">
                <article className="story-card">
                  <div className="eyebrow">
                    <span>{stop.eyebrow}</span>
                    <span className={`status-chip status-${stop.status}`}>
                      <StatusIcon size={14} aria-hidden="true" />
                      {stop.statusLabel}
                    </span>
                  </div>
                  <h1 id={`${stop.id}-title`} className={isHero ? "hero-title" : undefined}>
                    {stop.question}
                  </h1>
                  <p className="simple-answer">{stop.simpleAnswer}</p>

                  {isHero && (
                    <div className="hero-actions">
                      <a className="primary-button" href="#background">
                        Enter the brain
                        <ArrowDown size={17} aria-hidden="true" />
                      </a>
                      <span className="hero-note">
                        Scroll normally · about 4 minutes
                      </span>
                    </div>
                  )}

                  {stop.metrics && <Metrics metrics={stop.metrics} />}
                  {stop.id === "method" && <MethodDiagram />}
                  {stop.id === "pipeline" && <Pipeline />}
                  {stop.id === "results" && <PendingResults />}
                  {stop.id === "future" && <Limitations />}

                  <details className="technical-note" open={isFinal}>
                    <summary>
                      <span>{isFinal ? "The careful answer" : "Go deeper"}</span>
                      <ChevronDown size={17} aria-hidden="true" />
                    </summary>
                    <div className="technical-body">
                      <p>{stop.technicalDetail}</p>
                      <div className="source-links" aria-label="Sources for this section">
                        {stop.sources.map((source) => (
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
              {!isFinal && (
                <a className="next-cue" href={`#${journeyStops[index + 1].id}`}>
                  <span>Continue</span>
                  <ArrowDown size={16} aria-hidden="true" />
                </a>
              )}
            </section>
          );
        })}
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-kicker">BCI motor-imagery research</span>
          <p>Evidence first. Curiosity always.</p>
        </div>
        <div className="footer-links">
          <a href={primarySources.zenodo.href} target="_blank" rel="noreferrer">
            Dataset
          </a>
          <a href={primarySources.paper.href} target="_blank" rel="noreferrer">
            Paper
          </a>
          <a href="#integrity">Integrity</a>
          <a href="#start">Back to top</a>
        </div>
        <p className="asset-credit">
          Brain scene rendered procedurally in Three.js after the approved CC BY model download
          required authenticated access. It is an educational visual, not a diagnostic model.
          Approved references:{" "}
          <a
            href="https://sketchfab.com/3d-models/human-brain-c9c9d4d671b94345952d012cc2ea7a24"
            target="_blank"
            rel="noreferrer"
          >
            “Human Brain” by AH
          </a>{" "}
          and{" "}
          <a
            href="https://sketchfab.com/3d-models/human-brain-7a27c17fd6c0488bb31ab093236a47fb"
            target="_blank"
            rel="noreferrer"
          >
            “Human Brain” by 3DRT Studios
          </a>
          .
        </p>
      </footer>
    </>
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
      {metrics.map((metric) => (
        <div className="metric-card" key={`${metric.label}-${metric.value}`}>
          <dt>{metric.label}</dt>
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
            <span />
            <span />
            <span />
            <span />
          </div>
          <div>
            <h2>{panel.title}</h2>
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
        <a href={primarySources.zenodo.href} target="_blank" rel="noreferrer" aria-label="Open the Zenodo dataset record">
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="source-card">
        <FlaskConical size={21} aria-hidden="true" />
        <div>
          <span>Study descriptor</span>
          <strong>Scientific Data</strong>
        </div>
        <a href={primarySources.paper.href} target="_blank" rel="noreferrer" aria-label="Open the Scientific Data paper">
          <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
