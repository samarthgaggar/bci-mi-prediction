"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  BrainCircuit,
  Check,
  ChevronDown,
  CirclePause,
  CirclePlay,
  Database,
  ExternalLink,
  FileWarning,
  Fingerprint,
  FlaskConical,
  Gauge,
  Layers3,
  LockKeyhole,
  Menu,
  Microscope,
  Network,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Waypoints,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type RefObject,
} from "react";

import {
  datasetMetrics,
  evidenceNotes,
  faqs,
  footerGroups,
  integrityCards,
  overviewCards,
  pipelineStages,
  projectAreas,
  sections,
} from "@/lib/site-content";

type IconComponent = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  className?: string;
  strokeWidth?: number;
}>;

const overviewIcons: IconComponent[] = [
  Fingerprint,
  BookOpen,
  ShieldCheck,
  Microscope,
];

const integrityIcons: IconComponent[] = [
  LockKeyhole,
  Waypoints,
  Network,
  ShieldCheck,
];

const areaIcons: IconComponent[] = [
  BrainCircuit,
  Database,
  RadioTower,
  Layers3,
  FlaskConical,
  Gauge,
];

function scrollRail(
  rail: RefObject<HTMLDivElement | null>,
  direction: -1 | 1,
) {
  const element = rail.current;
  if (!element) return;
  const card = element.querySelector<HTMLElement>("[data-rail-card]");
  const distance = (card?.offsetWidth ?? element.clientWidth * 0.72) + 22;
  element.scrollBy({ left: distance * direction, behavior: "smooth" });
}

function CountUp({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [display, setDisplay] = useState(value);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let animationFrame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1050;
        const started = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) animationFrame = requestAnimationFrame(tick);
        };

        setDisplay(0);
        animationFrame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <span
      ref={numberRef}
      className="metric__value"
      aria-label={`${value}${suffix}`}
    >
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
    </span>
  );
}

function SectionIntro({
  sectionId,
  dark = false,
}: {
  sectionId: (typeof sections)[number]["id"];
  dark?: boolean;
}) {
  const section = sections.find((item) => item.id === sectionId);
  if (!section) return null;

  return (
    <div className={`section-intro${dark ? " section-intro--dark" : ""}`}>
      <div>
        <p className="eyebrow">
          <span aria-hidden="true" />
          {section.eyebrow}
        </p>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
      </div>
      <p className="section-intro__description">{section.description}</p>
    </div>
  );
}

function Placeholder({
  label,
  index,
  compact = false,
}: {
  label: string;
  index?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`media-placeholder animated-surface${compact ? " media-placeholder--compact" : ""}`}
      role="img"
      aria-label={`${label} image reserved for a later phase`}
    >
      <div className="media-placeholder__grid" aria-hidden="true" />
      <div className="media-placeholder__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="media-placeholder__meta">
        {index ? <span>{index}</span> : null}
        <span>Visual reserved</span>
      </div>
    </div>
  );
}

