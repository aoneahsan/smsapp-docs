---
title: Configuration & environment variables reference
description: Every environment variable consumed by SMS Mobile App, whether it is required for startup, what feature it enables, and where to obtain or set its value.
sidebar_position: 6
sidebar_label: Configuration & env
slug: configuration-and-env
keywords: [smsapp env vars, vite firebase config, vite_sms_sender_mode, sms mobile app configuration]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Configuration & environment variables

The app is configured exclusively through environment variables. Every Vite-bundled variable is prefixed `VITE_` (Vite's required convention for client-side exposure). Non-prefixed variables are reserved for CLI tools that run server-side and never ship to the browser bundle.

This reference is the complete catalogue. The authoritative source file is `.env.example` at the project root; the typed access layer lives at `src/config/env.ts`. Adding a new variable touches both, plus the TypeScript declaration at `src/vite-env.d.ts`.

## Loading order

1. **Vite reads `.env`, `.env.local`, `.env.<mode>`, `.env.<mode>.local`** in that order, later files overriding earlier ones. `.env.local` is the local-development override and is git-ignored.
2. **`src/config/env.ts`** wraps `import.meta.env` with two helpers: `requireEnv(name)` throws at boot if missing; `optionalEnv(name, default)` returns the value or a typed fallback.
3. **`EnvMissingScreen`** renders before any feature mounts if `getMissingRequiredEnv()` is non-empty. In dev the screen shows every missing key + a `cp .env.example .env.local` snippet; in prod it shows a user-friendly "not fully configured" message and logs the key names (never values) to Sentry.

## Required (`[REQUIRED]`)

Missing any of these aborts boot.

| Variable | Purpose | Where to get it |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web SDK API key. Used to initialise the Firebase app. | Firebase Console → Project settings → General → Your apps → Web app config. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth OAuth callback host. | Same screen — `<project>.firebaseapp.com`. |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier. | Same screen — your project ID. |
| `VITE_FIREBASE_APP_ID` | Firebase web app ID. Identifies this specific app within the project. | Same screen. |

These four are the **only** values that block startup. Every other variable below is optional in the sense that the app boots without it — but the feature it gates is unavailable.

## Optional ([OPTIONAL])

### Firebase optional services

| Variable | Default | Purpose |
|---|---|---|
| `VITE_FIREBASE_STORAGE_BUCKET` | (none) | Passed to Firebase init for completeness. We do **not** use Firebase Storage — all files route to FilesHub. Safe to omit. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | (none) | Firebase Cloud Messaging sender ID. Required only if FCM push is wired up — we currently use OneSignal. |
| `VITE_FIREBASE_MEASUREMENT_ID` | (none) | Firebase Analytics web measurement ID (`G-XXXXXXXXXX`). Enables the Firebase Analytics web SDK. |

### Firebase App Check

| Variable | Default | Purpose |
|---|---|---|
| `VITE_FIREBASE_APPCHECK_SITE_KEY` | (none) | reCAPTCHA v3 site key for App Check. Protects Firestore from abuse from unauthorised origins. **Required for production**. |
| `VITE_FIREBASE_APPCHECK_DEBUG` | `false` | When `true`, register App Check in debug mode and emit the debug token to console. Use for local dev only. |

### Google authentication

| Variable | Default | Purpose |
|---|---|---|
| `VITE_GOOGLE_WEB_CLIENT_ID` | (none) | OAuth web client ID. Used by the Capacitor Google Auth plugin for native sign-in. Falls back to Firebase's default Google provider on web if absent. |

### Analytics

Each platform is independent — configure any combination. The analytics fan-out in `src/lib/analytics/` no-ops on platforms whose keys are missing.

| Variable | Purpose |
|---|---|
| `VITE_AMPLITUDE_API_KEY` | Amplitude project API key. SDK lazy-loaded after first interaction. |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity project ID. Session recording + heatmaps. |
| `VITE_YANDEX_METRICA_COUNTER_ID` | Yandex Metrica counter (numeric). Used for SEO/AEO signal coverage of CIS region search engines. |
| `VITE_YANDEX_METRICA_COUNTER_KEY` | Yandex counter key (defaults to the app's package id). |

### Error tracking

| Variable | Purpose |
|---|---|
| `VITE_SENTRY_DSN` | Sentry project DSN. When set, `src/lib/sentry/` initialises Sentry with PII-scrubbing breadcrumbs. When unset, Sentry no-ops. |

### SMS sending

| Variable | Values | Purpose |
|---|---|---|
| `VITE_SMS_SENDER_MODE` | `mock` (default) / `native` / `native_silent` | Selects the SMS transport. `mock` logs to console without sending — safe default for development. `native` uses `@byteowls/capacitor-sms` (UI-prompted). `native_silent` uses the in-tree `NativeSms` plugin + `SmsManager.sendTextMessage` for silent batch automation. Android-only; iOS / web fall back to `not_supported`. |

**Production guideline.** Set `native_silent` on Play-Store-distributed builds so the automation runner can dispatch without per-message taps. Set `mock` for emulator runs and local debugging.

### FilesHub file storage

| Variable | Default | Purpose |
|---|---|---|
| `VITE_FILES_HUB_API_KEY` | (none) | FilesHub API key. Issued at [fileshub.zaions.com/ai-integration](https://fileshub.zaions.com/ai-integration). Required for any feature that uploads files — currently the admin batch import accepts CSV uploads via FilesHub. |
| `VITE_FILES_HUB_BASE_URL` | `https://fileshub.zaions.com/ai-integration` | Override only if you self-host or use a staging instance. |
| `VITE_FILES_HUB_APP_ID` | (none) | Optional FilesHub app namespace. Useful when one API key services multiple apps. |

### CLI-only (not bundled)

These are read by Node scripts (seed scripts, user-bootstrap, deploy helpers) and never reach the browser.

| Variable | Purpose |
|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin SDK project ID. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the service-account JSON. Defaults to `./service-account.json` in dev. |

## Build-time vs runtime

All `VITE_*` variables are **frozen at build time**. Vite inlines them into the bundle. Changing a value after deploy requires a rebuild + redeploy. The runtime never reads `process.env` for these — only `import.meta.env`.

If you need a runtime-changeable setting, store it in the `sms_config` Firestore collection. The admin dashboard at `/admin/config` exposes the editable subset.

## Setting variables per environment

### Local development

Copy `.env.example` to `.env.local` (git-ignored), fill in the values, restart `yarn dev`.

```bash
cp .env.example .env.local
# edit .env.local
yarn dev
```

### Firebase Hosting (production)

The Firebase Hosting build runs in GitHub Actions. Values are stored as GitHub Actions secrets and exposed to the build step via the workflow's `env:` block. Never commit `.env`.

### Android (production)

The Android app is built via `npx cap sync android` after a `yarn build`. The same `VITE_*` values that produced the web bundle are inlined into the Android `www/` payload. No additional Android-side config is needed for env vars.

## What blocks production

Before a Play Store / Firebase Hosting promotion, this minimum set must be defined:

- All four `[REQUIRED]` Firebase keys.
- `VITE_FIREBASE_APPCHECK_SITE_KEY` (App Check on, otherwise the backend is exposed to abuse).
- `VITE_SMS_SENDER_MODE=native_silent` (production automation transport).
- `VITE_FILES_HUB_API_KEY` (admin batch import needs it).
- `VITE_GOOGLE_WEB_CLIENT_ID` (consistent native Google sign-in across web + Android).
- `VITE_SENTRY_DSN` (so we see prod errors).

Analytics keys (Amplitude / Clarity / Yandex / `VITE_FIREBASE_MEASUREMENT_ID`) are strongly recommended but not blockers. The app degrades gracefully when any of them are absent.

## Verifying configuration

`yarn dev` prints a startup banner that lists which optional services are wired and which are not. The admin diagnostics page at `/admin/diagnostics` runs the same check live, plus probes Firestore reachability and the FilesHub endpoint. Use it after a production deploy to confirm every expected variable is in place.

## Adding a new variable

The workflow (mandatory) is:

1. Add the variable to `.env.example` with `# [REQUIRED]` or `# [OPTIONAL]` tag and a one-line reason.
2. Add it to the `ImportMetaEnv` interface in `src/vite-env.d.ts`.
3. Read it via `requireEnv()` or `optionalEnv()` in `src/config/env.ts` — never via raw `import.meta.env` elsewhere.
4. If the variable is startup-critical, push the key onto the `REQUIRED_ENV_KEYS` registry so the `EnvMissingScreen` includes it.
5. Update this page in the same commit.

The same commit must touch all four files; CI rejects PRs where `.env.example` and `vite-env.d.ts` drift apart.
