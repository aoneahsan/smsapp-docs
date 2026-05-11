---
title: Service modules & analytics events reference
description: The front-end service-module map of SMS Mobile App, the responsibilities of each module, and the catalog of analytics events grouped by feature area.
sidebar_position: 5
sidebar_label: Services & events
slug: services-and-events
keywords: [smsapp service modules, smsapp analytics events, firebase analytics taxonomy, amplitude events sms mobile app]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Service modules & analytics events

The front end is organised around **service modules** under `src/lib/`. Each module owns a domain — its data access (Firestore reads/writes), its analytics events, and its public TypeScript API. Components import from the module's `index.ts`; they never reach into other modules' internals.

This page is the module map and the analytics event catalog. It is the answer to "where does X live?" and "what event name should I look for in Amplitude?".

## Service module map

### Authentication & identity

| Module | Owns |
|---|---|
| `auth/` | Google OAuth flow, session restoration, `AuthProvider` context, background ID-token refresh (45-min cycle). |
| `smsUsers/` | `sms_users` collection reads/writes, profile sync on login, tier (`free` / `fair_use_upgraded`) management. |
| `device/` | Per-install device identity, fingerprint hashing, Capacitor Preferences–backed `appIdentifier`. |
| `smsDevices/` | `sms_devices` collection, device registration, rename cooldown, heartbeat writes, health-score updates. |

### Sending SMS

| Module | Owns |
|---|---|
| `sms/` | High-level send abstraction. Picks the right transport based on `VITE_SMS_SENDER_MODE` (mock / native / native_silent). `smsSegments.ts` counts GSM-7 / UCS-2 segments for the composer. |
| `smsJobs/` | `sms_jobs` collection. Job lifecycle (create / claim / send / settle), retry budget, claim-lock service (`jobLockService.ts`). |
| `smsBatches/` | `sms_batches` collection. CSV import, recipient management, atomic counter increments, recipient-reclaim service for expired claims. |
| `smsAutomation/` | The runner orchestration on the device side: foreground-service start/stop, claim acquisition, rate-cap enforcement, exponential-backoff retries with jitter. |
| `templates/` | `sms_templates` collection. `{{token}}` substitution engine, template versioning. |
| `drafts/` | `sms_drafts` collection. Auto-save every 2s, cross-device sync, draft-vs-template distinction. |
| `quickReplies/` | `sms_quick_replies` collection. One-tap insert presets. |
| `scheduler/` | Cron parsing for `Daily / Weekly / Monthly / Custom` schedules, timezone anchoring, DST handling. |

### Quotas & limits

| Module | Owns |
|---|---|
| `quota/` | Pre-login guest quota (10-SMS allowance). `sms_guest_quota` mirror, dual-track (Capacitor Preferences + Firestore). |
| `featureLimits/` | Per-user feature ceiling enforcement. Backed by TanStack Query against `sms_user_usage`. |

### Contacts & data

| Module | Owns |
|---|---|
| `contacts/` | On-device address-book read (via `@capacitor-community/contacts`). Selectively persists used recipients to `sms_contacts`. |
| `csv/` | CSV parse / validate / dedupe pipeline used by the admin batch import. |
| `filesHub/` | FilesHub upload/download client. All file storage routes through FilesHub — never Firebase Storage. |
| `storage/` | Thin wrapper over Capacitor Preferences. Schema-versioned, with typed getters/setters. |

### UI infrastructure

| Module | Owns |
|---|---|
| `theme/` | Radix theme tokens, light/dark/system resolution, Capacitor-Preferences + Firestore sync for cross-device theme settings. |
| `toast/` | Toast stack, queue + dismiss API. |
| `dialog/` | Centralised dialog stack (confirm / alert / info), avoids duplicate dialogs. |
| `haptics/` | Haptics + accessibility-aware vibrate. |
| `clipboard/` | Read/write helpers + analytics-instrumented copy actions. |
| `share/` | Native share-sheet integration via `@capacitor/share`. |
| `splashScreen/`, `statusBar/`, `edgeToEdge/` | Capacitor system-UI helpers. |
| `privacyScreen/` | Hides app contents when backgrounded (auth-protected screens). |

