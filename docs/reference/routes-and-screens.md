---
title: Routes & screens reference
description: Every URL on the SMS Mobile App web dashboard with its purpose, who it is for, the layout it uses, and whether it requires authentication or admin role.
sidebar_position: 2
sidebar_label: Routes & screens
slug: routes-and-screens
keywords: [sms mobile app routes, smsapp screens, smsapp url map, admin dashboard routes]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Routes & screens

The web dashboard at [smsapp.aoneahsan.com](https://smsapp.aoneahsan.com) is a single-page React 19 application served as static HTML with per-route prerendered shells for SEO. This page is the URL map: every route, its purpose, whether it requires sign-in, whether it requires admin role, and the layout it inherits.

Routes fall into four families: **public** (anyone with the URL), **protected** (must be signed in via Google), **admin** (admin email + Google sign-in), and **redirects** (alternate aliases that 301 to a canonical path).

## Public routes

These routes render the same content for signed-out visitors and signed-in users. They use `AppLayout` — the standard top-nav + footer chrome — and do not switch to the dashboard chrome even when the user is authenticated.

| Path | Screen | Purpose |
|---|---|---|
| `/` | HomePage | Marketing landing. Hero, feature blocks, pricing teaser, FAQ, footer. Mounts the public theme switcher and the install-app prompt for Android visitors. |
| `/login` | LoginPage | Google OAuth entry point. Signing in here lands the user on `/dashboard` unless the URL carries a `?redirect=` query param. |
| `/sitemap` | SitemapPage | Card-based sitemap with fuzzy search across every public page. Top of the page links to `/sitemap.xml` and `/feed.xml` with explanations. |
| `/apps` | AppsPage | Lists the Android app + browser companion + roadmap items. Public so search engines can index download links. |
| `/about` | AboutPage | Mission, team, contact info. Visible developer attribution to Ahsan Mahmood with portfolio + LinkedIn. |
| `/contact` | ContactPage | Contact form. Submissions land in `sms_contact_submissions`; admin replies via email. |
| `/privacy` | PrivacyPage | Privacy policy. Mirrors Data Safety form. `privacy-policy` is an alias. |
| `/terms` | TermsPage | Terms of service. `trems` is an alias (typo redirect). |
| `/account-deletion` | AccountDeletionPage | Plain-English how-to-delete-your-account walkthrough. `data-deletion` is an alias. Required by Play Store policy. |
| `/cookies` | CookiesPage | Cookie/storage policy. `cookie-policy` is an alias. |
| `/pricing` | PricingPage | Free tier + fair-use boundaries. `pricing-page` is an alias. |
| `/fair-use` | FairUsePage | Fair-use thresholds (per-account daily volume, 10-device cap explainer). `fair-use-policy` and `fair-usage-policy` are aliases. |
| `/blog` | BlogListPage | Lists published posts. Posts live in `sms_blog_posts` collection. |
| `/blog/:slug` | BlogPostPage | Individual blog post by slug. JSON-LD Article schema, FAQ block where applicable. |
| `/blog/category/:category` | BlogCategoryPage | Posts filtered by category. |
| `/blog/tag/:tag` | BlogTagPage | Posts filtered by tag. |
| `/feed` | FeedPage | HTML view of the RSS feed. The RSS XML lives at `/feed.xml`. |
| `/drafts` | DraftsPage | Draft list. The screen is mounted but in-page logic gates non-trivial functionality behind sign-in. |
| `/send-message` | SendMessagePage | The unified composer (Phase 4). Public so guests can use the 10-SMS pre-login allowance. After sign-in the same screen lifts the cap and exposes saved templates. |

## Protected routes (`ProtectedRoute`)

These require an authenticated Google session. Visiting them while signed out redirects to `/login?redirect=<intended-path>`.

| Path | Screen | Purpose |
|---|---|---|
| `/dashboard` | DashboardPage | Authenticated home. Shows today's job activity, achievement progress, recent drafts, and shortcuts to compose / batches / settings. |
| `/jobs` | SmsJobsPage | The user's own SMS job queue. Cursor-paginated (first page realtime via `onSnapshot`, subsequent pages via `startAfter`). Filterable by status. |
| `/jobs/new` | SmsJobsPage | Convenience alias that opens the same page with `?compose=1`. The legacy deep-link form some adverts still point to. |
| `/settings` | SettingsPage | Per-user preferences: theme, default SIM, default rate cap, opted-in pool participation, device list, account deletion. |
| `/achievements` | AchievementsPage | Achievement badges + progress. Reads from `sms_user_achievements`. |

## Admin routes (`AdminProtectedRoute` + `AdminLayout`)

These require sign-in AND the email `aoneahsan@gmail.com` (enforced server-side in `firestore.rules`'s `isAdmin()` helper, mirrored client-side as a UX guard). Visiting them as a non-admin user redirects to `/error/403`. They render inside `AdminLayout` (sidebar chrome) instead of `AppLayout`.

| Path | Screen | Purpose |
|---|---|---|
| `/admin` | AdminDashboardPage | Operations overview: active batches, pending jobs, recent errors, fleet health summary. |
| `/admin/users` | AdminUsersPage | User list with tier and admin-only role controls. Read from `sms_users`. |
| `/admin/devices` | AdminDevicesPage | Volunteer device fleet table. Shows health score, last heartbeat, current claim, flag/unflag controls. |
| `/admin/jobs` | AdminJobsPage | Cross-user job inspector. Filters by status / owner / device / batch. Per-row actions: cancel, force-retry, delete. |
| `/admin/config` | AdminConfigPage | Remote-config editor for `sms_config`. Feature toggles, rate cap defaults, fair-use thresholds. |
| `/admin/analytics` | AdminAnalyticsPage | Cross-platform analytics summary (Firebase + Amplitude + Clarity counters) with date-range picker. |
| `/admin/diagnostics` | DiagnosticsPage | Live system check: Firestore reachability, Cloudflare worker status, recent error logs, manifest permission drift. |
| `/admin/advertising` | AdvertisingManagementPage | Advertising panel editor — promotional surfaces shown on public pages. |
| `/admin/blog` | BlogManagementPage | Blog post list with status filters. |
| `/admin/blog/new` | BlogEditorPage | Compose a new post. Markdown body, category + tags, status (draft / published / archived). |
| `/admin/blog/:id/edit` | BlogEditorPage | Edit an existing post. Same component as `new`, in update mode. |
| `/admin/contacts` | ContactSubmissionsPage | Triage incoming contact-form submissions. Filter by status (`pending` / `in_progress` / `resolved` / `closed`). |
| `/admin/batches` | AdminBatchesPage | Batch jobs list. Status (`draft` / `assigning` / `running` / `complete` / `failed`), assigned devices, progress counters. |
| `/admin/batches/import` | AdminBatchImportPage | CSV import + paste-list wizard. Validates phone numbers, dedupes, then commits one `sms_batches` doc with N `recipients` sub-documents. |
| `/admin/batches/:id` | AdminBatchDetailPage | Per-batch detail: live device progress, recipient table with status, manual reassign, salvage workflow, audit log. |

## Error routes

These render explicit error screens instead of letting the catch-all 404 fire. They double as direct landing pages so backend code can `Navigate` to a stable URL when auth or authorization fails.

| Path | Screen | Triggered when |
|---|---|---|
| `/error/401` | UnauthorizedPage | A protected resource was requested without a valid session. |
| `/error/403` | ForbiddenPage | The session is valid but lacks the required role (e.g. non-admin hitting `/admin/*`). |
| `/error/500` | ServerErrorPage | Generic backend or unexpected client error. The error boundary at `AppErrorBoundary` routes here on uncaught render exceptions. |
| `*` | NotFoundPage | Catch-all 404. Suggests the sitemap and the homepage. |

## Redirects (canonical-path aliases)

These do not render a screen — they `Navigate replace` to a canonical route. They exist because external content (other blogs, Play Store listing earlier versions, search-engine indices) still points at the old URLs.

| Alias | Canonical |
|---|---|
| `/privacy-policy` | `/privacy` |
| `/trems` | `/terms` |
| `/data-deletion` | `/account-deletion` |
| `/cookie-policy` | `/cookies` |
| `/pricing-page` | `/pricing` |
| `/fair-use-policy` | `/fair-use` |
| `/fair-usage-policy` | `/fair-use` |

## Layouts

The app has two top-level layouts. Choice of layout is determined by the route group, not by the user's auth state.

- **`AppLayout`** — public chrome: top nav, footer with legal links + sitemap/feed pointers, theme switcher, install-app prompt. Used by every public route plus a small set of authenticated user pages (`/dashboard`, `/jobs`, `/settings`, `/send-message`, `/drafts`, `/achievements`).
- **`AdminLayout`** — admin chrome: collapsible sidebar with admin sections, persistent top bar with current admin email + sign-out, no marketing footer. Used by every `/admin/*` route.

Public pages stay public even when the user is signed in. The dashboard chrome is reserved for admin pages — non-admin signed-in users continue to see public chrome with the addition of a top-bar avatar + sign-out menu.

## URL state contract

Every UI state worth preserving across reload lives in the URL. The shared hooks in `src/lib/hooks/useUrlState.ts` (`useUrlBooleanState`, `useUrlStringState`, `useUrlNullableString`, `useUrlNumberState`) standardise the param names: `compose`, `edit`, `view`, `tab`, `section`, `step`, `page`, `q`, `status`, `range`, `confirmDelete`. Transient state (loading flags, hover states, validation flashes) stays in `useState`. The full rationale lands in the Explanation section (Batch 7); this table is the path list.

## Where the route map lives in code

The single source of truth is `src/App.tsx` (the `<Routes>` block). Lazy-loaded route modules sit under `src/routes/`. Admin variants live in `src/routes/admin/`. Blog variants live in `src/routes/blog/`. Error variants live in `src/routes/errors/`.

When adding a new public route, the checklist is: add the `<Route>` in `App.tsx`, register the page in `src/lib/seo/routes.ts` (so `sitemap.xml` and the postbuild SEO HTML generator pick it up), add an entry to `SitemapPage`, and link it from the footer if it is a top-level destination. Admin routes only need the `<Route>` + the admin sidebar entry.
