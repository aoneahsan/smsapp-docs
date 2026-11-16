# Packages — SMSApp docs

**Last Updated:** 2026-11-16

Node 26.13.1 LTS (`.nvmrc`, `engines.node >=26.13.1`), Yarn 4.18.1 (`packageManager`), `npmMinimalAgeGate: 0`.
Upgraded with `npx -y npm-check-updates -u`, latest stable. This file is excluded from the published site
(`docusaurus.config.ts` → docs `exclude`).

| Package | Range | Kind | Purpose |
|---|---|---|---|
| `@docusaurus/core`, `faster`, `plugin-content-docs`, `preset-classic`, `theme-common` | 3.10.2 | runtime | The site generator, Rspack build, docs and theme |
| `@easyops-cn/docusaurus-search-local` | ^0.55.3 | runtime | Offline search, no third-party service |
| `@mdx-js/react` | ^3.1.1 | runtime | MDX rendering |
| `clsx` | ^2.1.1 | runtime | Class names in the custom components |
| `prism-react-renderer` | ^2.4.1 | runtime | Code highlighting |
| `react` / `react-dom` | ^19.3.1 | runtime | The UI runtime |
| `@docusaurus/module-type-aliases`, `types` | 3.10.2 | dev | Types for `yarn typecheck` |
| `@types/react` / `@types/react-dom` | ^19.3.0 | dev | React types |
| `typescript` | ~7.0.2 | dev | `yarn typecheck`. The site runs no `typescript-eslint` and no Capacitor CLI, the two tools that hold the rest of the fleet on 6.0 |

## Workarounds

- `build` runs with `NODE_OPTIONS=--no-experimental-webstorage`: Docusaurus' SSG touches Node 26's disabled
  `localStorage` and prints an ExperimentalWarning. Upstream has no option; re-check on each Docusaurus minor and
  remove the flag when a build without it prints nothing.

## History

- 2026-11-16 — Node 26.13.1 LTS pass: `.nvmrc` created at 26.13.1, `engines.node` `>=20.0` → `>=26.13.1`. Every
  package was already on its latest stable (`npm-check-updates` reported nothing to move).
