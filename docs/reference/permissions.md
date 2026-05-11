---
title: Permissions reference
description: Every Android permission declared by SMS Mobile App, why it is requested, when the runtime prompt fires, and what happens if you deny it.
sidebar_position: 3
sidebar_label: Permissions
slug: permissions
keywords: [smsapp permissions, android sms permission, send_sms read_contacts foreground_service, play store sensitive permissions]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Permissions

The Android app declares permissions in `android/app/src/main/AndroidManifest.xml`. Many of them are runtime permissions on modern Android — the user has to grant them explicitly the first time the app tries to use the gated API. This page lists every declared permission, why it exists, when the prompt fires, what happens on denial, and which Play Store policy attaches to it.

Inspect the **merged** manifest (`android/app/build/intermediates/merged_manifests/*/AndroidManifest.xml`) when auditing. Capacitor and Cordova plugins inject permissions during the merge, so the source manifest does not always match what Google Play sees.

## Core permissions (granted by install, no runtime prompt)

These cannot be denied at runtime. They are advertised in the Play Store listing and granted implicitly when the user installs the app.

| Permission | Why we declare it | Notes |
|---|---|---|
| `android.permission.INTERNET` | Network access for Firebase, FilesHub, analytics. | Required for nearly every feature. |
| `android.permission.ACCESS_NETWORK_STATE` | Detect connectivity changes so the queue knows when to retry. | Powers the offline indicator and the resume-on-reconnect logic. |
| `android.permission.FOREGROUND_SERVICE` | Allow the SMS automation runner to run as a foreground service so it survives app-background, screen-lock, and Doze. | Mandatory for silent batch sends on Android 9+. |
| `android.permission.FOREGROUND_SERVICE_DATA_SYNC` | Android 14+ (API 34) refinement: declare the **category** of foreground work. Our category is `dataSync` (queue ↔ Firestore reconciliation). | Required in addition to `FOREGROUND_SERVICE` on API 34+. |
| `android.permission.RECEIVE_BOOT_COMPLETED` | Re-arm scheduled jobs after the device reboots. The boot receiver in `plugins/BootReceiver.java` re-registers WorkManager tasks. | No user data is touched; we only re-register schedules. |
| `android.permission.WAKE_LOCK` | Keep the CPU awake long enough for the automation runner to drain its current claim batch. | Used in short bursts; not held continuously. |

## Sensitive permissions (runtime prompt + Play Store declaration)