### Operations & instrumentation

| Module | Owns |
|---|---|
| `analytics/` | The single entry point — `trackEvent({ eventName, ... })`. Fan-out to Firebase Analytics + Amplitude + Microsoft Clarity. Lazy-loads Amplitude on first interaction. |
| `sentry/` | Error reporting. Init gated on `VITE_SENTRY_DSN`. PII scrubbing rules. |
| `logging/` | The centralised logger. `console.*` is banned in app code (ESLint enforced) — every log routes through `logger`. |
| `firebase/` | Firebase app bootstrap, Firestore connection, optional App Check. |
| `seo/` | The single source of truth for the public-route list, sitemap generation feed, per-route JSON-LD. |
| `feed/` | `feed.xml` generator, public-content feed orchestration. |
| `diagnostics/` | Admin-only system check page data sources. Firestore reachability, manifest drift, recent error logs. |
| `config/` | Type-safe env access (`requireEnv()` / `optionalEnv()`), startup environment validation. |

### Notifications & engagement

| Module | Owns |
|---|---|
| `notifications/` | Local-notifications wrapper (`@capacitor/local-notifications`). |
| `pushNotifications/` | OneSignal integration (free tier). |
| `badge/` | App-icon badge count. |
| `appUpdate/` | In-app update check via `@capacitor/app`. |
| `appShortcuts/` | Android home-screen long-press shortcuts. |
| `reviews/` | In-app review prompt via the `@capacitor-firebase/app` review APIs. |
| `appLauncher/` | Deep-link launcher to other apps (used by share + cross-app handoff). |
| `appReview/` | Review-prompt eligibility logic. |

### Misc

| Module | Owns |
|---|---|
| `motion/`, `keepAwake/`, `permissions/` | Capacitor system helpers. |
| `offline/` | Online/offline detection wired into the queue runner. |
| `blog/`, `feed/`, `contact/` | Content-side data sources for `/blog`, `/feed`, `/contact`. |
| `advertising/` | Public-page ad rendering and impression/click tracking. |
| `achievements/` | Achievement detection rules and `sms_user_achievements` updates. |
| `queryClient/` | TanStack Query setup, centralised query-key factory (`qk`). |
| `hooks/` | Cross-module React hooks: `useUrlState`, `useFocus`, `useDebouncedValue`, `useElementSize`, etc. |
| `settings/`, `smsSettings/`, `smsLogs/` | Per-domain reads/writes for the corresponding Firestore collections. |
| `browser/` | In-app browser open via `@capacitor/browser`. |

## Analytics event catalog

The app emits 272 distinct analytics events via `trackEvent({ eventName, ... })`. The event names follow a `<domain>_<action>[_<outcome>]` convention: e.g. `auth_login_success`, `sms_batch_recipient_failed`, `admin_user_tier_change`.

Below is the catalog grouped by feature area. Every event lands in all three platforms simultaneously (Firebase Analytics, Amplitude, Microsoft Clarity), so the same name searches across all three dashboards.

### Authentication
`auth_login_attempt`, `auth_login_success`, `auth_login_failure`, `auth_logout`, `auth_session_restored`.

### Sending SMS (single + automation)
`sms_send_pool_welcome_shown`, `sms_send_pool_welcome_acknowledged`, plus the full automation lifecycle: `background_native_started`, `background_native_stopped`, `background_native_trigger`, `background_native_start_error`, `background_sync_complete`, `background_sync_error`, `background_app_paused`, `background_app_resumed`, `background_battery_settings_opened`, `background_integration_init`, `background_integration_error`.

### Batches (admin + runner)
`admin_jobs_bulk_retry`, `admin_job_force_retry`, `admin_job_cancel`, `admin_job_delete`. Plus per-recipient lifecycle events emitted from the runner (claim acquired, recipient sent, recipient failed, claim released).

