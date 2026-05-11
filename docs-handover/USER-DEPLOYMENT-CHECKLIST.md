# User deployment checklist — SMS Mobile App docs site

This file lists the **user-actionable steps** required to take the docs site from local repo to live at `https://smsapp-docs.aoneahsan.com` with indexing across major search engines.

Every step here requires either Google account access, GitHub repo creation, or DNS / Firebase Console access — none of which an automated agent has. Work through the sections in order; each step has a single owner (you) and a clear definition of done.

---

## Section 1 — Create the public GitHub repository

**Owner**: you. **Time**: 5 minutes.

1. Sign into GitHub as `aoneahsan`.
2. Create a new public repository named **`smsapp-docs`** at https://github.com/new.
   - Description: `Public documentation for SMS Mobile App — an Android-first SMS automation app that sends from your phone's SIM card with Firebase-backed scheduling.`
   - Visibility: **Public**.
   - Do **not** initialise with a README, LICENSE, or .gitignore (the local repo already has them).
3. From the local sms-app-docs directory, set the remote and push:

   ```bash
   cd /home/ahsan/Documents/01-code/projects/sms-app-docs
   git remote add origin git@github.com:aoneahsan/smsapp-docs.git
   git branch -M main
   git push -u origin main
   ```

**Done when**: https://github.com/aoneahsan/smsapp-docs renders with the README front and centre.

---

## Section 2 — Create the Firebase project

**Owner**: you. **Time**: 10 minutes.

1. Go to https://console.firebase.google.com and click **Add project**.
2. Project name: **smsapp-docs**. Project ID: `smsapp-docs` (Firebase may suggest a different ID if taken; if so, also update `.firebaserc` and `.github/workflows/deploy.yml` to match).
3. Disable Google Analytics for this project (the docs site uses Microsoft Clarity via main app analytics if needed; this Firebase project is hosting-only).
4. Once created, in the left nav click **Hosting** → **Get started**.
5. Skip the CLI walkthrough (already configured). Click through to the hosting dashboard.

**Done when**: `https://smsapp-docs.web.app` shows the Firebase placeholder page.

---

## Section 3 — Wire GitHub Actions to Firebase

**Owner**: you. **Time**: 10 minutes.

1. In Firebase Console → Project Settings → **Service accounts** → **Generate new private key**. Save the JSON file locally (do **not** commit it).
2. In the GitHub repo → Settings → **Secrets and variables** → Actions → **New repository secret**.
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: paste the entire JSON file contents.
3. Trigger the workflow by pushing any commit to `main`, or open the **Actions** tab and click **Run workflow** on the **Build and deploy** workflow.
4. Watch the workflow log. Three jobs run: `Build` → `Deploy` → `Ping IndexNow`.

**Done when**: https://smsapp-docs.web.app renders the docs site (and not the Firebase placeholder).

---

## Section 4 — Connect the custom domain

**Owner**: you. **Time**: 15 minutes (plus DNS propagation).

1. In Firebase Console → Hosting → **Add custom domain**.
2. Enter `smsapp-docs.aoneahsan.com`.
3. Firebase shows DNS records to add. In the Cloudflare dashboard for `aoneahsan.com`:
   - Add the TXT record Firebase shows (for verification).
   - Add the A records (or CNAME — Firebase typically gives both options) Firebase shows.
   - Disable Cloudflare proxy (orange cloud) on these records — Firebase handles its own CDN.