These trigger a runtime prompt the first time the app needs them. Each one also requires an entry in the [Privacy Policy](https://smsapp.aoneahsan.com/privacy) and a matching row in the Play Console **Data Safety** form. Denying any of these does not crash the app — the feature gracefully falls back.

### `android.permission.SEND_SMS`

**What it does.** Lets the app submit text messages to the system's `SmsManager`. This is the core capability behind both UI-prompted sends (`@byteowls/capacitor-sms`) and silent batch sends (the in-tree `NativeSms` plugin).

**When the prompt fires.** First time the user taps **Send** in the composer or first time the automation runner picks a claim off the queue. The prompt is the standard Android system dialog with `Allow` / `Don't allow`. We do not pre-explain — the in-app onboarding does.

**On denial.** UI-prompted sends fall back to the system composer flow (`Intent.ACTION_SENDTO`), which still requires the user to tap the carrier's **Send** button once per message. Silent automation refuses to start and the runner status flips to `permission_denied` until the user re-grants from Settings.

**Play Store.** This permission is on Google's high-risk list. The Play Console **Permissions Declaration** form must be filled out. SMS Mobile App declares its category as **Send-only** (we never read, receive, or store incoming messages). We are not a default SMS handler — Permissions Declaration explicitly says so.

### `android.permission.READ_CONTACTS`

**What it does.** Provides read-only access to the user's address book through `@capacitor-community/contacts`. Powers recipient autocomplete and group selection.

**When the prompt fires.** First time the user opens the recipient picker and chooses **From contacts** (instead of typing the number or pasting from clipboard).

**On denial.** The composer continues to work with manual entry, clipboard paste, and CSV upload. The **From contacts** option in the picker is hidden until the user grants from Settings. Contact group features (the "VIP" / "Family" / "Customers" groups) display an empty-state CTA explaining what the permission unlocks.

**Privacy.** Contacts are read on-demand. We never sync them to a remote server. Contacts that the user selects as recipients are stored in the per-user `sms_contacts` Firestore collection (encrypted at rest by Firebase). The address book itself stays on-device.

### `android.permission.POST_NOTIFICATIONS`

**What it does.** Allows the app to post local notifications on Android 13+ (API 33). Used by the foreground-service notification ("SMS automation running — paused / sending recipient X of Y"), local job-completed notifications, and ad notifications when the user opts in.

**When the prompt fires.** First time the app needs to post a notification. The foreground-service notification is itself the trigger on Android 13+.

**On denial.** The foreground service runs without a user-visible notification (the system still maintains the ongoing-service slot, but the notification body is suppressed). Batch progress is visible only by opening the app. Job-completion local notifications are silently skipped.

### `android.permission.VIBRATE`

**What it does.** Triggers a short vibration through `@capacitor/haptics` for success/failure feedback in the composer and dashboard.

**When the prompt fires.** Never — this is install-time on every Android version we support (API 23+).

**On denial.** Cannot be denied. The user can disable system-level haptics from device settings; the app respects that.

## Permissions we deliberately do NOT declare

This is as important as the list of permissions we do declare. Each line below is a permission Play Store flags as high-risk that some other SMS app uses but we do not.

| NOT declared | Why we avoid it |
|---|---|
| `READ_SMS` | We never read the user's inbox. The product is send-only. |
| `RECEIVE_SMS` | Same. We are not a default SMS handler. |
| `READ_PHONE_STATE` | We do not need the IMEI / SIM serial. Per-SIM identity comes from the user-selected SIM slot in the composer. |
| `READ_CALL_LOG` | We do not touch call history. |
| `ACCESS_FINE_LOCATION` | The product has no location-based feature. Carrier rate-limit detection is API-based. |
| `BODY_SENSORS` | Not applicable. |
| `ACTIVITY_RECOGNITION` | Not applicable. |
| `WRITE_EXTERNAL_STORAGE` | CSV imports use SAF (Storage Access Framework) which does not need the legacy storage permission. |

If any of these creep into the merged manifest during a Capacitor plugin upgrade, the release is held until the plugin is rolled back, swapped, or formally declared. The pre-flight script in `tools/audit-merged-manifest.ts` catches this.

## Permission lifecycle on the device

The first time a runtime permission is requested, the user sees the standard Android prompt. If they decline, the system marks the permission as **soft-denied**. The app may re-request once. The second denial flips it to **permanently denied** — the only path back is the Settings app (`Settings > Apps > SMS Mobile App > Permissions`).

The app handles both states. `usePermissionStatus` (in `src/lib/permissions/`) exposes the current status with three values: `granted`, `denied` (soft), `blocked` (permanent). The composer renders different CTAs for each: a tooltip + native prompt button for `denied`, a deep-link-to-settings button for `blocked`, a normal **Send** button for `granted`.

## How-to recipes for granting and managing

- [Grant SEND_SMS and READ_CONTACTS permissions](/how-to/auth-and-devices/grant-sms-permissions)
- [Switch SIM on a dual-SIM phone](/how-to/auth-and-devices/switch-sim-on-dual-sim) — uses the same permission model
- [Register your Android device](/how-to/auth-and-devices/register-your-android-device) — covers the initial onboarding-time grants

## Browser companion permissions

The browser extension companion (when installed) declares a different permission set in its WXT manifest. It does not declare any of the Android permissions above. See `extension/CLAUDE.md` for that list; it falls outside the Play Store policy review and uses Chrome Identity API for auth (no Firebase Auth SDK, no remote-code violation).
