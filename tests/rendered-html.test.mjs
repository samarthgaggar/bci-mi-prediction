import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteTitle = "BCI Performance Variability · The Data Miners";
const sectionIds = [
  "overview",
  "dataset",
  "pipeline",
  "integrity",
  "project-areas",
  "evidence",
  "faq",
];

const expectedMediaHashes = new Map([
  [
    "images/hero-backdrops/brain-interface-patel.jpg",
    "b6b46524b9b1cca81e08d26379354d8f56aba17d2f3d58fb1293572f40c8a918",
  ],
  [
    "images/hero-backdrops/digital-brain-deepmind.jpg",
    "0404b69abce5730fe0bca9ba7a10b13cf36c443388f8c612433eb25c9709c6cc",
  ],
  [
    "images/hero-backdrops/neural-connections-virus.jpg",
    "f235f3f05cacbbe8dd087e8a83e781bb86bc626f59cecfc16584e1ed09a9dd71",
  ],
  [
    "images/research-portals/bci-research-background.jpg",
    "80f3d2ecc8138e3de9f891ad5848370d5b61e4141fdda90e5b6d0c613b7f6dce",
  ],
  [
    "images/research-portals/brain-signal-results-portal.jpg",
    "e53ce422175f3c654512b9f34a938d8ec517237114ba5a1d0de17bfc3aa78a0f",
  ],
  [
    "images/research-portals/eeg-methodology-portal.jpg",
    "c1ccc400be67cf5f7f6365706158640ee7034611bee5251126ebd3319f181720",
  ],
  [
    "og.png",
    "6f28757aebf0065ca353a8ebc4a1ae38bb11e4627b522c53907e4b7a3ea23df9",
  ],
]);

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

async function htmlFor(pathname, expectedStatus = 200) {
  const response = await render(pathname);
  assert.equal(
    response.status,
    expectedStatus,
    `${pathname} should return ${expectedStatus}`,
  );
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

async function sha256(filePath) {
  const { createHash } = await import("node:crypto");
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

test("renders the homepage and retires the former research routes", async () => {
  const home = await htmlFor("/");
  assert.match(home, new RegExp(`<title>${siteTitle}</title>`));
  await htmlFor("/methodology", 404);
  await htmlFor("/results", 404);
});

test("renders the seven anchored sections in reference order", async () => {
  const home = await htmlFor("/");
  let previousIndex = -1;

  for (const id of sectionIds) {
    const marker = `id="${id}"`;
    const index = home.indexOf(marker);
    assert.ok(index > previousIndex, `${id} must follow the prior section`);
    previousIndex = index;
  }

  assert.match(home, /Building BCI systems that work for/);
  assert.match(home, /Explore the study/);
  assert.match(home, /View the pipeline/);
});

test("uses typed, source-bound content and keeps results gated", async () => {
  const source = await readFile(
    new URL("../lib/site-content.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /export interface SiteSection/);
  assert.match(source, /status:\s*ResearchStatus/);
  assert.match(source, /sourceRefs:\s*SourceId\[\]/);
  assert.match(source, /publication-gated/);
  assert.match(source, /under review until they are versioned/i);

  for (const verifiedFact of ["87", "694", "32", "512"]) {
    assert.match(source, new RegExp(`\\b${verifiedFact}\\b`));
  }

  assert.doesNotMatch(
    source,
    /60\.20|62\.61|56\.25|47\.81|8\.44|locked-test comparison/i,
  );
});

test("does not copy stale studio content or reference media", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const sourceFiles = (
    await Promise.all(
      ["app", "components", "lib"].map((directory) =>
        listFiles(path.join(root, directory)),
      ),
    )
  ).flat();
  const source = (
    await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))
  ).join("\n");

  assert.doesNotMatch(source, /MVN Studio|We don'?t make apps/i);
  assert.doesNotMatch(
    source,
    /framerusercontent|abundant-group-865399|\.mp4\b|<img\b|next\/image/i,
  );
  assert.doesNotMatch(source, /\/images\/|\/og\.png/);
  assert.match(source, /Visual reserved/);
  assert.match(source, /Subscriptions are not connected/);
});

test("preserves the existing media library byte-for-byte", async () => {
  const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
  const files = await listFiles(publicPath);
  const relativeFiles = files
    .map((file) => path.relative(publicPath, file).split(path.sep).join("/"))
    .sort();

  assert.deepEqual(relativeFiles, [...expectedMediaHashes.keys()].sort());

  for (const [relativePath, expectedHash] of expectedMediaHashes) {
    assert.equal(
      await sha256(path.join(publicPath, relativePath)),
      expectedHash,
      `${relativePath} must remain byte-identical`,
    );
  }
});

test("keeps raw scientific formats outside the public tree", async () => {
  const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
  const files = await listFiles(publicPath);
  const scientificFilePattern =
    /\.(?:gdf|edf|bdf|set|fdt|mat|csv|tsv|xlsx?|xml|vhdr|vmrk|eeg)$/i;

  assert.equal(
    files.some((file) => scientificFilePattern.test(file)),
    false,
  );
});

test("exposes honest and accessible interaction states", async () => {
  const home = await htmlFor("/");
  const interactionSource = await readFile(
    new URL("../components/site-experience.tsx", import.meta.url),
    "utf8",
  );

  assert.match(home, /aria-controls="mobile-menu"/);
  assert.match(home, /aria-label="Pause decorative motion"/);
  assert.match(home, /aria-label="Research pipeline stages"/);
  assert.match(home, /aria-label="Documented dataset exceptions"/);
  assert.match(home, /aria-expanded="false"/);
  assert.match(home, /disabled=""/);
  assert.match(home, /No address is collected or transmitted/);
  assert.match(interactionSource, /event\.key === "Escape"/);
  assert.match(interactionSource, /event\.key !== "Tab"/);
  assert.match(interactionSource, /prefers-reduced-motion: reduce/);
});

test("omits an obsolete social image while imagery is out of scope", async () => {
  const home = await htmlFor("/");

  assert.doesNotMatch(home, /property="og:image"/i);
  assert.doesNotMatch(home, /name="twitter:image"/i);
  assert.match(home, /name="twitter:card" content="summary"/i);
});

test("locks the reference geometry, palette, and responsive boundaries", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /--container:\s*1100px/);
  assert.match(css, /--accent:\s*#ff4d00/);
  assert.match(css, /--paper:\s*#f5f5f5/);
  assert.match(css, /--surface:\s*#131415/);
  assert.match(css, /@media \(max-width:\s*1199\.98px\)/);
  assert.match(css, /@media \(max-width:\s*809\.98px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});
