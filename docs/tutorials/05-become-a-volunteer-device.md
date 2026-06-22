---
title: Become a volunteer SMS sending device
description: Understand the opt-in default-on volunteer pool, set per-device rate caps, and confirm or opt out of receiving batch jobs from other accounts.
sidebar_position: 5
sidebar_label: Become a volunteer device
slug: become-a-volunteer-device
keywords: [volunteer sms device, opt-in sms pool, sms mobile app volunteer, opt out batch sms, fair-use sms]
last_update:
  date: 2026-06-22
  author: Ahsan Mahmood
---

import V1Status from '@site/docs/_partials/_v1-release-status.mdx';

# Become a volunteer device (or opt out)

<V1Status />

A volunteer device is an Android phone you've enrolled in the shared sender pool, allowing batch jobs created on the dashboard to fan out across multiple SIMs instead of all going through one phone. Volunteering is opt-in default-on: the moment you install the Android app and sign in, your phone is a candidate volunteer unless you toggle it off.

This is the most consequential setting in the app, so this tutorial covers exactly what it means, exactly what your phone is doing when it accepts a volunteer job, and how to opt out cleanly. Read this before deciding — you can change your mind any time, but knowing the contract first is fairer to you.

## Prerequisites

A linked Android phone with the app installed and signed in (see [Install the Android app](/tutorials/install-the-android-app) if you haven't yet). A working understanding of single-device sends from [Get started in 5 minutes](/tutorials/get-started-in-5-minutes) — volunteer pool participation only matters once you (or someone you've authorised) start dispatching batches.

## What "volunteer device" actually means

Three concrete behaviours follow from your phone being opted in:

First, batches you create yourself can be assigned to your phone, exactly as if you'd manually picked it. This is the unsurprising case.

Second, batches created by other accounts you've explicitly authorised — for example, an organisation account where you're a member, or a friend's account you've co-signed — can also assign to your phone, subject to fair-use boundaries. The dashboard is explicit about which account is requesting your device's participation; nothing happens silently.

Third, the foreground service on your phone may run while a batch is in flight, even when the screen is off. The notification shadow always shows the active service ("SMS Mobile App is sending messages") so there's never a question whether your phone is dispatching.

What it does **not** mean: your phone is **never** used as a relay for messages composed by people you don't know. There is no public marketplace of senders; every assignment is account-scoped. The app has no mechanism by which a stranger's batch can land on your SIM.

## Fair-use boundaries

The volunteer pool sits behind several fairness limits, all enforced server-side:

- **10-device cap per batch** — no single batch can fan out across more than 10 SIMs, period. This applies even if 20 phones are eligible.
- **Per-device rate** — defaults to 6 messages/minute. You can raise it for your own phone in your device settings up to a per-account ceiling.
- **Daily-volume soft limit** — a fair-use threshold above which the dashboard surfaces a warning to the batch creator. There's no hard cutoff; the system trusts you to act in good faith and rolls up volume into the [Fair-Use Policy](https://smsapp.aoneahsan.com/fair-use) review.
- **Carrier reality** — your carrier's anti-spam systems are the final boundary. If a carrier rate-limits a SIM, the dashboard's per-recipient retry logic backs off automatically.

These exist so that one user's 50,000-message blast can't tie up everyone's phones for the rest of the day.

## Step 1 — Open device settings on the dashboard

Go to `smsapp.aoneahsan.com/devices` (or the **Devices** entry in the navigation). Click the row for the phone you want to inspect or change. The detail panel opens with current participation status, last-seen, current rate cap, and an authorised-accounts list.

## Step 2 — Read the participation row

The row reads either **Volunteering for: yourself, *N* additional accounts** or **Not volunteering — opt-in disabled**. The default is the former, with no additional accounts unless you've signed an organisation invite.

You can see the exact accounts that may assign to your phone in the **Authorised accounts** list. Any account on that list (other than your own) is one you previously authorised through an invite link or org-membership flow.

## Step 3 — Adjust the rate cap (optional)

The **Rate cap** field is the maximum messages-per-minute this device will dispatch on any single batch, including your own. Default 6/min is conservative; raise to 10–15/min on home-broadband-style consumer SIMs, push higher only if your carrier and contract support it.

Setting a higher rate cap doesn't force every batch to that rate — it's a ceiling. The batch creator's chosen rate still applies, capped at your per-device ceiling.

## Step 4 — Opt out (if that's your call)

Click **Stop volunteering**. The dashboard updates the device's participation flag, and the Android app receives the change through its live Firestore subscription within seconds. Any in-flight batch that was already running on this device is allowed to complete; new assignments stop arriving.

Once opted out, the device only fires jobs that you yourself create and assign manually. It still appears in your own device picker and behaves identically for personal sends — opting out only removes it from the pool that other authorised accounts can target.

## Step 5 — Confirm via the Android app

Open the SMS Mobile App on your phone. The home screen shows a participation badge: **Volunteering** or **Not volunteering**. The badge text matches the dashboard exactly. If the two disagree, refresh the app (pull down) and the live subscription will resync within a few seconds.

The app also displays the active foreground service whenever a batch is being dispatched; you can tap the notification to see the batch ID, the sending account, and the per-recipient progress.

## When opt-out makes sense

If you're using a personal phone with a strict carrier plan that doesn't tolerate high SMS volumes; if the SIM in this phone is shared with family members who text on it; if you don't want unexpected battery drain from background sends; or if you simply prefer manual control over every send your phone makes — opting out is the right call. There's no penalty, no reduced functionality for your own sends, and no judgement.

## When staying opted in makes sense

If the phone is a dedicated workhorse for SMS automation with a generous carrier plan; if you're in an org account where members co-sign volunteer participation; if you want to support a hobbyist friend's batch without manually re-assigning each time — staying in is valuable. The fair-use boundaries protect you from being abused.

## Battery and data considerations

A foreground service running for the duration of a batch is the largest battery hit. A 100-recipient batch at 6/min runs 16+ minutes; a 1,000-recipient batch runs 2+ hours. The screen stays off during the dispatch (it doesn't need to be on), but the radio is up the whole time. On a moderate-spec phone, expect 5–10% battery for a 1,000-message batch.

Mobile data use is negligible — every job document is a few KB at most. Wi-Fi or LTE both work; the app prefers Wi-Fi when available.

## Troubleshooting

If the dashboard shows you opted in but the Android app shows opted out (or vice versa), it's a sync lag. Pull-to-refresh the app's home screen; the live Firestore subscription will resolve within a few seconds. If the inconsistency persists for more than a minute, sign out of the app and back in.

## What you've learned

You understand what volunteering means in concrete terms — which accounts can target your phone, what fair-use boundaries protect you, and what the foreground service is actually doing during a batch. You've inspected the participation row, optionally adjusted the per-device rate cap, and know how to opt out cleanly. The Android app and the dashboard agree on participation status because they read the same Firestore document.

## Where to go next

This is the last of the five getting-started Tutorials. From here, the [How-to guides](/how-to) cover specific recipes (sign-in flows, dual-SIM switching, retrying failed messages, configuring rate limits per batch, and more). The [Reference](/reference) section dives into the data model and security rules. The [Explanation](/explanation) section is the right next read if you want to understand why the architecture was designed this way — particularly [How the volunteer device pool works](/explanation) once that page is published in Batch 7.
