"use client";

import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Database,
  FlaskConical,
  Gauge,
  Info,
  MapPin,
  Moon,
  Pause,
  Play,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  Sun,
  Ticket,
  X,
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

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function JourneyPage() {
  const [activeId, setActiveId] = useState("start");
  const [progress, setProgress] = useState(0);
  const [approachProgress, setApproachProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [webGL, setWebGL] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [routeOpen, setRouteOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);

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

      const approach = approachRef.current;
      if (approach) {
        const rect = approach.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        setApproachProgress(travel > 0 ? clamp(-rect.top / travel) : 0);
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
    if (!routeOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRouteOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [routeOpen]);

  const activeIndex = useMemo(
    () => Math.max(0, journeyStops.findIndex((stop) => stop.id === activeId)),
    [activeId],
  );
  const activeStop = journeyStops[activeIndex];

  return (
    <>
      <a className="skip-link" href="#start">
        Skip to the brain journey
      </a>

      <header className="site-header">
        <a className="brand" href="#start" aria-label="Signals in Motion home">
          <span className="brand-mark" aria-hidden="true">
            <Brain size={19} strokeWidth={2.2} />
          </span>
          <span className="brand-copy">
            <strong>Signals in Motion</strong>
            <small>BCI research journey</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="research-state">
            <span className="state-dot" aria-hidden="true" />
            Research in progress
          </span>
          <button
            className="route-button"
            type="button"
            onClick={() => setRouteOpen((value) => !value)}
            aria-expanded={routeOpen}
            aria-controls="route-map"
          >
            <Route size={17} />
            <span>Route</span>
          </button>
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

      <RouteMap
        activeId={activeId}
        activeIndex={activeIndex}
        open={routeOpen}
        onClose={() => setRouteOpen(false)}
      />

      <div className="journey-progress" aria-hidden="true">
        <span className="journey-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        <span className="journey-progress-signal" style={{ left: `${progress * 100}%` }} />
      </div>

      <div className="scene-layer" aria-hidden="true" data-stage={activeStop.stage}>
        <div className="scene-grid" />
        <div className="scene-halo scene-halo-coral" />
        <div className="scene-halo scene-halo-blue" />
        {sceneReady && webGL ? (
          <Suspense fallback={<BrainFallback label="Preparing the brain…" />}>
            <BrainScene progress={progress} motionEnabled={motionEnabled} dark={theme === "dark"} />
          </Suspense>
        ) : (
          <BrainFallback label={webGL ? "Preparing the brain…" : "Static brain view"} />
        )}
      </div>

      <main ref={mainRef} className="journey-main">
        <HeroStop active={activeId === "start"} />

        <section
          ref={approachRef}
          className="approach-stop"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="approach-sticky">
            <div className="approach-copy">
              <span className="mono-label">Now departing · Exterior</span>
              <h2 id="approach-title">
                Follow the
                <em> signal.</em>
              </h2>
              <p>
                Scroll to approach the glowing entry point. The route continues
                beneath the surface.
              </p>
              <div className="approach-meter" aria-label={`${Math.round(approachProgress * 100)} percent to first station`}>
                <span style={{ transform: `scaleX(${approachProgress})` }} />
              </div>
              <small>
                {approachProgress < 0.88 ? "Approaching neural entry…" : "Next stop: What is a BCI?"}
              </small>
            </div>
            <div className="entry-reticle" style={{ opacity: 0.3 + approachProgress * 0.7 }}>
              <span />
              <strong>Neural entry</strong>
            </div>
          </div>
        </section>

        {journeyStops.slice(1).map((stop, visibleIndex) => {
          const index = visibleIndex + 1;
          const StatusIcon = statusIcons[stop.status];
          const isFinal = stop.id === "return";
          const nextStop = journeyStops[index + 1];
          return (
            <section
              className={`story-stop story-stop-${stop.side} ${
                isFinal ? "final-stop" : ""
              } ${activeId === stop.id ? "is-active" : ""}`}
              id={stop.id}
              key={stop.id}
              aria-labelledby={`${stop.id}-title`}
              data-stage={stop.stage}
            >
              <div className="arrival-light" aria-hidden="true" />
              <div className="story-inner">
                <article className="station-card">
                  <div className="station-sign">
                    <span className="station-number">
                      {isFinal ? "END" : String(index).padStart(2, "0")}
                    </span>
                    <span>{stop.stationLabel}</span>
                    <MapPin size={15} aria-hidden="true" />
                  </div>

                  <div className="eyebrow">
                    <span className={`status-chip status-${stop.status}`}>
                      <StatusIcon size={14} aria-hidden="true" />
                      {stop.statusLabel}
                    </span>
                    <span className="platform-label">
                      Platform {String(index).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 id={`${stop.id}-title`}>{stop.question}</h2>
                  <p className="simple-answer">{stop.simpleAnswer}</p>

                  {stop.metrics && <Metrics metrics={stop.metrics} />}
                  {stop.id === "method" && <MethodDiagram />}
                  {stop.id === "pipeline" && <Pipeline />}
                  {stop.id === "results" && <PendingResults />}
                  {stop.id === "future" && <Limitations />}

                  <details className="technical-note" open={isFinal}>
                    <summary>
                      <span>{isFinal ? "The careful answer" : "Open the evidence ticket"}</span>
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

              {!isFinal && nextStop && (
                <a className="next-stop" href={`#${nextStop.id}`}>
                  <span>
                    <small>Next stop</small>
                    <strong>{nextStop.navLabel}</strong>
                  </span>
                  <ArrowRight size={19} aria-hidden="true" />
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
          <a href="#start">Ride again</a>
        </div>
        <p className="asset-credit">
          The animated brain and neural route are original procedural educational
          illustrations, not anatomical or diagnostic models. Research facts link
          to the public Zenodo record and Scientific Data descriptor.
        </p>
      </footer>
    </>
  );
}

function HeroStop({ active }: { active: boolean }) {
  const stop = journeyStops[0];
  return (
    <section
      className={`story-stop hero-stop ${active ? "is-active" : ""}`}
      id="start"
      aria-labelledby="start-title"
    >
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
      <div className="story-inner hero-layout">
        <article className="hero-copy">
          <span className="hero-ticket">
            <Ticket size={15} />
            Admit one curious mind
          </span>
          <p className="hero-kicker">Motor-imagery BCI · Interactive research story</p>
          <h1 id="start-title">
            Signals
            <span>in Motion</span>
          </h1>
          <p className="hero-intro">{stop.simpleAnswer}</p>
          <p className="hero-welcome">
            Board a guided route through the brain, from first signal to careful
            scientific conclusion.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#approach">
              Begin the journey
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <span className="hero-note">8 stations · scroll at your own pace</span>
          </div>
        </article>

        <div className="route-preview" aria-label="Journey route overview">
          <span className="route-preview-label">Today&apos;s route</span>
          <ol>
            {journeyStops.slice(1, -1).map((journeyStop, index) => (
              <li key={journeyStop.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {journeyStop.navLabel}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <a className="scroll-cue" href="#approach">
        <span>Scroll to depart</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

function RouteMap({
  activeId,
  activeIndex,
  open,
  onClose,
}: {
  activeId: string;
  activeIndex: number;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <nav
      className={`route-map ${open ? "is-open" : ""}`}
      id="route-map"
      aria-label="Brain journey stations"
      aria-hidden={!open}
    >
      <div className="route-map-head">
        <span>
          <Route size={17} />
          Neural line
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close route map"
          tabIndex={open ? 0 : -1}
        >
          <X size={18} />
        </button>
      </div>
      <div className="route-current">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <p>
          Current stop
          <strong>{journeyStops[activeIndex].navLabel}</strong>
        </p>
      </div>
      <ol>
        {journeyStops.map((stop, index) => (
          <li key={stop.id} className={index < activeIndex ? "is-complete" : ""}>
            <a
              href={`#${stop.id}`}
              aria-current={activeId === stop.id ? "step" : undefined}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
            >
              <span className="route-dot" aria-hidden="true">
                {index < activeIndex ? <Check size={11} /> : null}
              </span>
              <span>
                <small>{index === 0 ? "DEP" : index === journeyStops.length - 1 ? "END" : `S${String(index).padStart(2, "0")}`}</small>
                <strong>{stop.navLabel}</strong>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
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
          <span className="ticket-notch ticket-notch-left" aria-hidden="true" />
          <span className="ticket-notch ticket-notch-right" aria-hidden="true" />
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
