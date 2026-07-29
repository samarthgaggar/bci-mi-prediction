# BCI Performance Variability Research

A single-page, source-traced research website for the Dreyer motor-imagery BCI
dataset. Its layout follows the supplied Framer reference while all copy is
adapted to the BCI project.

The current phase deliberately uses CSS placeholders instead of images or
videos. Existing public media remains preserved and unreferenced. Local,
unversioned modeling outputs are not presented as public results.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Validate

```bash
npx tsc --noEmit --incremental false
npm run lint
npm run build
npm test
```

The tests check the one-page route contract, retired route responses, anchored
content order, research-status language, approved sources, absence of copied
reference media, preservation of the public-media library, and the raw-data
boundary.

## Structure

```text
app/             # homepage, metadata, not-found route, and design system
components/      # the interactive single-page experience
lib/             # typed, source-bound research content
public/          # preserved web media, intentionally unused in this phase
tests/           # rendered HTML, content, and data-boundary checks
```

## Publication boundary

Update `lib/site-content.ts` only when a reviewed source artifact supports the
new claim. The locally generated Stage 1–9 analysis files are not public website
evidence until they are reviewed and versioned.

## Data boundary

`../26-the-data-miners-analysis/BCI Database/` is immutable. Never edit it or
copy GDF recordings, questionnaires, workbooks, processed participant files,
or other raw scientific material into this site.
