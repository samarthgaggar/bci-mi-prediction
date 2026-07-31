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

test("server-renders the eleven-stop visual data-science pipeline", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Can Computers Read Minds\? · Motor Imagery BCI<\/title>/i,
  );
  assert.match(html, /Can computers <span>read minds\?<\/span>/i);
  assert.match(html, /EEG does not read thoughts\./i);
  assert.match(
    html,
    /We tested whether machine-learning models can recognize those patterns consistently across different people\./i,
  );
  assert.match(html, /The model uses EEG patterns, not private thoughts\./i);
  assert.match(html, /See how we tested it/i);
  for (const heading of [
    /Problem Formulation/i,
    /Data Acquisition/i,
    /Preprocessing \/ Data Cleaning/i,
    /Exploratory Data Analysis/i,
    /Extra Trees Profile Analysis/i,
    />Modeling</i,
    /Inference (?:&amp;|&) Prediction/i,
    />Evaluation</i,
    />Validation</i,
    /Report the Results/i,
    /Model and Performance Comparison/i,
  ]) {
    assert.match(html, heading);
  }
  assert.ok(html.indexOf('id="prediction"') < html.indexOf('id="modeling"'));
  assert.ok(html.indexOf('id="eda"') < html.indexOf('id="extra-trees"'));
  assert.ok(html.indexOf('id="extra-trees"') < html.indexOf('id="prediction"'));

  assert.match(html, /Motor imagery EEG research\./);
  assert.match(
    html,
    /How can we improve the prediction of imagined motor movements while achieving consistent performance across participants with diverse demographic, psychological, and behavioral profiles\?/,
  );
  assert.match(html, /The model predicts left-hand or right-hand motor imagery/);
  assert.match(html, /results vary from one person to another/);
  assert.match(html, /Limits included in the report/);
  assert.doesNotMatch(
    html,
    /Signals in Motion|Admit one curious mind|Ride again|Explore the project|Complete results ledger|verified figures|Deployment \/ Presentation|Ready to present/i,
  );
  assert.doesNotMatch(
    html,
    /Can EEG distinguish imagined left-hand movement from imagined right-hand movement\?/,
  );
});

test("renders exactly eleven stable anchors with compact controls", async () => {
  const html = await (await render()).text();
  const anchors = [
    "problem",
    "acquisition",
    "cleaning",
    "eda",
    "extra-trees",
    "modeling",
    "prediction",
    "evaluation",
    "validation",
    "communication",
    "comparison",
  ];

  for (const anchor of anchors) {
    assert.match(html, new RegExp(`id="${anchor}"`));
    assert.match(html, new RegExp(`href="#${anchor}"`));
  }

  assert.match(html, /id="intro"/);
  assert.match(html, /href="#intro"/);
  assert.match(html, /href="#problem"/);

  for (const retired of [
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
    "approach",
    "presentation",
  ]) {
    assert.doesNotMatch(html, new RegExp(`id="${retired}"`));
  }

  assert.match(html, /Skip to the pipeline/);
  assert.match(html, /aria-label="Data science pipeline"/);
  assert.match(html, />Auto <b>Off<\/b>/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /Motion <b>On<\/b>/);
  assert.doesNotMatch(html, /<details\b|role="dialog"/);
});

