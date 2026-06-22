---
title: Install the SMS Mobile App for Android and link it to your account
description: Download from Google Play, sign in with Google, grant Send SMS permission, and link the phone to your dashboard. Verified install workflow on Android 8+.
sidebar_position: 4
sidebar_label: Install the Android app
slug: install-the-android-app
keywords: [install sms mobile app android, link android sms app, send sms permission android, smsapp google play, android sender device]
last_update:
  date: 2026-06-22
  author: Ahsan Mahmood
---

import V1Status from '@site/docs/_partials/_v1-release-status.mdx';

# Install the Android app and link it to your account

<V1Status />

The SMS Mobile App for Android is the device that actually sends the texts — installing it links your phone's SIM to the web dashboard so jobs you create online dispatch from your real number. Without an Android phone in the loop, you can sign in to the dashboard but you can't send anything.

This tutorial covers installation from Google Play, the four permissions Android asks for, and the link-to-account step that ties the phone to your dashboard. The whole thing takes a few minutes; the only step that occasionally takes longer is reading the SMS-permission consent screen carefully, which is worth doing once to know what the app is asking for and what it's not.

## Prerequisites

An Android phone running Android 8.0 (Oreo) or newer with a working SIM card and an unlocked phone slot. A Google account — the same one you used to sign in to the web dashboard, so the link step matches accounts. Mobile data or Wi-Fi for the install. About 50 MB of free storage for the APK; the installed app sits at roughly 15 MB on disk.

If your phone runs an aggressive battery-management ROM (Xiaomi MIUI, Huawei EMUI, Oppo ColorOS, OnePlus Oxygen with battery saver, Samsung One UI Power Saving, and a handful of others), you'll also need to grant the app exemption from battery optimisation later in this tutorial. The app prompts you when needed.

## Step 1 — Install from Google Play

Open the [SMS Mobile App listing on Google Play](https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp) — or open Google Play on your phone and search for **SMS Mobile App** (published by Ahsan Mahmood). The listing shows the app icon, screenshots, and the **Install** button.

Tap **Install**, accept the storage download, and wait. Play takes a few seconds to download the APK and a few more to install it. When the **Open** button appears, the install succeeded.

If you're sideloading instead of using Play (for staging, internal testing, or a region without Play access), the [Apps & download](https://smsapp.aoneahsan.com/apps) page on the main site links to the current AAB / APK with a SHA-256 fingerprint you can verify before installing. Sideloading requires enabling **Install unknown apps** for your browser or file manager in Android settings; turn it back off after install.

## Step 2 — Open and sign in with Google

Tap **Open**. The app shows a one-screen welcome with a **Sign in with Google** button. Tap it. Android shows the native Google account picker; choose the same account you used in the web dashboard.

The app talks to Firebase Authentication using the Capacitor Google Auth plugin, exchanges an ID token for a Firestore session, and lands you on the home screen. You should see your Google profile picture in the top-right corner — that's the visible cue that sign-in worked.

If you have multiple Google accounts on the phone and pick the wrong one, sign out from the home-screen menu and try again. Mismatched accounts are the single most common cause of "the dashboard says I have no devices" later.

## Step 3 — Grant the Send SMS permission

:::note
This step applies to the future release that re-enables direct `SEND_SMS` sending. **The current Play Store version never shows this prompt** — it opens your own SMS app pre-filled and you tap Send, so the message goes from your SIM with no SMS permission. You can skip to Step 4 below.
:::

The first time you trigger any send action, the app prompts the standard Android permission dialog for `SEND_SMS`. The dialog is the system one — you can read what it says: "Allow SMS Mobile App to send SMS messages?" with **Allow** and **Don't allow** buttons.

Tap **Allow**. This is the permission that lets the app hand messages to `SmsManager`, the Android API that delivers SMS through your SIM. There is no workaround that bypasses this prompt; Android requires explicit user consent and shows the app inside the system Permissions screen ever after.

If you tap **Don't allow** by mistake, you can grant it later from **Settings → Apps → SMS Mobile App → Permissions → SMS → Allow**. Without `SEND_SMS`, the app can sign in and browse, but every send attempt will fail at the OS level with `SecurityException`.

The app does **not** request `READ_SMS`, `RECEIVE_SMS`, or any inbox permission. It cannot read your existing messages. It cannot intercept incoming messages. It is not a default SMS handler. Android wouldn't grant those permissions to a non-default-SMS app even if we asked.

## Step 4 — Optionally grant Read Contacts

If you plan to pick recipients from your contact list (rather than typing every number or uploading CSVs), the app also requests `READ_CONTACTS`. This permission is **optional** — declining it is fine, the recipient picker just won't be available.

When you tap **Pick from contacts** in any composer, Android prompts. Decide based on whether you want the convenience.

## Step 5 — Battery-optimisation exemption (when prompted)

For one-off sends and small batches, Android's default battery management is fine. For scheduled jobs that fire while the phone is in your pocket, or batch sends that take more than a few minutes, the OS may put the app to sleep mid-flight.

The app detects manufacturer-specific battery managers and prompts the appropriate **Disable battery optimisation** flow when needed. Following the prompt opens the relevant Android settings page; tap **Don't optimise** for SMS Mobile App and return to the app.

This is an Android requirement, not a per-app preference: the foreground service can keep the app alive across screen-off, but it can't survive aggressive vendor battery management without an explicit user opt-out.

## Step 6 — Confirm the device shows up in the dashboard

Open `smsapp.aoneahsan.com/devices` (or the **Devices** menu) on any browser. Your phone appears in the list with:

- The model name Android reports (e.g. **Pixel 8**)
- The SIM slot count (1 or 2)
- The last-seen timestamp (updates every time the app comes online)
- An indicator showing whether the phone is opted into the volunteer pool (default: yes)

If the phone doesn't appear within a minute, sign out of the Android app and back in, then refresh the dashboard.

## What about iOS?

iOS doesn't expose a programmatic SMS sender to third-party apps — Apple reserves SMS dispatch for the Messages app and the small `MFMessageComposeViewController` UI helper that always requires user confirmation per message. There is no sanctioned API path to silently send SMS on iOS, regardless of vendor. SMS Mobile App's iOS story therefore stops at the web dashboard: an iPhone user can sign in, schedule jobs, and assign them to volunteer Android devices, but cannot themselves dispatch SMS without an Android phone in the picture. This is an iOS platform constraint, not a roadmap gap.

## Troubleshooting

If the install button on Google Play is greyed out with "This app isn't compatible with your device," the most common cause is an Android version older than 8.0. Older devices aren't supported.

If signing in returns a `Sign in failed` error after the Google account picker, the most likely cause is mismatched SHA-1 fingerprints between the installed app and the Firebase project — a signal you've installed an unofficial APK rather than the Play-Store-published one. Uninstall and reinstall from Play.

## What you've learned

You installed the app from Google Play, signed in with the account that matches your web dashboard, granted `SEND_SMS` (and optionally `READ_CONTACTS`), navigated the battery-optimisation exemption when prompted, and confirmed the phone is registered in the dashboard's device list. The phone is now a usable sender device for any job you create from the web.

## Where to go next

For the opt-in default-on volunteer device pool — and what that actually means for someone else's batch landing on your phone — go to [Become a volunteer device](/tutorials/become-a-volunteer-device). For day-to-day sending recipes, see the [How-to guides](/how-to). For the underlying architecture (Capacitor + Firebase + the custom NativeSms plugin), the upcoming [Architecture overview](/explanation) page in Explanation covers it.
