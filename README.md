# SMS Mobile App — Documentation

Public, comprehensive product documentation for [SMS Mobile App](https://smsapp.aoneahsan.com), an Android-first SMS automation app that sends user-authored text messages from your phone's own SIM card with Firebase-backed scheduling.

🌐 **Live site:** https://smsapp-docs.aoneahsan.com  
📦 **Product site:** https://smsapp.aoneahsan.com  
👤 **Maintainer:** [Ahsan Mahmood](https://aoneahsan.com)

## Why this repo exists

The source code for SMS Mobile App is private. This documentation repo is **public** so search engines, AI crawlers (ChatGPT, Perplexity, Claude, Gemini, Copilot), and human readers can find the product, learn what it does, and link to it.

If these docs help you, the kindest thing you can do is link to them — backlinks are how a small project becomes findable.

## What's documented

Following the [Diátaxis framework](https://diataxis.fr/):

| Section | Content |
|---|---|
| **Tutorials** | End-to-end walkthroughs from sign-in to first batch send. |
| **How-to guides** | Recipes for specific tasks: sign in, register a device, send a silent batch SMS, manage the volunteer pool. |
| **Reference** | Routes, Android permissions, Firestore collections, env vars, quotas, security rules. |
| **Explanation** | Why Android-only, how silent SMS works, how the volunteer device pool works, Play Store compliance. |

## Stack

- [Docusaurus](https://docusaurus.io/) v3 (classic preset, TypeScript)
- React 19
- Deployed to Firebase Hosting

## Local development

```bash
yarn install
yarn start          # local dev server (port 3000 by default)
yarn build          # one-shot static build → ./build
yarn typecheck      # TS check
```

## Project structure

```
docs/
├── intro.md                ← landing
├── tutorials/              ← learning-oriented
├── how-to/                 ← problem-oriented (recipes)
│   ├── auth-and-devices/
│   ├── sending-sms/
│   └── admin/
├── reference/              ← information-oriented (lookup)
└── explanation/            ← understanding-oriented (rationale)

static/
├── robots.txt              ← AI bot allowlist + scraper denylist
├── llms.txt                ← LLM site map
├── ai.txt                  ← AI training/citation policy
├── humans.txt              ← maintainer info (EEAT signal)
└── .well-known/security.txt
```

## License

Documentation content and source: [MIT](./LICENSE) © Ahsan Mahmood.

The product itself ("SMS Mobile App") is closed-source — only this docs repo is public.

## About the developer

Built and maintained by **Ahsan Mahmood** — senior software engineer specialising in cross-platform mobile and web (React, Capacitor, Firebase).

- Portfolio: https://aoneahsan.com
- LinkedIn: https://linkedin.com/in/aoneahsan
- GitHub: https://github.com/aoneahsan
- NPM: https://npmjs.com/~aoneahsan
- Email: aoneahsan@gmail.com
- Phone / WhatsApp: +923046619706

If you'd like to hire Ahsan or collaborate, the portfolio page has the fastest path.

## Contributing

Issues and PRs are welcome — please open an issue first to discuss substantial changes. Typo fixes and small clarifications can go straight to a PR.

For product feedback (the app itself), use the [contact form on the main site](https://smsapp.aoneahsan.com/contact). This repo is for the docs only.