export function SiteExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [motionPaused, setMotionPaused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pipelineRail = useRef<HTMLDivElement>(null);
  const evidenceRail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-js");
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
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

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus();
    };
  }, [menuOpen]);

  return (
    <div
      className="site-shell"
      data-motion-paused={motionPaused ? "true" : "false"}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#home" aria-label="BCI research home">
          <span className="brand__mark" aria-hidden="true">
            <span />
          </span>
          <span>BCI / DATA MINERS</span>
        </a>

        <nav className="desktop-nav" aria-label="Research sections">
          {sections.slice(0, 6).map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.navigationLabel}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#sources">
          Sources
          <ArrowUpRight aria-hidden="true" />
        </a>

        <button
          className="menu-trigger"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`menu-overlay${menuOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
      >
        <div className="menu-overlay__top">
          <span className="brand brand--menu">
            <span className="brand__mark" aria-hidden="true">
              <span />
            </span>
            <span>BCI / DATA MINERS</span>
          </span>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="menu-overlay__body">
          <p className="menu-overlay__index">Explore the research</p>
          <nav aria-label="Mobile research sections">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setMenuOpen(false)}
              >
                <span>0{index + 1}</span>
                {section.navigationLabel}
                <ArrowRight aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
        <div className="menu-overlay__footer">
          <p>Source-traced motor-imagery BCI research.</p>
          <a
            href="https://zenodo.org/records/8089820"
            target="_blank"
            rel="noreferrer"
          >
            Original dataset
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </div>

      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero__placeholder animated-surface" aria-hidden="true">
            <div className="hero__grid" />
            <div className="signal-field">
              {Array.from({ length: 8 }, (_, index) => (
                <span
                  key={index}
                  style={{ "--line-index": index } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="hero__orb">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="container hero__content reveal is-visible">
            <p className="hero__kicker">
              <span>Motor imagery</span>
              <span>Human variability</span>
              <span>Research in progress</span>
            </p>
            <h1 id="hero-title">
              Building BCI systems that work for{" "}
              <em>more people.</em>
            </h1>
            <div className="hero__bottom">
              <p>
                A source-traced study of performance variability in
                motor-imagery brain-computer interfaces.
              </p>
              <div className="hero__actions">
                <a className="button button--light" href="#overview">
                  Explore the study
                  <ArrowDown aria-hidden="true" />
                </a>
                <a className="button button--ghost" href="#pipeline">
                  View the pipeline
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <button
            className="motion-control"
            type="button"
            onClick={() => setMotionPaused((current) => !current)}
            aria-label={
              motionPaused
                ? "Play decorative motion"
                : "Pause decorative motion"
            }
          >
            {motionPaused ? (
              <CirclePlay aria-hidden="true" />
            ) : (
              <CirclePause aria-hidden="true" />
            )}
            <span>{motionPaused ? "Play motion" : "Pause motion"}</span>
          </button>
        </section>

        <section
          className="section section--light overview"
          id="overview"
          aria-labelledby="overview-title"
        >
          <div className="container">
            <div className="reveal">
              <SectionIntro sectionId="overview" />
            </div>
            <div className="overview-grid">
              {overviewCards.map((card, index) => {
                const Icon = overviewIcons[index];
                return (
                  <article
                    className="principle-card reveal"
                    key={card.title}
                    style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}
                  >
                    <div className="principle-card__top">
                      <span>0{index + 1}</span>
                      <Icon aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section section--warm dataset"
          id="dataset"
          aria-labelledby="dataset-title"
        >
          <div className="container">
            <div className="reveal">
              <SectionIntro sectionId="dataset" />
            </div>

            <div className="dataset-bento">
              <article className="dataset-story dataset-story--primary reveal">
                <p className="card-label">From signal to research record</p>
                <h3>
                  One session captures baseline, calibration, and online
                  performance.
                </h3>
                <p>
                  A complete participant record moves from eyes-open and
                  eyes-closed baselines to acquisition Runs 1–2 and
                  feedback-enabled online Runs 3–6.
                </p>
                <Placeholder label="Acquisition sequence" compact />
              </article>

              <div className="metric-grid">
                {datasetMetrics.map((metric, index) => (
                  <article
                    className="metric reveal"
                    key={metric.label}
                    style={{ "--delay": `${index * 65}ms` } as React.CSSProperties}
                  >
                    <CountUp value={metric.value} suffix={metric.suffix} />
                    <div>
                      <h3>{metric.label}</h3>
                      <p>{metric.detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <article className="dataset-story dataset-story--secondary reveal">
                <p className="card-label">Case driven</p>
                <h3>Documented exceptions shape the analysis.</h3>
                <p>
                  Trigger differences, absent runs, questionnaire losses,
                  experimenter notes, and noisy trials remain visible because
                  they change what the evidence can support.
                </p>
                <a className="text-link" href="#evidence">
                  Read the evidence notes
                  <ArrowRight aria-hidden="true" />
                </a>
              </article>
            </div>
          </div>
        </section>

        <section
          className="section section--dark pipeline"
          id="pipeline"
          aria-labelledby="pipeline-title"
        >
          <div className="container">
            <div className="reveal">
              <SectionIntro sectionId="pipeline" dark />
            </div>
            <div className="rail-controls reveal">
              <p>Ten connected research stages</p>
              <div>
                <button
                  type="button"
                  aria-label="Show previous pipeline stage"
                  onClick={() => scrollRail(pipelineRail, -1)}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Show next pipeline stage"
                  onClick={() => scrollRail(pipelineRail, 1)}
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div
            className="pipeline-rail reveal"
            ref={pipelineRail}
            role="region"
            aria-label="Research pipeline stages"
            tabIndex={0}
          >
            {pipelineStages.map((stage) => (
              <article
                className="pipeline-card"
                key={stage.index}
                data-rail-card
              >
                <Placeholder label={stage.title} index={stage.index} />
                <div className="pipeline-card__content">
                  <div>
                    <span>{stage.state}</span>
                    <span>{stage.index} / 10</span>
                  </div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section section--light integrity"
          id="integrity"
          aria-labelledby="integrity-title"
        >
          <div className="container">
            <div className="reveal">
              <SectionIntro sectionId="integrity" />
            </div>
            <div className="integrity-grid">
              {integrityCards.map((card, index) => {
                const Icon = integrityIcons[index];
                return (
                  <article
                    className={`integrity-card integrity-card--${index + 1} reveal`}
                    key={card.title}
                  >
                    <div className="integrity-card__visual animated-surface">
                      <span className="integrity-card__index">0{index + 1}</span>
                      <Icon aria-hidden="true" strokeWidth={1.4} />
                      {index === 1 ? (
                        <div className="orbit" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : null}
                    </div>
                    <div className="integrity-card__copy">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section section--ink project-areas"
          id="project-areas"
          aria-labelledby="project-areas-title"
        >
          <div className="container">
            <div className="reveal">
              <SectionIntro sectionId="project-areas" dark />
            </div>
            <div className="areas-list">
              {projectAreas.map((area, index) => {
                const Icon = areaIcons[index];
                return (
                  <article className="area-row reveal" key={area.title}>
                    <span className="area-row__index">0{index + 1}</span>
                    <Icon aria-hidden="true" />
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                    <ArrowUpRight
                      className="area-row__arrow"
                      aria-hidden="true"
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section section--warm evidence"
          id="evidence"
          aria-labelledby="evidence-title"
        >
          <div className="container">
            <div className="reveal">
              <SectionIntro sectionId="evidence" />
            </div>
            <div className="rail-controls rail-controls--light reveal">
              <p>
                <FileWarning aria-hidden="true" />
                Five documented exceptions
              </p>
              <div>
                <button
                  type="button"
                  aria-label="Show previous evidence note"
                  onClick={() => scrollRail(evidenceRail, -1)}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Show next evidence note"
                  onClick={() => scrollRail(evidenceRail, 1)}
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div
            className="evidence-rail reveal"
            ref={evidenceRail}
            role="region"
            aria-label="Documented dataset exceptions"
            tabIndex={0}
          >
            {evidenceNotes.map((note, index) => (
              <article className="evidence-card" key={note.title} data-rail-card>
                <div className="evidence-card__rating" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, star) => (
                    <Sparkles key={star} />
                  ))}
                </div>
                <h3>{note.description}</h3>
                <div className="evidence-card__source">
                  <span aria-hidden="true">
                    <Braces />
                  </span>
                  <p>
                    <strong>{note.title}</strong>
                    <small>{note.type}</small>
                  </p>
                </div>
                <span className="evidence-card__number">0{index + 1}</span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section section--light faq"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="container faq-layout">
            <div className="faq-layout__heading reveal">
              <SectionIntro sectionId="faq" />
              <div className="faq-status">
                <span aria-hidden="true">
                  <Check />
                </span>
                <p>
                  <strong>Publication state</strong>
                  Results remain gated while local artifacts are under review.
                </p>
              </div>
            </div>
            <div className="accordion reveal">
              {faqs.map((faq, index) => {
                const expanded = openFaq === index;
                return (
                  <div className="accordion__item" key={faq.question}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-button-${index}`}
                        onClick={() => setOpenFaq(expanded ? null : index)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown aria-hidden="true" />
                      </button>
                    </h3>
                    <div
                      className="accordion__panel"
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-button-${index}`}
                      hidden={!expanded}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="sources">
        <div className="container">
          <div className="footer__top reveal">
            <div>
              <p className="eyebrow eyebrow--dark">
                <span aria-hidden="true" />
                Project updates
              </p>
              <h2>Follow the research as the evidence becomes publishable.</h2>
              <p>
                Subscriptions are not connected in this phase. No address is
                collected or transmitted.
              </p>
            </div>
            <form className="update-form" aria-label="Project updates unavailable">
              <label htmlFor="updates-email">Email address</label>
              <div>
                <input
                  id="updates-email"
                  type="email"
                  placeholder="Updates not yet enabled"
                  disabled
                />
                <button type="button" disabled>
                  Unavailable
                </button>
              </div>
              <p role="status">Publication updates will be connected later.</p>
            </form>
          </div>

          <div className="footer__links">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                    >
                      {link.label}
                      {external ? <ArrowUpRight aria-hidden="true" /> : null}
                    </a>
                  );
                })}
              </div>
            ))}
            <div className="footer__record">
              <h3>Research record</h3>
              <p>
                Motor-imagery BCI performance variability, documented by The
                Data Miners.
              </p>
              <span>Evidence before claims.</span>
            </div>
          </div>

          <div className="footer__bottom">
            <a className="brand brand--footer" href="#home">
              <span className="brand__mark" aria-hidden="true">
                <span />
              </span>
              <span>BCI</span>
            </a>
            <p>© 2026 The Data Miners · Research in progress</p>
            <a href="#home">
              Back to top
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
