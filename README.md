# SMSApp documentation

Public documentation for SMSApp, an owner-operated Android SMS dispatch system. The web admin prepares and monitors jobs; a registered Android phone sends approved messages through its configured SIM.

The Android app `com.aoneahsan.smsapp` version 1.7.0 is live on Google Play as "SMS Mobile App": <https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp>. The web admin prepares and monitors jobs. It supports one selected owner-managed phone per job, synced contacts or CSV input, and up to 5,000 unique eligible Pakistani mobile recipients. It does not provide a public device pool, cloud SMS gateway, desktop app, or npm product. iOS: removed 2026-10-30 — re-add when an Apple Developer account exists.

## Contents

- [Product scope](#product-scope)
- [Documentation sections](#documentation-sections)
- [Local verification](#local-verification)
- [Repository structure](#repository-structure)
- [Deployment](#deployment)
- [License](#license)

<a id="product-scope"></a>
## Product scope&nbsp;[#](#product-scope)

SMSApp accepts ordinary Pakistani mobile destinations in the `030`–`036` ranges. It excludes foreign numbers, landlines, short codes, premium or special-rate services, malformed values, and unrecognized ranges. Creating a draft or importing recipients does not send anything; the owner must review and start dispatch explicitly. Carrier charges and limits still apply.

The Android app is send-only. It requests access to contacts only for an owner-initiated, device-scoped sync and does not read received SMS.

<a id="documentation-sections"></a>
## Documentation sections&nbsp;[#](#documentation-sections)

| Section | Purpose |
|---|---|
| Tutorials | Install, register, sync contacts, and prepare the first batch. |
| How-to guides | Complete one operational task. |
| Reference | Check supported permissions, limits, routes, and data contracts. |
| Explanation | Understand the Android, privacy, architecture, and policy choices. |

<a id="local-verification"></a>
## Local verification&nbsp;[#](#local-verification)

```bash
yarn install --immutable
yarn typecheck
yarn build
```

This repository uses Yarn 4 through Corepack. Do not use the development server as release evidence.

<a id="repository-structure"></a>
## Repository structure&nbsp;[#](#repository-structure)

```text
docs/             Published Docusaurus content
src/pages/        Standalone pages
static/           Logos and crawler-facing files
.github/workflows GitHub Pages deployment
```

The private sibling app repository defines product behavior. Public documentation must follow verified app behavior and release evidence.

<a id="deployment"></a>
## Deployment&nbsp;[#](#deployment)

GitHub Actions builds and deploys this repository to GitHub Pages after a push to `main`. The custom domain is `https://smsapp-docs.aoneahsan.com`. A successful local build does not prove that DNS, GitHub Pages, or the published artifact is current.

<a id="license"></a>
## License&nbsp;[#](#license)

Documentation source and content are licensed under the [MIT License](./LICENSE). The SMSApp application source is private.
