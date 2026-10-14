# SMSApp documentation context

**Last updated:** 2026-09-15

This public Docusaurus repository documents the private sibling SMSApp product. It does not define product behavior: verified app source, release evidence, and `../sms-app/docs/PROJECT-CONTEXT.md` are authoritative.

## Publishing architecture

- Docusaurus builds a static site into `build/`.
- `.github/workflows/deploy-pages.yml` deploys `main` to GitHub Pages.
- `static/CNAME` and external DNS provide the canonical custom domain.
- Search is local/in-browser; the site does not require an external search service.
- Canonical metadata, structured data, sitemap output, robots directives, and AI-discovery files must describe the same visible release behavior.

## Current product reference

SMSApp is an owner-operated Android SMS dispatcher with a web admin. A registered phone syncs device-scoped contacts and sends explicitly reviewed jobs through its own SIM. The initial release accepts ordinary Pakistani mobile destinations only, supports contacts or bounded CSV input, uses one default/configured SIM, never reads received SMS, and does not expose a public volunteer-device pool.

The current executable application ID is `com.aoneahsan.smsapp`. The first distribution target is an owner-provided sideload APK; Google Play publication is not confirmed. Each job selects one phone, accepts at most 5,000 unique eligible recipients, and limits CSV input to 5 MiB.

Do not publish this description as a release claim until the app tracker records the corresponding implementation and device evidence. The public docs should distinguish available, beta, planned, unsupported, and historical behavior.

## Required synchronization points

When the app release changes, check package id, version, distribution path, URLs, permissions, recipient limits, recipient-policy wording, contact-sync behavior, job states, background limitations, screenshots, privacy/data retention, troubleshooting, legal pages, structured data, sitemap/canonical values, Open Graph assets, and machine-readable discovery files.

Never copy credentials, real contact information, recipient/message data, private screenshots, or private implementation findings into this repository.
