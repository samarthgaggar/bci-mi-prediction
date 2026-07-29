# BCI Website Research Rules

These rules apply to this repository.

## Source hierarchy

1. Public dataset documentation:
   - https://zenodo.org/records/8089820
   - https://www.nature.com/articles/s41597-023-02445-z
2. Reviewed, versioned reports in
   `../26-the-data-miners-analysis/bci_cleaning/results/reports/`
3. Untracked analysis artifacts are working material, not publishable evidence.

## Scientific-data boundary

- Treat `../26-the-data-miners-analysis/BCI Database/` as immutable.
- Never copy raw scientific files, questionnaires, spreadsheets, configuration
  files, or participant-level exports into this repository or `public/`.
- Do not invent metrics, distributions, graphs, people, endorsements, or
  findings.
- Results without an approved, versioned source must remain visibly labeled
  `Awaiting verified analysis`.
- Preserve participant-disjoint validation, leakage controls, and the locked
  evaluation policy in any explanation of the modeling process.

## Required checks

Run `npm run lint`, `npx tsc --noEmit --incremental false`, `npm test`, and a
production dependency audit before release. Do not claim screenshots, console,
network, keyboard, touch, or animation behavior were verified unless they were
observed in a working browser.
