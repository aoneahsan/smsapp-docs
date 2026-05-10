---
title: How to register your Android device as a sender
description: Add an Android phone to your account so it can dispatch SMS jobs. Covers install, sign-in, permissions, and confirming the device shows up on the dashboard.
sidebar_position: 2
sidebar_label: Register your Android device
slug: register-your-android-device
keywords: [register android device sms, link phone smsapp, android sender device, sms mobile app device pairing]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Register your Android device as a sender

Registering a device means installing the SMS Mobile App on an Android phone, signing in with the same Google account you use on the dashboard, and granting the `SEND_SMS` permission. Once registered, the phone appears in your dashboard's device list and is eligible to dispatch any job you assign to it.

## Prerequisites

Android phone running 8.0 (Oreo) or newer with a working SIM. A Google account that already exists on your dashboard (sign in there first if you haven't). About 50 MB of storage and a few minutes. Google Play access, or — if you're sideloading — the trusted APK link from the [Apps & download](https://smsapp.aoneahsan.com/apps) page on the main site.

## Install the app

Search for **SMS Mobile App** by Ahsan Mahmood on Google Play, tap **Install**, and wait for the **Open** button to appear. If you're sideloading instead, download the AAB / APK from the trusted link, enable **Install unknown apps** for your browser or file manager in Android settings, install the package, and disable the unknown-apps permission again afterwards.

## Sign in with the matching Google account

Open the app. Tap **Sign in with Google** and pick the same account you used on the dashboard. Mismatched accounts are the most common reason a freshly installed device "doesn't show up" — the phone is actually registered, just under a different user's account that you can't see from your dashboard.

If you don't see the account you want in the picker, add it via **Settings → Accounts → Add account → Google** in Android, then return to the SMS Mobile App and try again.

## Grant SEND_SMS

Trigger any send action (the home screen has a quick **Send test SMS** button that's safe to tap — it composes nothing and just exercises the permission flow). Android shows the standard permission dialog: **"Allow SMS Mobile App to send SMS messages?"** with **Allow** and **Don't allow** buttons. Tap **Allow**.

The phone is now technically registered as a sender, but if you tapped **Don't allow** the registration is incomplete — the dashboard will list the device but every send will fail at the OS level. See [Grant SMS and Contacts permissions](./grant-sms-permissions) for the recovery path.

## Confirm registration on the dashboard

Open `smsapp.aoneahsan.com/devices` on any browser signed in with the same Google account. The phone appears in the list within a few seconds, with:

- The model name Android reports (e.g. **Pixel 8**, **Galaxy A54**, **Redmi Note 13**)
- SIM slot count (1 or 2; details on [dual-SIM behaviour](./switch-sim-on-dual-sim))
- Last-seen timestamp
- Volunteering badge (default state: **Volunteering**)

If the phone doesn't appear within a minute, sign out of the app and back in. The live Firestore subscription will resync.

## Optional but recommended steps

Disable battery optimisation for the app on aggressive ROMs (MIUI, EMUI, ColorOS, OxygenOS, OneUI Power Saving). The app prompts when needed; following the prompt opens the right Android settings page. Without the exemption, scheduled jobs and batches that run for more than a few minutes can be killed mid-flight.

If you plan to use the contact picker rather than typing every recipient or uploading CSVs, also grant `READ_CONTACTS` when the app prompts. This is optional; declining it just means the picker isn't available and you'll need to type recipients or import via CSV.

## Re-registering an existing device

The same phone can be re-registered against a different account by signing out of the app and back in with the new account. The phone appears under the new account; the old account's device list loses it. There's no manual unregister step beyond signing out.

A reset device or a wiped phone re-registers on first sign-in just like a fresh install.

## Common errors

If the dashboard shows an empty device list even after a successful Android sign-in, the most common cause is the mismatched-account scenario covered above. Confirm both surfaces show the same email under the profile picture.

If signing in to the Android app returns **Sign-in failed** with no detail, the installed APK probably has a SHA-1 fingerprint that doesn't match the one configured in the Firebase project — a sign you've installed an unofficial build. Uninstall and reinstall from Google Play.

If Google Play shows **This app isn't compatible with your device**, the Android version is older than 8.0. Older devices aren't supported.

## What you've achieved

Your phone is signed in with the right account, has `SEND_SMS` granted, appears on your dashboard's device list with a recent last-seen timestamp, and is eligible for any job you assign. You're ready to send. From here, the **Sending SMS** how-to category (lands in Batch 4) will cover single sends, silent batch sends, templates, drafts, and recurring schedules.
