# Manual / User-Only Tasks — Sms App Docs

> The ONE place for everything only you (the human) can do. Fixed path: `docs/MANUAL-TASKS.md`.
> Global spec: `~/.claude/rules/manual-tasks.md`. Excluded from the published site (see
> `docusaurus.config.ts` → `docs.exclude`) because this repo is public.
> Last updated: 2026-09-15

## ⏳ Pending manual tasks

| # | Task | Why only you | Status |
|---|------|--------------|--------|
| 1 | **Verify DNS.** Confirm the `smsapp-docs` CNAME still targets `aoneahsan.github.io` and the canonical site resolves over HTTPS. | Only you control the `aoneahsan.com` DNS zone. | ☐ Evidence pending |
| 2 | **Verify GitHub Pages.** Confirm source = **GitHub Actions**, custom domain = `smsapp-docs.aoneahsan.com`, and **Enforce HTTPS** is enabled. | Repo settings are owner-only. | ☐ Evidence pending |
| 3 | **Approve corrected public content before publishing.** Review the removal of volunteer-pool, Play-available, dual-SIM, international-recipient, and guaranteed-background claims. | Publishing approval belongs to the owner. | ☐ Approval pending |

`static/CNAME` ships `smsapp-docs.aoneahsan.com` inside `build/`, and `.github/workflows/deploy-pages.yml` builds and publishes on every push to `main`. Do not run IndexNow until the corrected site is deployed and its sitemap is live.

## ✅ Completed manual tasks

| # | Task | Resolution | Date |
|---|------|-----------|------|
| — | — | — | — |
