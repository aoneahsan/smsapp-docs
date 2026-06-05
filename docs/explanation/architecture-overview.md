---
title: Architecture overview
description: The end-to-end stack — Capacitor + Vite front end, Firebase data plane, the custom NativeSms Android plugin, and Cloudflare Workers in place of paid Functions.
sidebar_position: 6
sidebar_label: Architecture overview
slug: architecture-overview
keywords: [sms mobile app architecture, capacitor firebase sms, react vite android plugin, cloudflare workers free backend]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Architecture overview

The app is a React 19 single-page application packaged with Capacitor 8 for Android, sitting on Firebase for data, with a small in-tree Android plugin for the native SMS-send path and Cloudflare Workers for the handful of server-side tasks that genuinely need a backend. This page describes the architecture from the user-facing front end down to the data plane, explaining why each piece is where it is.

## The front end

The dashboard at `smsapp.aoneahsan.com` is **a Vite-built React 19 SPA**. It is bundled into static assets (HTML + JS + CSS + per-route prerendered HTML shells for SEO) and served from Firebase Hosting. The same bundle is wrapped by Capacitor 8 and shipped to the Play Store as the Android app — there is one codebase, one bundle, one source of truth.

The choice of React 19 lets us use the concurrent rendering primitives (`useTransition`, `useDeferredValue`) on the high-traffic batch-progress views, where the live `onSnapshot` updates would otherwise jank during heavy renders. The choice of Vite is for build speed (cold builds under 30 seconds, HMR under 100 milliseconds) and for the per-route postbuild SEO HTML generator we attached to the build pipeline.

Styling is **Radix UI primitives + Tailwind CSS 4 utility classes**. Radix provides the accessible composable building blocks; Tailwind handles layout, spacing, and theming tokens. We do not use raw `<div>` + custom CSS for interactive elements. The result is that keyboard navigation, screen-reader semantics, and ARIA attributes are correct without per-component effort.

State management is **Zustand for global client state, TanStack Query for server state**. Zustand owns short-lived UI state (current composer draft, opened modals tracked via URL, theme overrides). TanStack Query owns Firestore reads and any async result that benefits from caching, refetch coordination, and optimistic updates. The query-key factory at `src/lib/queryClient/queryKeys.ts` is the single source of truth for all query keys; inline `queryKey` arrays are banned and lint-enforced.

Forms are **`react-hook-form` + `zod` + `@hookform/resolvers`**. Every form field has a custom wrapper component in `src/components/form-fields/` so the form-state plumbing is consistent across the app. The wrappers expose a `BaseFieldProps` contract; every `useForm({...})` site uses `mode: 'onBlur'`. The composer, the admin batch import, the settings page, and the contact form all go through the same pipeline.

Routing is **react-router-dom v6**. Routes are lazy-loaded for bundle-size budget (the main entry chunk is under 250 KB gzip). URL state is the source of truth for every cross-refresh-persistent UI state (modals, tabs, filters, multi-step forms) via the shared hooks in `src/lib/hooks/useUrlState.ts`. The full URL contract is documented in [Routes & screens](/reference/routes-and-screens).

## The Android wrapper

Capacitor 8 wraps the same bundle into an Android app with a thin native shell. The shell consists of `MainActivity.java` (the WebView host), a small set of standard Capacitor plugins (`@capacitor/preferences`, `@capacitor/haptics`, `@capacitor/local-notifications`, etc.), and **one in-tree custom plugin** at `src/plugins/native-sms/` that exposes the silent-send path.

The custom plugin has three Java classes:

- `NativeSmsPlugin.java` — the Capacitor bridge: receives `sendText({to, message})` calls from JavaScript, invokes `SmsManager.sendTextMessage(...)`, registers a `PendingIntent` to broadcast the result, and translates the broadcast back into a Capacitor `PluginCall.resolve()` or `.reject()`.
- `SmsAutomationService.java` — the foreground service: hosts the runner loop, pulls claims, calls into the plugin's send method, writes results back to Firestore via the Firestore REST API.
- `BootReceiver.java` — re-registers WorkManager schedules after a device reboot so recurring jobs survive the restart.

Why a custom plugin instead of an off-the-shelf one? Because the off-the-shelf `@byteowls/capacitor-sms` (which we still ship for UI-prompted send) is built around the system-composer intent. There is no community plugin that wraps the foreground-service + `SmsManager` + claim-cycle combination the way we need it. So we wrote one. The full mechanics are in [How silent SMS works](/explanation/how-silent-sms-works).

## The data plane: Firebase

The data plane is **Firebase Firestore + Firebase Authentication**. Both are free-tier products and both scale into the millions-of-reads-per-month band before they cost anything.

Firestore holds every persistent record — the full `sms_*` collection list is in [Firestore data model](/reference/firestore-data-model). Security is enforced by `firestore.rules` (700+ lines). The security-rule logic is documented end-to-end in [Security rules](/reference/security-rules).