### Admin operations
`admin_users_list_loaded`, `admin_user_tier_change`, `admin_device_deactivate`, `admin_analytics_date_range_change`, `admin_contact_status_updated`, `admin_config_save_remote`, `admin_refresh_config_success`, `admin_refresh_config_failure`, `admin_clear_error_logs_success`, `admin_sms_test_mock_success`, `admin_sms_test_mock_failure`, `admin_ad_created`, `admin_ad_updated`, `admin_ad_toggle_active`.

### Advertising
`ad_impression`, `ad_click`, `ad_dismiss`, `ad_dismiss_local`, `ad_dismissals_cleared_all`, `ad_dismissal_cleared`, `ad_carousel_swipe`, `ad_modal_show`, `ad_modal_close`, `ad_modal_fetch`, `ad_fetch_active`, `ad_notification_shown`, `ad_notification_click`, `ad_notification_scheduled`, `ad_notification_permission_requested`, `ad_store_initialized`, `ad_store_refresh`, `ad_toggled`, `ad_created`, `ad_updated`, `ad_deleted`.

### Achievements
`achievement_unlocked`, plus per-achievement progress events.

### Blog
`blog_posts_load`, `blog_posts_fetch`, `blog_post_viewed`, `blog_post_created`, `blog_post_updated`, `blog_post_published`, `blog_post_archived`, `blog_post_deleted`, `blog_post_status_changed`.

### Contacts
`contacts_permission_check`, `contacts_permission_request`, `contacts_fetch_success`, `contacts_fetch_error`, `contacts_added_to_group`, `contacts_delete_all_start`, `contacts_delete_all_success`, `contacts_delete_all_error`, `contact_created`, `contact_deleted`, `contact_form_submitted`.

### Quick replies + templates + drafts
`quick_replies_reordered`, plus CRUD events for templates and drafts.

### Settings
`settings_device_id_copied`, `settings_device_renamed`.

### App lifecycle
`app_version_change`, `app_update_available`, `app_update_immediate_started`, `app_update_immediate_completed`, `app_update_immediate_failed`, `app_update_flexible_install`, `app_update_flexible_started`, `app_update_flexible_completed`, `app_update_flexible_failed`, `app_store_opened`, `app_store_opened_for_review`, `app_review_trigger`, `app_review_requested`, `app_launcher_open_url`, `app_shortcut_clicked`, `app_shortcuts_set`, `app_shortcuts_cleared`.

### Browser / clipboard / share
`browser_url_opened`, `clipboard_copy`, `clipboard_copy_url`, `app_store_opened`.

### Notifications + badge
`badge_count_set`, `badge_cleared`, plus per-channel notification lifecycle events.

### Config + diagnostics
`config_fetch_success`, `config_fetch_failure`, plus admin error-log management events.

## Conventions

Every event passes through the centralised `trackEvent` helper in `src/lib/analytics/analytics.ts`. The helper enforces:

- **Sanitisation.** No phone numbers, no message bodies, no email addresses in event params. The composer events carry `messageLength` and `recipientCount` only — never the values themselves.
- **Lazy load.** Amplitude SDK is dynamically imported on `requestIdleCallback` or first user interaction, whichever comes first. Pre-load events are queued and drained when the SDK is ready.
- **PII scrub.** Sentry breadcrumb pipeline strips known PII fields before they hit the network.
- **Disabled in mock mode.** When `VITE_SMS_SENDER_MODE=mock`, send events are still emitted but tagged `sender_mode: mock` so they don't pollute production funnels.

## Where to look in code

The analytics module: `src/lib/analytics/analytics.ts`. The event catalog itself lives at usage sites — each module emits its own events, no central registry, because the names are stable and grep-discoverable. Lint rule `no-console` (enforced) keeps every log call routing through `logger`. The list above is generated by grepping `eventName:\s*'…'` patterns across `src/`.
