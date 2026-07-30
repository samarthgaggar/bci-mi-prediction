import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

async function render(route = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${route}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${route}`, {
      headers: { accept: "text/html" },
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

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else files.push(target);
  }
  return files;
}

function relativeLuminance(hex) {
  const channels = hex
    .match(/\w{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("server-renders the complete motor imagery BCI research page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Predicting Motor Imagery from EEG · BCI Research Project<\/title>/i,
  );
  assert.match(html, /Predicting Motor Imagery from EEG/i);
  assert.match(
    html,
    /CSP–MLP reached a 69\.6% mean participant balanced accuracy/i,
  );
  assert.match(html, />Index</i);
  assert.match(html, /Project index/i);
  assert.match(html, /01 — BCI basics/i);
  assert.match(html, /What does a brain–computer interface measure\?/i);
  assert.match(html, /classifier receives sensor measurements/i);
  assert.match(html, />87</);
  assert.match(html, />694</);
  assert.match(html, />32</);
  assert.match(html, />512 Hz</);
  assert.match(html, /27 EEG · 3 EOG · 2 EMG/);
  assert.match(html, /Versioned notebook results/);
  assert.match(html, /69\.6%/);
  assert.match(html, /68\.25%/);
  assert.match(html, /68\.30%/);
  assert.match(html, /Five-fold training OOF/);
  assert.match(html, /Held-out validation/);
  assert.match(html, /12 → 16 → 8 → 2/);
  assert.match(html, /metric tables/);
  assert.match(html, /verified figures/i);
  assert.match(html, /Complete results ledger/);
  assert.match(html, /Verified exploratory dataset figures/);
  assert.match(html, /Zenodo 8089820/);
  assert.match(html, /Scientific Data/);
  assert.match(html, /Analysis complete/);
  assert.match(html, /CC0 lateral-view illustration via Wikimedia Commons/);
  assert.match(html, /Skip to the project overview/);
  assert.doesNotMatch(
    html,
    /Signals in Motion|Admit one curious mind|Evidence first\. Curiosity always|Ride again|Neural line|Explore the project/i,
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("renders every stable section anchor and accessibility control", async () => {
  const html = await (await render()).text();
  const linkedAnchors = [
    "start",
    "bci",
    "background",
    "dataset",
    "method",
    "integrity",
    "pipeline",
    "models",
    "results",
    "figures",
    "future",
    "return",
  ];

  for (const anchor of linkedAnchors) {
    assert.match(html, new RegExp(`id="${anchor}"`));
    assert.match(html, new RegExp(`href="#${anchor}"`));
  }

  assert.match(html, /id="approach"/);
  assert.match(html, /aria-label="Research contents"/);
  assert.match(html, /role="dialog"/);
  assert.match(html, />Auto scroll</);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /Turn on automatic scrolling/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Pause visual motion/);
  assert.match(html, /Switch to (?:light|dark) theme/);
  assert.match(html, /<details class="technical-note"/);
  assert.match(html, /aria-label="Sources for this section"/);
});

test("uses restrained research typography and removes visible travel instructions", async () => {
  const [html, layout, css] = await Promise.all([
    (await render()).text(),
    readFile(path.join(projectRoot, "app/layout.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/globals.css"), "utf8"),
  ]);
  const visibleText = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|quot|#x27);/gi, " ")
    .replace(/\s+/g, " ");

  assert.match(layout, /Manrope/);
  assert.doesNotMatch(layout, /Nunito_Sans/);
  assert.doesNotMatch(layout, /Bricolage_Grotesque/);
  assert.doesNotMatch(css, /\.hero-copy h1[\s\S]{0,700}-webkit-text-stroke/);
  assert.doesNotMatch(
    visibleText,
    /\b(?:story|journey|adventure|station|route|depart|walkthrough)\b|explore the project/i,
  );
});

test("uses an editorial interface instead of stock icon and card patterns", async () => {
  const [page, css] = await Promise.all([
    readFile(path.join(projectRoot, "components/research-page.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/globals.css"), "utf8"),
  ]);

  assert.doesNotMatch(page, /lucide-react/);
  assert.doesNotMatch(page, /View technical details|Research section/);
  assert.doesNotMatch(page, /hero-network|hero-continuity/);
  assert.match(page, /Methods, scope, and sources/);
  assert.match(css, /--display:\s*var\(--font-body\)/);
  assert.match(
    css,
    /\.section-card,[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/,
  );
  assert.match(css, /\.scene-grid,[\s\S]*?display:\s*none;/);
  assert.match(
    css,
    /\.metric-card\s*\{[\s\S]*?border-radius:\s*0;[\s\S]*?background:\s*transparent;/,
  );
});

test("provides separate Next.js and Sites deployment builds", async () => {
  const [packageSource, vercelSource] = await Promise.all([
    readFile(path.join(projectRoot, "package.json"), "utf8"),
    readFile(path.join(projectRoot, "vercel.json"), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);
  const vercel = JSON.parse(vercelSource);

  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.match(packageJson.scripts["build:sites"], /vinext build/);
  assert.equal(packageJson.scripts.test, "npm run build:sites && node --test tests/rendered-html.test.mjs");
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "npm run build");
  assert.equal("outputDirectory" in vercel, false);
});

test("implements reversible looping auto scroll", async () => {
  const page = await readFile(
    path.join(projectRoot, "components/research-page.tsx"),
    "utf8",
  );

  assert.match(page, /setAutoScrollEnabled\(\(value\) => !value\)/);
  assert.match(page, /window\.requestAnimationFrame\(advance\)/);
  assert.match(page, /window\.scrollBy/);
  assert.match(page, /window\.scrollTo\(0, 0\)/);
  assert.match(page, /window\.cancelAnimationFrame/);
  assert.match(page, /prefers-reduced-motion: reduce/);
});

test("publishes the verified CSP-MLP metrics with evaluation boundaries", async () => {
  const content = await readFile(
    path.join(projectRoot, "lib/research-content.ts"),
    "utf8",
  );
  const modelStart = content.indexOf('id: "models"');
  const resultStart = content.indexOf('id: "results"');
  const resultEnd = content.indexOf('id: "figures"');
  const modelBlock = content.slice(modelStart, resultStart);
  const resultBlock = content.slice(resultStart, resultEnd);

  assert.ok(modelStart > 0 && resultStart > modelStart && resultEnd > resultStart);
  assert.match(modelBlock, /70\.45%/);
  assert.match(modelBlock, /69\.10%/);
  assert.match(modelBlock, /66\.43%/);
  assert.match(modelBlock, /in-sample diagnostic/i);
  assert.match(resultBlock, /status: "verified"/);
  assert.match(resultBlock, /68\.25%/);
  assert.match(resultBlock, /68\.30%/);
  assert.match(resultBlock, /68\.19%/);
  assert.match(resultBlock, /76\.16%/);
  assert.match(resultBlock, /held-out participant test/i);
  assert.doesNotMatch(resultBlock, /Awaiting verified analysis|results gated/i);
  assert.match(content, /window CV BA/);
  assert.match(content, /best band gain/);
  assert.match(content, /0\.5–3\.0 second cue window/i);
  assert.doesNotMatch(content, /60\.20% locked|62\.61%|XGBoost EEG baseline/i);
});

test("ships only the 15 verified exploratory figures with byte checks", async () => {
  const expected = new Map([
    [
      "performance-by-run.png",
      {
        digest: "0f0a3ed5147cab642f663772955301810856966d4cf3e0fba0613dc1a53b0263",
        width: 1484,
        height: 889,
      },
    ],
    [
      "mean-performance-by-run.png",
      {
        digest: "fcf9c874422abe217aca316b57f488e42b8170172cd2bcc7b488cdd77a656a7d",
        width: 1333,
        height: 884,
      },
    ],
    [
      "learning-style-correlations.png",
      {
        digest: "3085a313459e51a46b38bf8e80c362f636e1fe724051024c7919874e94c4782a",
        width: 2683,
        height: 1330,
      },
    ],
  ]);

  for (const [name, metadata] of expected) {
    const image = await readFile(path.join(projectRoot, "public/results", name));
    const digest = createHash("sha256").update(image).digest("hex");
    assert.equal(image.toString("ascii", 1, 4), "PNG");
    assert.equal(image.readUInt32BE(16), metadata.width);
    assert.equal(image.readUInt32BE(20), metadata.height);
    assert.equal(digest, metadata.digest);
  }

  const resultFiles = (await walk(path.join(projectRoot, "public/results"))).filter(
    (file) => file.endsWith(".png"),
  );
  assert.equal(resultFiles.length, 15);
  assert.ok(resultFiles.every((file) => !file.includes(`${path.sep}model${path.sep}`)));

  for (const file of resultFiles) {
    const image = await readFile(file);
    assert.equal(image.toString("ascii", 1, 4), "PNG");
    assert.ok(image.readUInt32BE(16) > 800);
    assert.ok(image.readUInt32BE(20) > 600);
  }
});

test("does not publish raw research data or hotlinked media", async () => {
  const publicFiles = await walk(path.join(projectRoot, "public"));
  const forbiddenExtensions =
    /\.(gdf|edf|bdf|set|fdt|mat|xlsx?|csv|tsv|xml|vhdr|vmrk|eeg|zip|7z|rar)$/i;

  for (const file of publicFiles) {
    assert.doesNotMatch(file, forbiddenExtensions);
  }

  const sourceFiles = [
    ...(await walk(path.join(projectRoot, "app"))),
    ...(await walk(path.join(projectRoot, "components"))),
    ...(await walk(path.join(projectRoot, "lib"))),
  ].filter((file) => /\.(tsx?|css)$/.test(file));

  for (const file of sourceFiles) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /(?:src|url)\s*=\s*["']https?:\/\//i);
    if (file.endsWith(".css")) {
      assert.doesNotMatch(source, /url\(\s*["']?https?:\/\//i);
    }
  }
});

test("keeps the site one-page and retires accidental subroutes", async () => {
  for (const route of ["/results", "/methodology", "/api/results"]) {
    const response = await render(route);
    assert.equal(response.status, 404);
  }
});

test("meets core light and dark theme contrast requirements", () => {
  const pairs = [
    ["f7fbff", "050b1c"],
    ["bfd0e7", "050b1c"],
    ["8ea5c2", "050b1c"],
    ["102443", "eef6ff"],
    ["3f5877", "eef6ff"],
    ["526a87", "eef6ff"],
    ["1d7759", "dcf4e8"],
    ["765019", "fff0cb"],
  ];

  for (const [foreground, background] of pairs) {
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `${foreground} on ${background} must meet WCAG AA`,
    );
  }
});

test("ships a correctly sized, project-local social preview", async () => {
  const ogPath = path.join(projectRoot, "public/og.png");
  const fallbackPath = path.join(projectRoot, "public/brain-fallback.png");
  const [image, details, fallback, fallbackDetails] = await Promise.all([
    readFile(ogPath),
    stat(ogPath),
    readFile(fallbackPath),
    stat(fallbackPath),
  ]);
  assert.equal(image.toString("ascii", 1, 4), "PNG");
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.ok(details.size < 2_500_000);
  assert.equal(fallback.toString("ascii", 1, 4), "PNG");
  assert.equal(fallback.readUInt32BE(16), 700);
  assert.equal(fallback.readUInt32BE(20), 700);
  assert.ok(fallbackDetails.size < 2_000_000);
});

test("ships a verified local anatomical brain graphic", async () => {
  const brainPath = path.join(projectRoot, "public/brain-anatomy.svg");
  const brain = await readFile(brainPath, "utf8");
  const digest = createHash("sha256").update(brain).digest("hex");

  assert.equal(
    digest,
    "b6884cae09fdb505b0b37b741850ee95f8b4144956f41c8282c25fe499dd1806",
  );
  assert.match(brain, /viewBox="0 0 1200 1200"/);
  assert.match(brain, /#d78282/i);
  assert.doesNotMatch(brain, /<script|<foreignObject|\bonload=|xlink:href=/i);
});
