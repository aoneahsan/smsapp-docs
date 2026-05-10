---
title: Get started with SMS Mobile App in 5 minutes
description: Sign in with Google, link your Android phone, and send your first SMS through the web dashboard. Verified end-to-end on a fresh account.
sidebar_position: 1
sidebar_label: Get started in 5 minutes
slug: get-started-in-5-minutes
keywords: [sms mobile app tutorial, send first sms android, smsapp sign up, smsapp google sign in, send sms from web]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Get started with SMS Mobile App in 5 minutes

This tutorial walks you through signing in to SMS Mobile App's web dashboard, linking your Android phone, and sending your first SMS — start to finish in roughly five minutes. Everything happens through your own Google account and your own phone's SIM card; no third-party SMS gateway is involved.

By the end you will have:

- A signed-in account at `smsapp.aoneahsan.com`
- An Android phone linked to that account as a sender device
- A successfully delivered SMS sitting in your sent log

If you don't have an Android phone right now, you can still sign in and explore the dashboard, but the actual send step needs Android — that's where the SIM-based dispatch happens.

## Prerequisites

Five minutes of attention, a Google account you don't mind signing in with, an Android phone running Android 8 (Oreo) or newer with a working SIM card and mobile-data or Wi-Fi connectivity, and any second phone (yours or a friend's) you can text as a recipient. Carrier-standard SMS rates apply to every send — SMS Mobile App is free to use, but your operator still charges its usual per-message rate.

## Step 1 — Open the dashboard

Go to [https://smsapp.aoneahsan.com](https://smsapp.aoneahsan.com) in any modern desktop or mobile browser. The landing page introduces the product and shows a **Sign in with Google** button in the top-right corner of the header.

You can also open the page on your Android phone if that's all you have — the dashboard is fully responsive.

## Step 2 — Sign in with Google

Click **Sign in with Google**. You'll be redirected to Google's standard OAuth consent screen, where you pick the Google account you want to use and approve a small set of read-only profile scopes (your name and email address — nothing more). Google sends you back to the dashboard, now signed in.

The dashboard creates a Firestore record under your user ID the first time you sign in. There's nothing else to set up — no phone-number verification, no payment method, no organisation onboarding.

## Step 3 — Compose your first message

Click **Send message** in the navigation (or visit `smsapp.aoneahsan.com/send-message` directly). You land on a single-screen composer with three fields: **recipient phone number**, **message body**, and a **send-now / schedule** toggle.

Type a recipient phone number in international format with the leading `+`. For example, a US number looks like `+15551234567` and a Pakistan number looks like `+923001234567`. Local-format numbers (without country code) will be flagged by the validator.

Type a short message — `"Hi, this is a test from SMS Mobile App"` is fine. Notice the character counter under the textarea: a single SMS holds 160 characters in the Latin-only encoding, or 70 if your message contains a non-Latin character. Beyond that the message is split into multi-part SMS, billed by your carrier as multiple messages.

Leave the toggle on **Send now** for this tutorial.

## Step 4 — Dispatch from your Android device

If you don't yet have the Android app installed, the dashboard prompts you with a link to install it (see [Install the Android app](/tutorials/install-the-android-app) for a deeper walkthrough). For the five-minute path, install the app, sign in to it with the same Google account, grant the **Send SMS** permission when Android prompts, and return to the web dashboard.

With the app linked, the dashboard's **Send** button on the composer now shows your phone in a small device picker. Click **Send**. The dashboard creates a job, your phone picks it up over the live Firestore subscription, the native `SmsManager` API hands the SMS to your carrier, and the result syncs back to the dashboard within a few seconds.

## Step 5 — Confirm delivery

Two checks. First, look at the recipient phone — the SMS should arrive within a minute, showing your real mobile number as the sender (not a shortcode, not a proxy). Second, open `smsapp.aoneahsan.com/jobs` (or the **Jobs** entry in the navigation) and confirm your test send is listed with status **Sent**. If the carrier later returns a delivery receipt, the status updates to **Delivered**.

If the recipient is using an iPhone with iMessage, your message will arrive as a regular green-bubble SMS — that is the desired behaviour and confirms the send went through the cellular network rather than any over-the-top channel.

## Troubleshooting

If the **Send** button is greyed out, the most common cause is that no Android device is linked yet. Open the Android app, sign in with the same Google account, and the device should appear within a few seconds.

If the SMS leaves your phone (the Android notification shows it as sent) but the recipient never receives it, the carrier rejected the message. Check that the recipient number is correct, in international format, and that your account has positive SMS balance with your carrier.

If signing in with Google fails with an `auth/unauthorized-domain` error, you've probably opened a non-canonical URL — the OAuth consent screen is configured for `smsapp.aoneahsan.com` only.

## What you've learned

You signed in to the web dashboard with Google, linked an Android phone as your sender device, dispatched an SMS through your own SIM card, and confirmed delivery in two places. The ride was zero-touch on infrastructure: no API keys, no SMS provider, no backend you have to provision.

## Where to go next

For sending the same message at a future time, continue to [Send your first scheduled SMS](/tutorials/send-your-first-scheduled-sms). For sending one message to many recipients, jump to [Set up a small batch send](/tutorials/set-up-a-batch-send). For a deeper dive on the Android app itself — manual SIM selection, foreground service, battery considerations — see [Install the Android app and link it](/tutorials/install-the-android-app).
