import assert from "node:assert/strict";
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

test("server-renders the complete BCI signal journey", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Signals in Motion · A BCI Research Journey<\/title>/i);
  assert.match(html, /Signals in Motion/i);
  assert.match(html, /Begin the journey/i);
  assert.match(html, /Follow the/i);
  assert.match(html, /Can computers read minds\?/i);
  assert.match(html, /BCIs? do not literally read thoughts|Not quite/i);
  assert.match(html, />87</);
  assert.match(html, />694</);
  assert.match(html, />32</);
  assert.match(html, />512 Hz</);
  assert.match(html, /27 EEG · 3 EOG · 2 EMG/);
  assert.match(html, /Awaiting verified analysis/g);
  assert.match(html, /Zenodo 8089820/);
  assert.match(html, /Scientific Data/);
  assert.match(html, /Research in progress/);
  assert.match(html, /Skip to the brain journey/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("renders every stable journey anchor and accessibility control", async () => {
  const html = await (await render()).text();
  const anchors = [
    "start",
    "approach",
    "bci",
    "background",
    "dataset",
    "method",
    "integrity",
    "pipeline",
    "results",
    "future",
    "return",
  ];

  for (const anchor of anchors) {
    assert.match(html, new RegExp(`id="${anchor}"`));
    assert.match(html, new RegExp(`href="#${anchor}"`));
  }

  assert.match(html, /aria-label="Brain journey stations"/);
  assert.match(html, /Pause cinematic motion/);
  assert.match(html, /Switch to (?:light|dark) theme/);
  assert.match(html, /<details class="technical-note"/);
  assert.match(html, /aria-label="Sources for this section"/);
});

test("keeps unapproved results gated and nonnumeric", async () => {
  const content = await readFile(
    path.join(projectRoot, "lib/research-content.ts"),
    "utf8",
  );
  const resultStart = content.indexOf('id: "results"');
  const resultEnd = content.indexOf('id: "future"');
  const resultBlock = content.slice(resultStart, resultEnd);

  assert.ok(resultStart > 0 && resultEnd > resultStart);
  assert.match(resultBlock, /status: "pending"/);
  assert.match(resultBlock, /Awaiting verified analysis/);
  assert.doesNotMatch(resultBlock, /accuracy|f1|auc|percent|%/i);
  assert.doesNotMatch(resultBlock, /metrics:\s*\[/);
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
