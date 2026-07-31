# Motor Imagery BCI Research Website

An evidence-first explanation of a CSP–MLP motor-imagery
brain–computer-interface study. The site separates the 68.73% participant-level
all-participant mean balanced accuracy from the 68.25% held-out test accuracy,
then provides the complete metric ledger behind those results.

## Research boundary

The website may publish only reviewed, source-backed facts. The immutable BCI
corpus remains in the separate analysis repository and must never be copied
into `public/`. Model results link to the commit-pinned CSP, performance, and
comparison notebooks; unversioned modeling artifacts remain unpublished.

Primary public sources:

- [Zenodo dataset record](https://zenodo.org/records/8089820)
- [Scientific Data descriptor](https://www.nature.com/articles/s41597-023-02445-z)

## Visual asset

The proportional pink brain in `public/brain-anatomy.svg` is the CC0-licensed
Wikimedia Commons file
[Brain-diagram-pink-6289600.svg](https://commons.wikimedia.org/wiki/File:Brain-diagram-pink-6289600.svg).
Its SHA-256 digest is
`b6884cae09fdb505b0b37b741850ee95f8b4144956f41c8282c25fe499dd1806`.
The branching neuron field and signal pulses are original code-based
illustrations and are not diagnostic models.

## Development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
npm run lint
npm run build
npm test
```

The project uses vinext, React, TypeScript, React Three Fiber, and the OpenAI
Sites deployment contract.
