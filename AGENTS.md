# Repository Guidelines

## Purpose and Source of Truth

This folder contains a research-paper-style website for the Dreyer motor-imagery BCI dataset. Treat `../26-the-data-miners-analysis/BCI Database/` as immutable source data; never edit it or copy its 34 GB signal corpus into this site.

Use sources in this order:

1. `bci_cleaning/results/reports/documentation_summary.md` for documented study design.
2. `bci_cleaning/results/reports/post_clean_summary.md` and validation reports for cleaned-data claims.
3. Versioned analysis notebooks and exported figures for EDA and results.
4. The Zenodo record and cited Scientific Data paper for attribution.

Verified baseline facts include 87 anonymized participants (`A1-A60`, `B61-B81`, `C82-C87`), 694 GDF recordings, and 32 physiological channels sampled at 512 Hz (27 EEG, 3 EOG, 2 EMG). Do not present a statistic unless a source artifact supports it.

## Project Structure

Use the implemented paper-oriented layout:

```text
app/             # routes, metadata, and global design system
components/      # research sections and shadcn-style UI primitives
lib/             # typed content, status records, and shared utilities
public/          # approved web-only assets
tests/           # rendering, content, link, and data-boundary tests
outputs/         # local visual-QA screenshots
```

Keep generated charts reproducible from analysis code. Store only web-ready exports here, never raw GDF, questionnaire, workbook, or processed participant files.

## Research Content Rules

Separate the original study protocol from the team’s cleaning and analysis. Include methodology, dataset description, cleaning, EDA, results, discussion, limitations, data availability, and references. Preserve documented exceptions—such as A1 trigger differences, missing A59 runs, Dataset B questionnaire losses, and C83 missing assets—rather than silently correcting them.

## Development and Style

After choosing a framework, expose consistent scripts: `npm run dev`, `npm run build`, `npm test`, and `npm run lint`. Document any replacement commands in the root README. Use semantic HTML, reusable components, two-space indentation for web files, and kebab-case asset names such as `participant-performance.svg`. Provide alt text, keyboard navigation, responsive layouts, and WCAG AA contrast.

## Testing and Review

Before merging, run the full build, tests, linter, link checker, and accessibility checks. Verify every displayed count against the cited report and inspect key pages at mobile and desktop widths.

Use short, imperative commits such as `Add methodology overview`. Pull requests must summarize research claims, list source artifacts, report validation commands, and include screenshots for visual changes.
