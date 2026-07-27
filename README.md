# BCI Performance Variability Research

A local, design-first research interface for **Quantifying and Forecasting Performance Variability in Motor Imagery Brain-Computer Interfaces**.

The site presents documented dataset structure, the original study protocol, the current cleaning plan, and honest placeholders for analysis that has not happened yet. It does not publish findings or copy research data.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Validate

```bash
npm run lint
npm run build
npm test
```

The test suite checks all routes, research-status language, internal navigation, removal of starter content, and the absence of raw scientific files from public assets.

## Structure

```text
app/             # routes, metadata, and global design system
components/      # research sections and reusable UI primitives
lib/             # typed research content and shared utilities
public/          # approved web-only assets
tests/           # rendered HTML and data-boundary checks
outputs/         # local visual-QA screenshots
```

## Design references

- **21st.dev:** editorial navigation and minimal-footer composition.
- **Skiper UI:** Side Scroll Navigation, Scroll Progress, and restrained link motion.
- **Cult UI:** Feature Sticky Section and Direction Aware Tabs.
- **Watermelon UI:** Journal Navigation, Step Indicator, Navigation 5, and Footer 2.

No code or visual patterns were drawn from other component catalogs.

## Replacing placeholders

Update `lib/research-content.ts` only when a versioned research artifact supports the new claim. Change a status to `verified` only after the relevant analysis and caveats are documented. Result components should not be redesigned when real evidence arrives; replace the centralized placeholder record with an evidence-backed data contract.

## Data boundary

`../26-the-data-miners-analysis/BCI Database/` is immutable. Never edit it or copy GDF recordings, questionnaires, workbooks, processed participant files, or other raw scientific material into this site.
