import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteTitle =
  "Quantifying and Forecasting Performance Variability in Motor Imagery Brain-Computer Interfaces";
const routes = ["/", "/methodology", "/results"];
const primarySections = [
  ["background", "Background"],
  ["methodology", "Methodology"],
  ["data-science-pipeline", "Data Science Pipeline"],
  ["results", "Results"],
  ["future-directions", "Future Directions"],
];

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${pathname}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function htmlFor(pathname) {
  const response = await render(pathname);
  assert.equal(response.status, 200, `${pathname} should render successfully`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    assert.equal(
      entry.isSymbolicLink(),
      false,
      `published/source trees must not contain symlinks: ${fullPath}`,
    );
    if (entry.isDirectory()) files.push(...(await listFiles(fullPath)));
    else files.push(fullPath);
  }

  return files;
}

function plainText(fragment) {
  return fragment
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function navigationLinks(fragment) {
  return [...fragment.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
    .map((match) => {
      const href = match[1].match(/\bhref="([^"]+)"/)?.[1];
      return href ? { href, label: plainText(match[2]) } : null;
    })
    .filter(Boolean);
}

test("renders all research routes", async () => {
  await Promise.all(routes.map((route) => htmlFor(route)));
});

test("uses the exact five-section editorial navigation and home structure", async () => {
  const home = await htmlFor("/");
  const expectedIds = primarySections.map(([id]) => id);
  const expectedLabels = primarySections.map(([, label]) => label);
  const navigationBlocks = [...home.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/g)];

  const qualifyingNavigation = navigationBlocks
    .map((match) => navigationLinks(match[0]))
    .find((links) => {
      const ids = new Set(
        links
          .map(({ href }) => new URL(href, "http://localhost").hash.slice(1))
          .filter((id) => expectedIds.includes(id)),
      );
      return ids.size === expectedIds.length;
    });

  assert.ok(
    qualifyingNavigation,
    "a navigation landmark must link to all five editorial sections",
  );

  const labelsBySection = new Map();
  for (const { href, label } of qualifyingNavigation) {
    const url = new URL(href, "http://localhost");
    const id = url.hash.slice(1);
    if (url.pathname === "/" && expectedIds.includes(id)) {
      if (!labelsBySection.has(id)) labelsBySection.set(id, new Set());
      labelsBySection.get(id).add(label);
    }
  }

  assert.deepEqual([...labelsBySection.keys()], expectedIds);
  assert.deepEqual(
    expectedIds.map((id) => [...labelsBySection.get(id)]),
    expectedLabels.map((label) => [label]),
  );

  for (const [id, label] of primarySections) {
    assert.match(
      home,
      new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>`),
      `home must contain the ${id} section`,
    );
    assert.match(
      home,
      new RegExp(`<h[12]\\b[^>]*>\\s*${label}\\s*</h[12]>`),
      `${label} must be an explicit page heading`,
    );
  }
});

test("states cleaning and every downstream phase honestly", async () => {
  const rendered = await Promise.all(routes.map((route) => htmlFor(route)));
  const allHtml = rendered.join("\n");

  assert.match(allHtml, /Cleaning in progress/i);
  assert.match(allHtml, /Validation pending/i);
  assert.match(allHtml, /Analysis pending/i);
  assert.match(allHtml, /Results pending|Awaiting verified analysis/i);
  assert.doesNotMatch(
    allHtml,
    /cleaning (?:is )?(?:complete|completed)|validation (?:is )?(?:complete|completed)|analysis (?:is )?(?:complete|completed)|verified results are available/i,
  );
});

test("publishes restrained route metadata with a site-specific social image", async () => {
  const [home, methodology, results] = await Promise.all([
    htmlFor("/"),
    htmlFor("/methodology"),
    htmlFor("/results"),
  ]);

  assert.ok(home.includes(`<title>${siteTitle}</title>`));
  assert.ok(methodology.includes(`<title>Methodology · ${siteTitle}</title>`));
  assert.ok(results.includes(`<title>Results · ${siteTitle}</title>`));
  assert.match(home, /name="author" content="The Data Miners"/);
  assert.match(home, /name="creator" content="The Data Miners"/);

  for (const html of [home, methodology, results]) {
    assert.match(
      html,
      /property="og:image" content="http:\/\/localhost\/og\.png"/i,
    );
    assert.match(
      html,
      /name="twitter:image" content="http:\/\/localhost\/og\.png"/i,
    );
  }
});

test("uses typed, source-bound research content contracts", async () => {
  const source = await readFile(
    new URL("../lib/research-content.ts", import.meta.url),
    "utf8",
  );
  const statusContract = source.match(
    /export type ResearchStatus\s*=([\s\S]*?);/,
  )?.[1];

  assert.ok(statusContract, "ResearchStatus must remain an exported type");
  for (const status of [
    "draft",
    "cleaning-in-progress",
    "analysis-pending",
    "results-pending",
    "verified",
  ]) {
    assert.match(statusContract, new RegExp(`"${status}"`));
  }

  assert.match(source, /export interface ResearchSection/);
  assert.match(source, /export interface ResultPlaceholder/);
  assert.match(source, /status:\s*ResearchStatus/);
  assert.match(source, /sourceRefs:\s*SourceReference\["id"\]\[\]/);
  assert.match(source, /accessibilitySummary:\s*string/);
  assert.match(source, /intendedVisualizationType:/);
});

test("keeps four digit-free result fixtures explicitly pending", async () => {
  const [source, resultsPage, resultFigure] = await Promise.all([
    readFile(new URL("../lib/research-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/results/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/result-figure.tsx", import.meta.url), "utf8"),
  ]);
  const resultFixtures = source.match(
    /export const resultPlaceholders[\s\S]*?=\s*\[([\s\S]*?)\n\];/,
  )?.[1];

  assert.ok(resultFixtures, "resultPlaceholders must remain an exported array");

  const ids = [...resultFixtures.matchAll(/\bid:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  const statuses = [
    ...resultFixtures.matchAll(/\bstatus:\s*"([^"]+)"/g),
  ].map((match) => match[1]);

  assert.equal(ids.length, 4);
  assert.equal(new Set(ids).size, 4);
  assert.deepEqual(statuses, Array(4).fill("results-pending"));
  assert.doesNotMatch(resultFixtures, /\d/);
  assert.doesNotMatch(
    resultFixtures,
    /\bp[- ]?value\b|\baccuracy\b|\beffect[- ]?size\b|%/i,
  );

  const renderedResultSources = `${resultsPage}\n${resultFigure}`;
  assert.doesNotMatch(
    renderedResultSources,
    /\b(?:accuracy|score|effect[- ]?size|p[- ]?value|mean|median)\b[^\n]{0,48}\d/i,
  );
  assert.match(resultFigure, /Awaiting verified analysis/);
  assert.match(resultFigure, /data-kind=\{figure\.intendedVisualizationType\}/);
  for (const visualization of [
    "distribution",
    "comparison",
    "signal",
    "spectrum",
  ]) {
    assert.match(resultFigure, new RegExp(`${visualization}:\\s*\\d`));
  }
});

test("does not retain starter, authentication, or database scaffolding", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const sourceFiles = (
    await Promise.all(
      ["app", "components", "lib", "worker"].map((directory) =>
        listFiles(path.join(root, directory)),
      ),
    )
  ).flat();
  const source = (
    await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))
  ).join("\n");
  const packageJson = await readFile(
    new URL("../package.json", import.meta.url),
    "utf8",
  );
  const combined = `${source}\n${packageJson}`;

  assert.doesNotMatch(combined, /codex-preview/i);
  assert.doesNotMatch(combined, /Your site is taking shape/i);
  assert.doesNotMatch(combined, /react-loading-skeleton/i);
  assert.doesNotMatch(
    combined,
    /chatgpt-auth|better-auth|next-auth|drizzle-orm|drizzle-kit|@prisma|D1Database|wrangler\s+d1/i,
  );

  for (const relativePath of [
    "app/_sites-preview",
    "examples",
    "drizzle",
    "prisma",
  ]) {
    await assert.rejects(stat(path.join(root, relativePath)));
  }
});

test("publishes only approved web imagery and excludes scientific data formats", async () => {
  const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
  const files = await listFiles(publicPath);
  const scientificFilePattern =
    /\.(?:gdf|edf|bdf|set|fdt|mat|csv|tsv|xlsx?|xml|vhdr|vmrk|eeg)$/i;
  const relativeFiles = files.map((file) =>
    path.relative(publicPath, file).split(path.sep).join("/"),
  );

  assert.equal(
    files.some((file) => scientificFilePattern.test(file)),
    false,
  );
  for (const requiredImage of [
    "images/research-portals/eeg-methodology-portal.jpg",
    "images/research-portals/brain-signal-results-portal.jpg",
    "images/research-portals/bci-research-background.jpg",
  ]) {
    assert.ok(
      relativeFiles.includes(requiredImage),
      `approved representative image must be published: ${requiredImage}`,
    );
  }
  assert.equal(
    relativeFiles.every((file) => /\.(?:jpe?g|png|webp)$/i.test(file)),
    true,
    "public assets must remain limited to approved web image formats",
  );
});

test("renders accessible, source-credited research portals", async () => {
  const [home, portalSource, portalComponent] = await Promise.all([
    htmlFor("/"),
    readFile(new URL("../lib/research-portals.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../components/ui/bci-page-reveal.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(home, /Research portals/i);
  assert.match(home, /Enter the study through its evidence/i);
  assert.match(home, /data-representative-stock="true"/i);
  assert.match(
    home,
    /Representative EEG setup shown for visual context/i,
  );

  for (const destination of ["/methodology", "/results", "/#background"]) {
    assert.match(portalSource, new RegExp(`href:\\s*"${destination}"`));
  }
  assert.equal(
    [...portalSource.matchAll(/https:\/\/www\.pexels\.com\/photo\//g)].length,
    3,
  );
  assert.match(portalComponent, /useReducedMotion/);
  assert.match(portalComponent, /onError=/);
  assert.match(portalComponent, /event\.key === " "/);
  assert.match(portalComponent, /router\.prefetch/);
  assert.match(portalComponent, /aria-busy=/);
});

test("rejects authored AI-template motifs and old dramatic copy", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const authoredFiles = (
    await Promise.all(
      ["app", "components", "lib"].map((directory) =>
        listFiles(path.join(root, directory)),
      ),
    )
  ).flat();
  const authoredSource = (
    await Promise.all(authoredFiles.map((file) => readFile(file, "utf8")))
  ).join("\n");
  const oldDramaticPhrases = [
    "earn the right to analyze",
    "a deliberate sequence, not a rush to findings",
    "the structure is ready. the evidence is not",
    "limitations belong in the foreground",
    "every claim should lead back to evidence",
    "research made legible before it is made final",
    "questions first. visuals second",
    "document exceptions. never smooth them away",
    "built for evidence. intentionally empty",
  ];

  assert.doesNotMatch(authoredSource, /\bSignalField\b/);
  assert.doesNotMatch(authoredSource, /\bSparkles\b/);
  assert.doesNotMatch(
    authoredSource,
    /\b(?:linear|radial|conic)-gradient\s*\(|\bbg-gradient-|gradient-to-/i,
  );
  assert.doesNotMatch(authoredSource, /backdrop-filter|backdrop-blur/i);
  assert.doesNotMatch(authoredSource, /\bshadow-2xl\b/i);

  const normalizedSource = authoredSource.toLowerCase();
  for (const phrase of oldDramaticPhrases) {
    assert.equal(
      normalizedSource.includes(phrase),
      false,
      `authored source must not retain the old phrase: "${phrase}"`,
    );
  }

  await assert.rejects(
    stat(path.join(root, "components", "signal-field.tsx")),
  );
});
