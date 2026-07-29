# Motor Imagery BCI Research Website

An evidence-first explanation of motor-imagery brain–computer-interface
research. The site presents the project objective, dataset, acquisition
protocol, data-integrity process, modeling pipeline, limitations, and current
publication status through an interactive brain visualization.

## Research boundary

The website may publish only reviewed, source-backed facts. The immutable BCI
corpus remains in the separate analysis repository and must never be copied
into `public/`. Unversioned modeling artifacts remain represented by explicit
“Awaiting verified analysis” states.

Primary public sources:

- [Zenodo dataset record](https://zenodo.org/records/8089820)
- [Scientific Data descriptor](https://www.nature.com/articles/s41597-023-02445-z)

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