Firebase Authentication is locked to **Google OAuth only**. The `isGoogleAuth()` rule helper rejects anonymous, email/password, phone, and any other provider that may slip through. The decision to ban email/password specifically is a fraud-cost decision: free-tier products with email/password sign-up attract bot signups at an industrial scale, and the cost of mitigating them (CAPTCHA, email verification flows, account-isolation rules) outweighs the user-onboarding benefit. Google OAuth gives us a high-quality identity signal with near-zero engineering cost.

We deliberately do not use:

- **Firebase Cloud Functions** — paid Blaze plan; we use Cloudflare Workers instead.
- **Firebase Storage** — file uploads route to FilesHub.
- **Firebase Cloud Messaging** — push notifications use OneSignal's free tier.
- **Firebase Performance Monitoring + Crashlytics** — banned per workspace-wide rule (they require unwanted Gradle plugins and produce noisy runtime errors).
- **Firebase Analytics web SDK** — optional. Configured only if `VITE_FIREBASE_MEASUREMENT_ID` is set.

What we use from Firebase is exactly the set that fits inside the free tier reliably, and no more.

## Cloudflare Workers: the "small backend"

Some tasks genuinely need a server. We have two so far, both deployed as Cloudflare Workers on the free tier:

- **Token proxying.** When the app needs to call a third-party API (e.g. the Google Search Console API for the sitemap-status admin view), the API key cannot ship in the client bundle. The worker holds the secret, validates the calling user's Firebase ID token, and proxies the request.
- **IndexNow ping.** On every production deploy, a CI step pings IndexNow with the changed URL list to push them to Bing / Yandex faster than waiting for the crawl.

Both workers are namespaced with the project prefix `SMSAPP_` per the workspace-wide secret-naming rule (single CF account shared across projects). CORS is locked to `smsapp.aoneahsan.com` and the docs domain. The Worker code lives under `workers/` in the main repo; the deploy workflow is `wrangler deploy` on push to `main`.

The choice of Cloudflare Workers over Firebase Functions is purely cost-driven. Both could solve the same problem. Workers have a generous free tier (100k requests/day) and bill in cents-per-million beyond that; Functions require enabling the Firebase Blaze plan, which is pay-as-you-go from request 1.

## The build pipeline

`yarn build` runs three stages: TypeScript typecheck, Vite production build, and the postbuild SEO HTML generator. The generator walks the route list from `src/lib/seo/routes.ts` and emits one prerendered HTML shell per route under `dist/<route>/index.html`. Firebase Hosting serves the shell first, the SPA hydrates, and the user gets the same experience either way — but AI crawlers (GPTBot, ClaudeBot, PerplexityBot) that do not execute JavaScript see real content instead of a `Loading…` placeholder.

`npx cap sync android` syncs the build into the Android shell. `cd android && ./gradlew assembleRelease` produces the signed APK / AAB. The keystore is a stored secret, never committed.

CI runs typecheck + lint on every push, and gates the deploy on both. The deploy step uses GitHub Actions with Firebase Hosting + the IndexNow worker as targets. No deploy happens on a red CI.

## The docs site (this site) as a separate concern

The site you are reading is a **separate Docusaurus 3 project** at `/home/ahsan/Documents/01-code/projects/sms-app-docs/`. It deploys to its own Firebase Hosting site under `smsapp-docs.aoneahsan.com`. Splitting it from the main app means the docs can be public on GitHub even though the app source stays private, and the docs deploy pipeline does not block on the main app's release cadence.

The split is also a clean separation of concerns: the docs site has no Firebase data plane, no authentication, no analytics PII pipeline. It is plain static content with SEO instrumentation.

## What the architecture buys us

The architecture is unflashy on purpose. There is no microservices fleet, no Kubernetes, no event-streaming bus, no GraphQL layer, no service mesh. There is one front-end app, one in-tree Android plugin, one Firestore database, two small Cloudflare workers, and a static docs site. Every part is independently understandable in under an hour.

The simplicity buys us three things. First, the entire stack fits in free tiers — Firebase Firestore reads at our current scale cost nothing, Cloudflare Workers requests cost nothing, Firebase Hosting bandwidth at our current scale costs nothing. Second, a single developer can hold the architecture in their head, which is what makes iteration speed possible. Third, the failure modes are local — a Cloudflare Worker outage breaks one auxiliary path, not the product; a Firestore index miss breaks one query, not the app.

The stack is the floor, not the ceiling. As the product grows the same components scale into their paid tiers; we add a worker when a new server-side task appears; we add a Firestore collection when a new feature needs one. There is no need for a rewrite or migration as long as the floor remains adequate.

## Reading further

The per-piece deep dives are scattered across the rest of this site. [How silent SMS works](/explanation/how-silent-sms-works) covers the in-tree plugin. [Volunteer device pool](/explanation/volunteer-device-pool) explains the matchmaker on top of Firestore. [Privacy and data handling](/explanation/privacy-and-data-handling) maps the data plane to the privacy posture. The reference quadrant ([Routes & screens](/reference/routes-and-screens), [Firestore data model](/reference/firestore-data-model), [Services & events](/reference/services-and-events), [Configuration & env](/reference/configuration-and-env), [Quotas & limits](/reference/quotas-and-limits), [Security rules](/reference/security-rules)) is the exhaustive description of every component listed above.