4. Click **Verify** in Firebase Console. Verification usually takes 5–30 minutes for DNS propagation.
5. Firebase auto-provisions an SSL certificate (Let's Encrypt). This takes up to 24 hours but is usually under an hour.

**Done when**: https://smsapp-docs.aoneahsan.com renders the docs site over HTTPS.

---

## Section 5 — Verify and submit to Google Search Console

**Owner**: you. **Time**: 10 minutes.

1. Go to https://search.google.com/search-console.
2. Click **Add property** → **Domain** → enter `smsapp-docs.aoneahsan.com`.
3. Google shows a TXT record to add to DNS. Add it in Cloudflare. Click **Verify** in Search Console. (Usually instant.)
4. In Search Console → **Sitemaps** → submit `https://smsapp-docs.aoneahsan.com/sitemap.xml`. Status should turn to **Success** within an hour.
5. In **URL Inspection**, test 5–10 of the most important URLs (homepage, /tutorials, /how-to, /reference, /explanation, /about). For each, click **Request indexing**. This is rate-limited (about 10 requests/day) — focus on the top URLs.

**Done when**: Search Console shows the property verified and the sitemap status is **Success**.

**What to expect**: Indexed-page count begins climbing within 3–7 days. Domain-authority signals (mentions, backlinks) determine ranking; see §10 below.

---

## Section 6 — Verify and submit to Bing Webmaster Tools

**Owner**: you. **Time**: 10 minutes.

Bing's index feeds Yahoo, DuckDuckGo, and ChatGPT Search. Worth doing.

1. Go to https://www.bing.com/webmasters.
2. Sign in (Microsoft account). Click **Add a site**.
3. Easiest path: **Import from Google Search Console** (Bing recognises the GSC verification and skips re-verification).
4. Once added, **Sitemaps** → submit `https://smsapp-docs.aoneahsan.com/sitemap.xml`.
5. **URL Submission** → submit the homepage and the four section indexes.

**Done when**: Bing Webmaster shows the property verified and sitemap submitted.

---

## Section 7 — Verify and submit to Yandex Webmaster

**Owner**: you. **Time**: 10 minutes.

Yandex covers the CIS region (Russia, Kazakhstan, Belarus, Uzbekistan). Worth doing if you target any traffic from that region.

1. Go to https://webmaster.yandex.com.
2. Sign in (Yandex account; create one if needed). Click **Add site**.
3. Verify via HTML file upload OR DNS TXT record. The HTML file path Yandex gives is something like `/yandex_<random>.html`. Either:
   - **HTML file**: Place the file at `static/yandex_<random>.html` in the repo, push, deploy. Yandex auto-verifies.
   - **DNS TXT**: Add the TXT record to Cloudflare. Click **Verify**.
4. **Sitemap files** → submit `https://smsapp-docs.aoneahsan.com/sitemap.xml`.

**Done when**: Yandex Webmaster shows the property verified and sitemap submitted.

---

## Section 8 — Verify IndexNow is working

**Owner**: you. **Time**: 5 minutes.

The GitHub Actions workflow already pings IndexNow on every successful deploy (job: `Ping IndexNow`). Confirm:

1. Open the GitHub Actions run log for your latest deploy.
2. Find the `Ping IndexNow` job. The log should show `indexnow status 200` or `indexnow status 202`.
3. (Optional) Visit https://www.bing.com/indexnow-status?siteUrl=smsapp-docs.aoneahsan.com to check submission history.

**Done when**: the workflow log shows a 200 or 202 response from IndexNow.

---

## Section 9 — Cross-check the cross-links from main app

The main SMS Mobile App surfaces already link to the docs site at:

- `https://smsapp.aoneahsan.com/ai.txt` (Companion-Docs-* fields)
- `https://smsapp.aoneahsan.com/llms.txt` (Companion documentation block)
- `https://smsapp.aoneahsan.com/llms-full.txt` (Public documentation site line)

After the docs site is live, redeploy the main app (sms-app) so the public/*.txt files actually serve these references. The cross-links were authored in Batch 8 (sms-app commit `bf1484d`); they ship with the next main-app build.

**Done when**: `curl https://smsapp.aoneahsan.com/ai.txt | grep Companion-Docs-Site` returns the docs URL.

---

## Section 10 — Build domain authority (ongoing)

The docs site is a brand-new domain. Search engines need signals to determine ranking. The fastest path:

1. **Add the docs URL to your portfolio**. https://aoneahsan.com should link to https://smsapp-docs.aoneahsan.com under the SMS Mobile App project entry.
2. **Add the docs URL to your LinkedIn project section**.
3. **Submit to AlternativeTo, G2, Capterra**. The product, not the docs, but each profile can link to the docs.
4. **Write one blog post per quarter on dev.to / Hashnode / Medium** about a specific feature, linking back to the relevant docs page.
5. **Answer Quora / Reddit questions** about SMS automation, linking to the relevant docs page when genuinely helpful. Not spammy.
6. **Submit a Wikipedia entry** on Aoneahsan / Zaions (if notability allows) with a citation to the docs site.

**Goal**: 5–10 referring domains in the first 30 days. The Google sandbox (3–6 months for new domains) is mitigated faster on AI search (ChatGPT, Perplexity, Claude) than on Google itself.

---

## Section 11 — Cadence after launch

| Cadence | Action |
|---|---|
| **Per commit** | GitHub Actions auto-deploys + pings IndexNow |
| **Weekly** | Check Google Search Console Pages report — indexed count should climb |
| **Monthly** | Manual query check across ChatGPT, Perplexity, Google AI Overviews for top 10 queries; record citations |
| **Quarterly** | Update `lastUpdated` on stale pages; refresh `sitemap.xml` and `feed.xml` if material changes; refresh portfolio backlinks |
| **Every 7 days from `lastFullCompletion`** | Re-run the full docs-build plan if material project changes have shipped (see `sms-app/docs/docs-site-build/00-tracker.json` for resume guard) |

---

## Section 12 — Rollback procedure

If a deploy breaks the live site:

1. In Firebase Console → Hosting → **Release history**.
2. Find the previous green release.
3. Click **⋯** → **Rollback to this version**. Effective in under a minute.
4. Investigate the failing commit; push a fix.

The `release history` retains the last 100 releases. Workflow artifacts retain the last 7 days of builds (configurable in `.github/workflows/deploy.yml`).

---

## Section 13 — Maintenance contacts

- **Hosting + DNS**: Ahsan Mahmood (aoneahsan@gmail.com).
- **Firebase project owner**: Ahsan Mahmood (Google account: aoneahsan@gmail.com).
- **GitHub repo owner**: github.com/aoneahsan.
- **Security disclosures**: aoneahsan@gmail.com or `.well-known/security.txt`.

If something breaks and the maintainer is unreachable, the runbook is in this file plus the README in the repo's root.

---

## What's done vs what's user-actionable

This batch (Batch 10) ships everything an automated agent can:
- `firebase.json` — Hosting config (public, redirects, headers, cache rules)
- `.firebaserc` — project alias mapping
- `.github/workflows/deploy.yml` — Build + Deploy + IndexNow ping
- This checklist file

User-actionable (above) — anything that requires Google account access, GitHub repo creation, Firebase Console access, or DNS access. About 1 hour total of user time across Sections 1–7.
