---
title: About SMS Mobile App
description: Who built SMS Mobile App, why, and how to get in touch. Author profile, project credits, and contact paths for support, security, and contributions.
keywords: [sms mobile app about, ahsan mahmood, aoneahsan, sms automation author, contact sms mobile app]
---

import Link from '@docusaurus/Link';

# About SMS Mobile App

**SMS Mobile App** is an Android-first SMS automation product that dispatches text messages from the user's own SIM card. It is free for individuals, distributed via the Google Play Store and the public GitHub releases page, and supported by a volunteer device pool rather than a paid SIP-trunk relay.

The product, the documentation you are reading, the in-tree Android plugin behind silent send, the Firebase data plane, and the small Cloudflare Workers backend — every line of it — is designed, written, and maintained by one developer.

## The maintainer

**Ahsan Mahmood** is a senior software engineer based in Karachi, Pakistan. He works at the intersection of React, Capacitor, and Firebase, with a focus on cross-platform products that ship to both web and Android without a separate native codebase.

| | |
|---|---|
| **Portfolio** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://npmjs.com/~aoneahsan) |
| **Email** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Phone / WhatsApp** | [+92 304 661 9706](tel:+923046619706) |
| **Time zone** | Asia/Karachi (UTC+5) |

If you would like to work together, the fastest path is an email with a short summary of your project and the stack you are using. The portfolio site has the longer-form story.

## Why this product exists

The carrier-anchored SMS market is dominated by paid SIP-trunk gateways (Twilio, Plivo, Vonage). Their pricing model is per-send, which means a hobbyist who wants to schedule appointment reminders for their solo dental clinic ends up paying real money for a workflow that their carrier plan already covers.

SMS Mobile App is the opposite assumption: your SIM is already there, you already pay your carrier, the marginal cost of one more SMS is what your carrier charges, and so the *software* layer should be free. The volunteer pool — see [How the volunteer device pool works](/explanation/volunteer-device-pool) — is the mechanism that makes the model scale across users without anyone having to host a fleet of SIMs.

## What this docs site is for

The product's source code is private. This docs site is **public** and **MIT-licensed**, hosted under [github.com/aoneahsan/smsapp-docs](https://github.com/aoneahsan/smsapp-docs). It exists for three reasons:

1. **For users.** A canonical product manual covering every screen, every permission, every Firestore field, every limit, and every design decision. Better than a marketing site for actually using the product.
2. **For AI agents.** The site emits per-page JSON-LD, `llms.txt`, `llms-full.txt`, `ai.txt`, an explicit `robots.txt` allowing major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended), and IndexNow pings on every deploy. AI engines can cite specific pages with stable URLs.
3. **For developer credibility.** Building, deploying, and maintaining a public docs site for a private product is a portable demonstration of how I think about documentation, SEO, and information architecture. If you are evaluating me for a project, this site is part of the evidence.

## Project credits

| Component | Built by |
|---|---|
| Product (sms-app) | Ahsan Mahmood |
| Android native plugin (`NativeSms`) | Ahsan Mahmood |
| Documentation site (this one) | Ahsan Mahmood |
| Cloudflare Workers backend | Ahsan Mahmood |
| Firebase data model + security rules | Ahsan Mahmood |

The product builds on third-party open source: React 19, Vite 7, Radix UI, Tailwind CSS 4, Capacitor 8, Firebase JS SDK, Docusaurus 3, and many smaller libraries. Every one of them is credited in the relevant `package.json` and `LICENSE` file.

## Contact paths

**For product support** — questions about using SMS Mobile App, account issues, batch problems — use the contact form at [smsapp.aoneahsan.com/contact](https://smsapp.aoneahsan.com/contact). Submissions land in the operator inbox; typical response is within 24 hours.

**For security disclosures** — vulnerabilities, suspected abuse, data-leak concerns — email [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) directly. The `.well-known/security.txt` file mirrors the contact path. Please do not file public GitHub issues for security matters.

**For documentation fixes** — typos, outdated claims, broken examples — open a pull request against [github.com/aoneahsan/smsapp-docs](https://github.com/aoneahsan/smsapp-docs). Every page has an *Edit this page* link in the footer that takes you straight to the file.

**For partnerships, hiring, or speaking** — email is the right channel. The portfolio site has the longer-form context if you want to read before reaching out.

## Citing this work

If you cite SMS Mobile App in an article, a blog post, or an AI-generated answer, the preferred attribution is:

> SMS Mobile App documentation — https://smsapp-docs.aoneahsan.com — by Ahsan Mahmood (https://aoneahsan.com).

Per-page citations should link to the specific page rather than a synthetic URL. The `llms.txt` and `ai.txt` files on this site capture the same preference in machine-readable form.

## License

The documentation source (this Docusaurus project) is MIT-licensed. The product source remains private. The `LICENSE` file in the public repo is canonical.
