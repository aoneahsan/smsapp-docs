# SMSApp documentation — project guidance

**Last updated:** 2026-09-15
**Scope:** this public documentation repository only. Fleet-wide rules are inherited; do not copy them here.

## Start here

1. Read the sibling app's [`../sms-app/docs/features/production-readiness/00-tracker.json`](../sms-app/docs/features/production-readiness/00-tracker.json) before documenting release status or behavior.
2. Read [`../sms-app/docs/PROJECT-CONTEXT.md`](../sms-app/docs/PROJECT-CONTEXT.md) for the verified product architecture and durable decisions.
3. Inspect the relevant implementation or app documentation before changing factual public claims.
4. Read [`docs/MANUAL-TASKS.md`](docs/MANUAL-TASKS.md) before deployment, DNS, analytics, or indexing work.

| Context budget last verified | 2026-09-15 — CLAUDE.md 7,279 B; no PENDING-TASKS.md; re-check due 2026-09-25 |
|---|---|

## Repository identity

This is the public Docusaurus documentation site for SMSApp. It explains installation, owner setup, the web admin, device registration, contact sync, eligible-recipient policy, SMS jobs, Android operation, privacy, troubleshooting, and release behavior. It ships no Android or web application code.

| Item | Value |
|---|---|
| Framework | Docusaurus 3.10.1, React 19, TypeScript ~6.0.3 |
| Build accelerator | `@docusaurus/faster` |
| Search | `@easyops-cn/docusaurus-search-local` |
| Package manager | Yarn 4.17.1 via Corepack |
| Node requirement | `>=20.0` |
| Deployment | GitHub Pages via `.github/workflows/deploy-pages.yml` |
| Canonical site | `https://smsapp-docs.aoneahsan.com` |
| Public repository | `https://github.com/aoneahsan/smsapp-docs` |
| Product source | private sibling repository `../sms-app` |
| Android package | `com.aoneahsan.smsapp` (current executable identity; `com.zaions.smsapp` is not shipped) |

## Product truth this site must preserve

- SMSApp is an owner-operated Android SMS dispatch system with a web administration panel.
- A registered Android phone supplies contacts and sends outbound SMS through its SIM. Firebase coordinates authenticated devices, jobs, recipients, and results.
- The first production release accepts ordinary Pakistani mobile destinations only. The product rejects foreign numbers, landlines, short codes, premium/special-rate services, malformed values, and ambiguous inputs.
- Importing contacts or CSV data and creating a draft do not send. The owner reviews the eligible list and starts dispatch explicitly.
- Received SMS content is never read or uploaded. The product is not a default SMS handler.
- Carrier charges and limits still apply. Do not describe sending as free SMS; only the software may be free.
- Address-book presence does not prove consent. Documentation must tell operators to send only where they have a lawful, appropriate basis and recipient permission.
- The initial release may require the owner to enable the Android sender deliberately. Do not claim unattended/background reliability until real-device testing proves it.
- One default SIM is the initial release target. Do not promise dual-SIM selection before it ships.
- Each job uses one selected phone and supports at most 5,000 unique eligible recipients from that phone's completed contact sync or a CSV up to 5 MiB.
- Google Play availability is not confirmed. The current distribution target is an owner-provided sideload APK.
- Do not describe or market a volunteer/public device pool. Historical planning content about that model is not current product truth.

## Documentation architecture

The site follows Diátaxis: tutorials teach a complete learning path, how-to guides solve operational tasks, reference pages specify exact behavior, and explanation pages cover concepts and tradeoffs. Keep one clear purpose per page and maintain the sidebar when adding, moving, or removing content.

SEO/AEO infrastructure includes canonical metadata, Open Graph/Twitter metadata, sitemap generation, structured data, local search, `robots.txt`, `llms.txt`, `llms-full.txt`, `ai.txt`, `humans.txt`, and a security contact file. Structured data must match visible page content. Do not refresh dates or claim freshness without a substantive review.

## Commands

```bash
yarn install --immutable
yarn typecheck
yarn build
```

Do not start Docusaurus dev/preview/watch servers. `yarn indexnow` is a post-deployment external action; run it only when the canonical site has actually changed and the sitemap is live.

The historic local-build note about a parent-workspace submodule error is not a permanent exemption. Try one clean production build. If the current environment still reproduces the external workspace failure, record the exact command and error; do not modify unrelated parent Git metadata to hide it.

## Editing rules

- This repository is public. Never add secrets, private contacts, recipient numbers, message bodies, credentials, private screenshots, or private source excerpts.
- Treat the sibling app and its verified release evidence as the source of truth. Aspirational plan text is not shipped behavior.
- Update installation, permissions, privacy, troubleshooting, screenshots, limits, links, structured data, machine-readable discovery files, and release/version references together when the related behavior changes.
- Remove stale volunteer-pool/default-opt-in narratives from current documentation. Historical records may remain clearly labeled as superseded history, but they must not drive navigation, metadata, or user instructions.
- Use renderer-safe Markdown/MDX, stable heading anchors, descriptive links, and accessible images with accurate alt text.
- Keep user-facing terminology consistent: device, source device, contact sync, eligible recipient, excluded recipient, SMS job, dispatch, pause, resume, and uncertain outcome.
- Do not claim message delivery when only the Android sent callback is known.
- Keep `CLAUDE.md` and `AGENTS.md` byte-identical.
- Do not manually edit generated `build/` output.

## Verification

Before publishing:

- Typecheck and build pass from an immutable install.
- Internal and external links resolve; package id, URLs, permissions, limits, and version match the app.
- Sitemap/canonical/robots and structured data refer to the canonical domain and visible content.
- No page describes received-message access, a cloud SMS gateway, a volunteer pool, default opt-in, guaranteed delivery, or unsupported platforms/features as current behavior.
- Mobile layout, navigation, search, dark mode, reduced motion, and key task pages receive a manual review.
- The production-readiness tracker records the docs commit and deployment evidence.

## Git and deployment

This is a standalone repository on `main` with `origin` configured. GitHub Actions deploys the built `build/` artifact to GitHub Pages. Do not add Firebase Hosting configuration to this docs repository. DNS/custom-domain and GitHub Pages settings are owner-controlled external configuration and must be verified, not inferred.

## Links

- Canonical documentation: <https://smsapp-docs.aoneahsan.com>
- Documentation repository: <https://github.com/aoneahsan/smsapp-docs>
- Web app: <https://smsappai.web.app>
- Android distribution: owner-provided sideload APK; no public Play listing is confirmed
