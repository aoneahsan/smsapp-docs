# SMS Mobile App — Documentation (`sms-app-docs`)

**Last Updated**: 2026-05-29

Public, AEO-first Docusaurus documentation site for **SMS Mobile App** (the Android-first SMS automation product). The product source is private; this docs repo is **public** so search engines, AI crawlers, and humans can find, learn, and link to the product.

- **Live docs site**: https://smsapp-docs.aoneahsan.com
- **Product / marketing site**: https://smsapp.aoneahsan.com
- **Parent app id (Android)**: `com.aoneahsan.smsapp` (the product — N/A here; this repo ships no app)
- **Repo**: https://github.com/aoneahsan/smsapp-docs (public, MIT)
- **Maintainer**: Ahsan Mahmood — aoneahsan@gmail.com — https://aoneahsan.com

---

## What this is

- **Framework**: Docusaurus **3.10.1** (classic preset, TypeScript), React **19.2.6**, TypeScript **6.0.3**.
- **Build accelerator**: `@docusaurus/faster` (Rspack/SWC) enabled.
- **Search**: `@easyops-cn/docusaurus-search-local` — free, self-hosted, in-browser fuzzy search (no Algolia signup).
- **Content model**: Diátaxis (Tutorials · How-to · Reference · Explanation) — **42 Markdown pages, ~48k words**.
- **Deploy target**: Firebase Hosting (`firebase.json`, `.firebaserc`).
- **Package manager**: yarn 4.14.1 (Corepack-pinned). Node ≥ 20.

## AEO / SEO posture (the core value of this repo)

- `robots.txt` with full AI-bot allowlist (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Applebot, Googlebot, Bingbot, …) + scraper denylist.
- Machine-readable files: `llms.txt`, `llms-full.txt`, `ai.txt`, `humans.txt`, `.well-known/security.txt`, IndexNow key file + `yarn indexnow` ping script.
- Site-wide JSON-LD graph (`WebSite` + `Organization` + `Person`) in `docusaurus.config.ts`.
- Per-page JSON-LD via swizzled `src/theme/DocItem/Layout`: `TechArticle` on every page, `HowTo` on `/how-to/*`, `FAQPage` when frontmatter `faq` present, `SoftwareApplication` on the homepage. Per-page canonical + OG/Twitter overrides.
- `sitemap.xml` (weekly changefreq, `lastmod` dates), brand-aligned Radix-violet theme, dark mode, motion-safe reveal animations, `prefers-reduced-motion` respected.

## Honest framing (must stay accurate in docs)

- SMS Mobile App is **send-only** — NOT a default SMS handler (cannot read inbox / reply inline).
- Native silent send is **Android-only**; iOS is a web-dashboard experience.
- "Free" = no per-message fee from us; **carrier SMS rates still apply**.
- Volunteer device pool is **opt-in default-on**.

---

## Commands (one-shot only — never run dev/preview/watch servers)

```bash
yarn install         # reconcile deps
yarn typecheck       # tsc — the real local gate (PASSES)
yarn build           # Docusaurus static build → ./build
yarn indexnow        # ping IndexNow with sitemap URLs (after deploy)
```

### KNOWN local-only build quirk (do NOT "fix")
`yarn build` FAILS **locally** with `git submodule status ... exit 128 ... no submodule mapping found in .gitmodules for path 'github-profile'`. Cause: `@docusaurus/faster` (Rspack) + `showLastUpdateTime` runs an **eager** `git submodule status` that walks up to the `01-code` parent, which has gitlinks but no `.gitmodules`. This is a **workspace VCS quirk, not a project bug** — CI / standalone clones are unaffected. `yarn typecheck` passes. Do not modify the workspace or the project to work around it; one build attempt only.

---

## Portfolio Info File — Weekly Update Rule
- Canonical portfolio info file: `/home/ahsan/Documents/ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/SMS-MOBILE-APP-DOCS_portfolio-info_<YYYY-MM-DD>.md`
- Update at least once per week (and on any material change). Keep the last-updated date in the filename.
- Keep a max-10-entry update history inside the file. On each refresh: prepend today's row, delete the previous dated file, write the new one.
- Tracker: `/home/ahsan/Documents/01-code/docs/tracking/portfolio-info-files-update-tracker.json`
- Last applied: 2026-05-29
- Note: distinct from the parent app's file `SMS-MOBILE-APP_portfolio-info_*.md` — do NOT overwrite or delete that one.

## Package Manager Hierarchy: nvm → npm (global) → yarn (local) (IRON-SOLID)

Three tiers, each tool ONLY for its tier — for the best, most reproducible dev results:
- **`nvm`** → install/update Node.js (which bundles `npm`): `nvm install --lts`. Use nvm to get/update `npm` itself.
- **`npm`** → ALL global packages: `npm install -g yarn` (install yarn globally if missing) + `npm install -g <pkg>` (every other global CLI).
- **`yarn`** → ALL local project work: `yarn`, `yarn add <pkg>`, `yarn add -D <pkg>` inside the project.

❌ NEVER use `npm`/`pnpm` for LOCAL installs. NEVER use `pnpm` at all. ✅ Only `yarn.lock` in the project — delete `package-lock.json` and `pnpm-lock.yaml`.

## Package Upgrades: Use `npm-check-updates`
For dependency upgrades use `npx -y npm-check-updates -u && yarn install` (latest STABLE), NOT `yarn upgrade --latest`. Full rule in global `~/.claude/CLAUDE.md`. Last applied: 2026-05-29 (deps already at latest stable — no changes).

## Git structure
Standalone git repo (real `.git` dir), branch `main`. **No remote configured** as of 2026-05-29 — `git remote -v` is empty. Add `origin → git@github.com:aoneahsan/smsapp-docs.git` before pushing.

## SEO + AEO + Ranking
Diagnostic + fix playbook: `~/.claude/rules/seo-aeo-ranking.md`. This repo already implements most of §3/§4/§5 (AI-bot allowlist, machine-readable files, per-page JSON-LD, prerendered static HTML via Docusaurus SSG). Last applied: 2026-05-29.

## Share Feature — Web + Mobile Contract (IRON-SOLID)

All user-facing "share" actions follow the global contract: **web** (any browser, incl. mobile web) opens an in-app `WebShareModal` — a social grid (X, Facebook, LinkedIn, WhatsApp, Telegram, Reddit, Email web-intents) + a copy-link button; **native** (Capacitor) uses the OS share sheet via `@capacitor/share`. The web-vs-native split is decided at button-click via `Capacitor.isNativePlatform()`. ❌ Never use `navigator.share` as the primary web path with a silent clipboard fallback. **Full spec: `~/.claude/rules/share-feature.md`.**
