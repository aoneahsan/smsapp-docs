---
title: How to send a single UI-prompted SMS
description: Compose one SMS that opens the device's native SMS app with your message pre-filled. Covers when to use this versus the silent path and the iOS fallback behaviour.
sidebar_position: 1
sidebar_label: Send a single UI-prompted SMS
slug: send-a-single-ui-prompted-sms
keywords: [send single sms android, ui-prompted sms, native sms composer, sms mobile app one-off send, capacitor sms plugin]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Send a single UI-prompted SMS

A UI-prompted send opens your device's native SMS app with the recipient and body pre-filled, then waits for you to tap the system's **Send** button. This is the safest send mode — you always get one final look at the message before it leaves your SIM. The recipe covers the dashboard flow, the Android-app flow, and when to choose this over the silent path covered next.

## When to use this versus a silent send

Pick the UI-prompted path for one-off personal messages, anything sensitive enough that you want a final visual review, or for sending under regulatory regimes (some workplaces, some jurisdictions) where automated SMS without explicit per-message consent is prohibited. The system composer counts as that consent.

Pick the silent path (next recipe) for batch jobs where opening 50 system composers in a row is obviously absurd, or for scheduled jobs that fire while the phone is in your pocket.

## Prerequisites

A signed-in account on the web dashboard. A linked Android phone with `SEND_SMS` granted (see [Grant SMS and Contacts permissions](/how-to/auth-and-devices/grant-sms-permissions) if you haven't yet). A recipient phone number in international format with the leading `+`. The Android app does not need to be open — your phone's notification area or system composer will surface the prompt when the job arrives.

## From the web dashboard

1. Open `smsapp.aoneahsan.com/send-message` (or click **Send message** in the navigation).
2. Type the recipient number in international format, e.g. `+15551234567`. The validator turns the field green when the number parses cleanly.
3. Type your message. The character counter under the textarea shows the current count and the segment count — a single SMS holds 160 Latin characters or 70 if any non-Latin character (emoji, Urdu, Arabic, Chinese, etc.) appears in the body.
4. In the **Send mode** selector, choose **UI-prompted**. The default is whatever you used last; for first-time sends it's set to UI-prompted to be safe.
5. Confirm the assigned device in the **Send via** picker. If you have multiple phones linked, pick the one whose SIM should originate the message.
6. Click **Send**. The dashboard creates a job document with `sendMode: 'ui-prompted'` in Firestore. Your phone receives the job through the live subscription within seconds.

## What happens on the phone

The Android app receives the job, identifies it as UI-prompted, and hands the recipient + body to the system SMS composer via the `@byteowls/capacitor-sms` plugin's intent invocation. Your phone's default messaging app — Google Messages, Samsung Messages, or whichever app is set as the Android default SMS app — opens with the recipient and body pre-filled.

You tap **Send** in the system composer. The system composer dispatches via your SIM, exactly as if you'd typed the message yourself. The SMS Mobile App receives a delivery callback (where supported) and updates the job's status in Firestore to **Sent** or **Delivered**.

If the phone is locked, the job sits pending until you unlock and the SMS Mobile App is brought to the foreground. The system composer cannot present itself over the lock screen for security reasons.

## From the Android app directly

You can skip the dashboard entirely for one-off sends:

1. Open the SMS Mobile App on your phone.
2. Tap the **Compose** button on the home screen.
3. Fill in recipient + body, leave the **UI-prompted** toggle on.
4. Tap **Send**. The system composer opens with your message pre-filled.
5. Tap the system composer's **Send** button.

The dashboard records the send in your Jobs list either way — the app creates a job document on send so your history stays unified.

## Verify delivery

Two checks. First, the recipient phone should receive the SMS within a minute, showing your real number as the sender. Second, open `smsapp.aoneahsan.com/jobs` (or the **Jobs** entry in the navigation) and confirm the row is marked **Sent**. The status updates to **Delivered** when the carrier returns a delivery receipt (most carriers do; some don't).

If you tapped **Send** in the system composer but the dashboard still shows **Pending** several minutes later, the Android delivery callback didn't fire — usually because your messaging app's permission to report back was denied. The SMS itself went out; the status just didn't sync. Confirm with the recipient.

## What this mode does not do

UI-prompted mode cannot send SMS while your phone is locked, cannot batch (you'd be confirming 100 composers in a row), and cannot fire on a schedule because the user-confirmation step needs you present. Use the silent path for those.

It also cannot bypass the system composer's own validation — if your default messaging app refuses a number for any reason, the SMS Mobile App can't override that. The fix is to verify the number works when typed manually in your messaging app first.

## Common errors

If the system composer opens but the **Send** button is greyed out, the recipient number didn't pass the messaging app's own validation. Add the country code, remove formatting characters, and retry.

If nothing happens when you tap **Send** in the dashboard, the Android app might be killed or the device is offline. Open the app, confirm a recent last-seen on the dashboard's devices page, and resend.

If the system composer opens with a different app than expected, Android's default SMS app is set to something other than your usual choice. Change it under **Settings → Apps → Default apps → SMS app**.

## Where to go next

For batched and scheduled sends where UI prompts are impractical, continue to **Send a silent batch SMS** in this same how-to category. For reusable message bodies (the same `"Reminder: appointment tomorrow"` across many sends), see **Use templates**. For sends that should fire automatically at a future time, **Schedule a recurring SMS** covers it.
