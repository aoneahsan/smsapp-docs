# SMS Mobile App — Documentation (`sms-app-docs`) — Agent Guide

**Last Updated**: 2026-05-29

Mirror of `CLAUDE.md`. Keep both files in sync — update one, update the other.

Public, AEO-first Docusaurus documentation site for **SMS Mobile App** (Android-first SMS automation). The product source is private; this docs repo is **public** for discoverability by search engines, AI crawlers, and humans.

- **Live docs site**: https://smsapp-docs.aoneahsan.com
- **Product / marketing site**: https://smsapp.aoneahsan.com
- **Parent app id (Android)**: `com.aoneahsan.smsapp` (the product — N/A here)
- **Repo**: https://github.com/aoneahsan/smsapp-docs (public, MIT)
- **Maintainer**: Ahsan Mahmood — aoneahsan@gmail.com — https://aoneahsan.com

---

## What this is

- **Framework**: Docusaurus **3.10.1** (classic preset, TypeScript), React **19.2.6**, TypeScript **6.0.3**.
- **Build accelerator**: `@docusaurus/faster` (Rspack/SWC) enabled.
- **Search**: `@easyops-cn/docusaurus-search-local` — free, self-hosted in-browser fuzzy search.
- **Content model**: Diátaxis (Tutorials · How-to · Reference · Explanation) — **42 Markdown pages, ~48k words**.
- **Deploy target**: Firebase Hosting.
- **Package manager**: yarn 4.14.1 (Corepack-pinned). Node ≥ 20.

## AEO / SEO posture (the core value of this repo)

- `robots.txt` with full AI-bot allowlist + scraper denylist.
- Machine-readable files: `llms.txt`, `llms-full.txt`, `ai.txt`, `humans.txt`, `.well-known/security.txt`, IndexNow key + `yarn indexnow` script.
- Site-wide JSON-LD (`WebSite` + `Organization` + `Person`) in `docusaurus.config.ts`.
- Per-page JSON-LD via swizzled `src/theme/DocItem/Layout`: `TechArticle` (all), `HowTo` (`/how-to/*`), `FAQPage` (frontmatter `faq`), `SoftwareApplication` (home). Per-page canonical + OG/Twitter.
- `sitemap.xml` with `lastmod`; Radix-violet theme; dark mode; motion-safe animations.

## Honest framing (must stay accurate in docs)

- Send-only — NOT a default SMS handler. Native silent send Android-only; iOS is web-dashboard. "Free" = no per-message fee (carrier rates apply). Volunteer pool opt-in default-on.

---

## Commands (one-shot only — never run dev/preview/watch servers)

```bash
yarn install
yarn typecheck       # tsc — real local gate (PASSES)
yarn build           # Docusaurus → ./build
yarn indexnow        # IndexNow ping after deploy
```

### KNOWN local-only build quirk (do NOT "fix")
`yarn build` FAILS **locally** with `git submodule status ... exit 128 ... no submodule mapping found in .gitmodules for path 'github-profile'`. Cause: `@docusaurus/faster` (Rspack) + `showLastUpdateTime` runs an eager `git submodule status` walking up to the `01-code` parent (gitlinks, no `.gitmodules`). **Workspace VCS quirk, not a project bug** — CI/standalone unaffected. `yarn typecheck` passes. One build attempt only; don't modify the workspace.

---

## Portfolio Info File — Weekly Update Rule
- Canonical portfolio info file: `/home/ahsan/Documents/ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/SMS-MOBILE-APP-DOCS_portfolio-info_<YYYY-MM-DD>.md`
- Update at least once per week (and on any material change). Keep the last-updated date in the filename.
- Keep a max-10-entry update history inside the file. On each refresh: prepend today's row, delete the previous dated file, write the new one.
- Tracker: `/home/ahsan/Documents/01-code/docs/tracking/portfolio-info-files-update-tracker.json`
- Last applied: 2026-05-29
- Note: distinct from the parent app's file `SMS-MOBILE-APP_portfolio-info_*.md` — do NOT overwrite or delete that one.

## Package Upgrades: Use `npm-check-updates`
For dependency upgrades use `npx -y npm-check-updates -u && yarn install` (latest STABLE), NOT `yarn upgrade --latest`. Full rule in global `~/.claude/CLAUDE.md`. Last applied: 2026-05-29 (deps already at latest stable — no changes).

## Git structure
Standalone git repo (real `.git` dir), branch `main`. **No remote configured** as of 2026-05-29. Add `origin → git@github.com:aoneahsan/smsapp-docs.git` before pushing.

## SEO + AEO + Ranking
Diagnostic + fix playbook: `~/.claude/rules/seo-aeo-ranking.md`. Repo already implements most of §3/§4/§5. Last applied: 2026-05-29.