test("keeps the landing page unnumbered and visually separate from the pipeline", async () => {
  const [page, css, content] = await Promise.all([
    readFile(path.join(projectRoot, "components/research-page.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/globals.css"), "utf8"),
    readFile(path.join(projectRoot, "lib/research-content.ts"), "utf8"),
  ]);

  assert.match(page, /<IntroSection active=\{introActive\} \/>/);
  assert.match(page, /function IntroSection/);
  assert.match(page, /useState\("intro"\)/);
  assert.match(page, /\["intro", \.\.\.pipelineSteps\.map/);
  assert.match(css, /\.intro-section\s*\{[\s\S]*?min-height:\s*100svh/);
  assert.match(css, /\.intro-layout\s*\{[\s\S]*?width:\s*min\(1280px,\s*100%\)/);
  assert.match(css, /\.intro-copy h1\s*\{[\s\S]*?font-size:\s*clamp\(68px,\s*7\.2vw,\s*112px\)/);
  assert.match(css, /\.intro-facts\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.doesNotMatch(content, /id: "intro"|number: "00"/);
});

test("publishes only verified, clearly labeled research metrics", async () => {
  const html = await (await render()).text();

  for (const value of [
    "87",
    "694",
    "512 Hz",
    "32",
    "73",
    "4",
    "12",
    "15.825",
    "16.031",
    "-0.071",
    "10.036",
    "61.92%",
    "64.83%",
    "69.10%",
    "66.42%",
    "73.09%",
    "68.25%",
    "68.30%",
    "68.46%",
    "−1.75 pp",
    "2,655",
    "17,219",
    "79",
    "68.73%",
    "63.74%",
    "13.75 vs 15.80",
    "5 vs 15",
    "18 / 27",
  ]) {
    assert.match(html, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(html, /balanced accuracy/i);
  assert.match(html, /final test accuracy/i);
  assert.match(html, /research goal/i);
  assert.match(html, /not a clinical tool/i);
  assert.match(html, /12 unseen participants/i);
  assert.doesNotMatch(html, /60\.20%|62\.61%|5,280/);
});

test("provides graph switchers across exploration, modeling, prediction, evaluation, and validation", async () => {
  const html = await (await render()).text();
  for (const label of [
    "Participant spread",
    "Run means",
    "Learning style",
    "Model scores",
    "MLP training",
    "MLP architecture",
    "Final scores",
    "Final summary",
    "Split design",
    "Who improved?",
    "Histograms",
    "Bottom 27 overlap",
  ]) {
    assert.match(html, new RegExp(label));
  }

  assert.match(html, /Choose a figure/);
  assert.match(html, /Development balanced accuracy/);
  assert.match(html, /Scale: 50 to 70% balanced accuracy/);
  assert.match(html, /Open full-size chart: Performance varies widely/);
  assert.match(html, /12 CSP features/);
  assert.match(html, /Participant split/);
  assert.match(html, /Inconclusive/);
  assert.match(html, /Profile-feature rankings are exploratory/);
  assert.match(html, /Highest exploratory features/);
  assert.match(html, /PRE_Motivation/);
  assert.match(html, /PRE_Stim_normal/);
  assert.match(html, /Level of study/);
});

test("uses plain report language without em dashes", async () => {
  const [html, page, content, layout] = await Promise.all([
    render().then((response) => response.text()),
    readFile(path.join(projectRoot, "components/research-page.tsx"), "utf8"),
    readFile(path.join(projectRoot, "lib/research-content.ts"), "utf8"),
    readFile(path.join(projectRoot, "app/layout.tsx"), "utf8"),
  ]);
  const writtenCopy = `${page}\n${content}\n${layout}`;

  assert.doesNotMatch(writtenCopy, /\u2014|\u2013/);
  assert.doesNotMatch(html, /\u2014|\u2013/);
  assert.match(html, /We cleaned participant performance data and EEG recordings in separate, reproducible pipelines\./);
  assert.match(html, /Perfomances_cleaned\.csv/);
  assert.match(html, /Performance CSV/);
  assert.match(html, /EEG GDF files/);
  assert.match(
    html,
    /The output is a left or right label\. It does not read a person(?:&#x27;|')s thoughts\./,
  );
  assert.match(html, /This is a research result\. It is not a clinical tool\./);
});

test("restores the brain journey without restoring the old scroll tunnel", async () => {
  const [page, brainScene, css, content] = await Promise.all([
    readFile(path.join(projectRoot, "components/research-page.tsx"), "utf8"),
    readFile(path.join(projectRoot, "components/brain-scene.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/globals.css"), "utf8"),
    readFile(path.join(projectRoot, "lib/research-content.ts"), "utf8"),
  ]);

  assert.match(css, /\.pipeline-section\s*\{[\s\S]*?min-height:\s*max\(660px,\s*calc\(92svh - var\(--header-height\)\)\)/);
  assert.doesNotMatch(css, /[2-9]\d{2}vh|350vh|650vh/);
  assert.match(page, /lazy\(\(\) => import\("\.\/brain-scene"\)\)/);
  assert.match(page, /<BrainScene[\s\S]*?progress=\{journeyProgress\}/);
  assert.match(page, /const journeyProgress = motionEnabled/);
  assert.match(page, /const enterZoom = smooth\(journeyProgress \/ 0\.15\)/);
  assert.match(page, /const exitZoom = smooth\(\(journeyProgress - 0\.88\) \/ 0\.12\)/);
  assert.match(brainScene, /const cameraFrames/);
  assert.match(brainScene, /function InteriorWorld/);
  assert.match(brainScene, /function CameraSequence/);
  assert.match(brainScene, /branching neuron networks/);
  assert.equal((content.match(/\n\s+number: "\d{2}"/g) ?? []).length, 11);
  assert.doesNotMatch(content, /id: "presentation"|Deployment \/ Presentation/);
});

test("keeps every visual and the final result within bounded responsive compositions", async () => {
  const [page, css] = await Promise.all([
    readFile(path.join(projectRoot, "components/research-page.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/globals.css"), "utf8"),
  ]);

  assert.match(page, /has-\$\{step\.visual\}/);
  assert.match(page, /className="communication-visual"/);
  assert.match(page, /className="result-context"/);
  assert.match(page, /aria-label="Choose a cleaning pipeline"/);
  assert.match(page, /role="tabpanel"/);
  assert.match(page, /EMG-informed trial rule/);
  assert.match(page, /className="extra-trees-visual"/);
  assert.match(css, /\.extra-trees-warning\s*\{/);
  assert.match(css, /\.extra-trees-visual\s*\{[\s\S]*?color:\s*var\(--ink\)/);
  assert.match(css, /\.extra-trees-features\s*\{/);
  assert.match(css, /\.pipeline-layout\s*\{[\s\S]*?width:\s*min\(1280px,\s*100%\)[\s\S]*?grid-template-columns:\s*minmax\(320px,\s*0\.82fr\)\s*minmax\(560px,\s*1\.18fr\)/);
  assert.match(css, /\.metric-strip\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.metric-strip:has\(> div:nth-child\(4\)\)\s*\{[\s\S]*?repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.communication-visual\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /\.final-score\s*\{[\s\S]*?grid-template:[\s\S]*?"label score"[\s\S]*?"meta score"/);
  assert.match(css, /\.final-score > strong\s*\{[\s\S]*?font-size:\s*clamp\(66px,\s*7vw,\s*104px\)/);
  assert.match(css, /min-height:\s*clamp\(520px,\s*62vh,\s*640px\)/);
  assert.match(css, /\.figure-stage img\s*\{[\s\S]*?height:\s*clamp\(330px,\s*43vh,\s*450px\)/);
  assert.match(page, /className="prediction-tree"/);
  assert.match(page, /className="network-connections"/);
  assert.match(
    css,
    /\.prediction-flow\s*\{[\s\S]*?width:\s*min\(100%,\s*900px\)/,
  );
  assert.match(
    css,
    /\.prediction-tree\s*\{[\s\S]*?width:\s*100%/,
  );
  assert.match(
    css,
    /\.network-connections line\s*\{[\s\S]*?stroke-opacity:\s*0\.17/,
  );
  assert.match(css, /white-space:\s*nowrap/);
  assert.match(css, /overflow:\s*hidden/);
  assert.doesNotMatch(page, /presentation-visual|presentation-status|Ready to present/);
  assert.doesNotMatch(css, /grid-template-columns:\s*minmax\(0,\s*0\.9fr\)\s*minmax\(260px,\s*1\.1fr\)/);
});

test("implements reversible looping auto scroll and reduced motion", async () => {
  const [page, css] = await Promise.all([
    readFile(path.join(projectRoot, "components/research-page.tsx"), "utf8"),
    readFile(path.join(projectRoot, "app/globals.css"), "utf8"),
  ]);

  assert.match(page, /setAutoScrollEnabled\(\(value\) => !value\)/);
  assert.match(page, /window\.requestAnimationFrame\(advance\)/);
  assert.match(page, /window\.scrollBy/);
  assert.match(page, /window\.scrollTo\(0, 0\)/);
  assert.match(page, /window\.cancelAnimationFrame/);
  assert.match(page, /const pixelsPerSecond = motionEnabled \? 82 : 44/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:root\[data-motion="reduced"\]/);
});

test("ships the seven selected research figures with byte checks", async () => {
  const expected = new Map([
    ["results/performance-by-run.png", ["0f0a3ed5147cab642f663772955301810856966d4cf3e0fba0613dc1a53b0263", 1484, 889]],
    ["results/mean-performance-by-run.png", ["fcf9c874422abe217aca316b57f488e42b8170172cd2bcc7b488cdd77a656a7d", 1333, 884]],
    ["results/learning-style-correlations.png", ["3085a313459e51a46b38bf8e80c362f636e1fe724051024c7919874e94c4782a", 2683, 1330]],
    ["results/model/stage-6/training_curves.png", ["3636d7c4f0fa9a576e6cbf99b27e6921ce884f28e50b9a4e897a487f32b3e79b", 1600, 900]],
    ["results/model/stage-9/final_locked_summary.png", ["6af381a13bdf756027412878c1917b2e72f8fd87aeda52ef7de9857850d9739f", 1600, 900]],
    ["results/model/stage-9/participant_run_difference.png", ["546664e6afcf891f371a2f9da71d471cc4b731a84a458d4a4c895979effac953", 1000, 1200]],
    ["results/model/stage-9/bottom_27_overlap.png", ["929261c05fb90b565043fdbf0dd4c40fd05c6ed9aa347ac05992c0ddd40bcff7", 1600, 1000]],
  ]);

  for (const [name, [digest, width, height]] of expected) {
    const image = await readFile(path.join(projectRoot, "public", name));
    assert.equal(image.toString("ascii", 1, 4), "PNG");
    assert.equal(image.readUInt32BE(16), width);
    assert.equal(image.readUInt32BE(20), height);
    assert.equal(createHash("sha256").update(image).digest("hex"), digest);
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

test("keeps the site one-page and retires accidental subroutes", async () => {
  for (const route of ["/results", "/methodology", "/api/results"]) {
    const response = await render(route);
    assert.equal(response.status, 404);
  }
});

test("meets core light and dark theme contrast requirements", () => {
  const pairs = [
    ["f5f8ff", "07101f"],
    ["c5d1e5", "07101f"],
    ["8799b8", "07101f"],
    ["10213b", "f4f7fb"],
    ["3f5675", "f4f7fb"],
    ["526a87", "f4f7fb"],
    ["187653", "f4f7fb"],
    ["8d6212", "f4f7fb"],
  ];

  for (const [foreground, background] of pairs) {
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `${foreground} on ${background} must meet WCAG AA`,
    );
  }
});

test("ships correctly sized local social and brain assets", async () => {
  const ogPath = path.join(projectRoot, "public/og.png");
  const fallbackPath = path.join(projectRoot, "public/brain-fallback.png");
  const brainPath = path.join(projectRoot, "public/brain-anatomy.svg");
  const [image, details, fallback, fallbackDetails, brain] = await Promise.all([
    readFile(ogPath),
    stat(ogPath),
    readFile(fallbackPath),
    stat(fallbackPath),
    readFile(brainPath, "utf8"),
  ]);

  assert.equal(image.toString("ascii", 1, 4), "PNG");
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.ok(details.size < 2_500_000);
  assert.equal(fallback.toString("ascii", 1, 4), "PNG");
  assert.equal(fallback.readUInt32BE(16), 700);
  assert.equal(fallback.readUInt32BE(20), 700);
  assert.ok(fallbackDetails.size < 2_000_000);
  assert.match(brain, /viewBox="0 0 1200 1200"/);
  assert.match(brain, /#d78282/i);
  assert.doesNotMatch(brain, /<script|<foreignObject|\bonload=|xlink:href=/i);
});
