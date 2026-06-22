---
title: How to manage volunteer pool participation
description: Inspect which accounts can target your phone, change your per-device rate cap, and opt in or out of the shared sender pool. Covers the sync between dashboard and Android app.
sidebar_position: 3
sidebar_label: Manage volunteer participation
slug: manage-volunteer-pool-participation
keywords: [volunteer device opt out, sms volunteer pool, per-device rate cap, sms mobile app participation, fair-use sms]
last_update:
  date: 2026-06-22
  author: Ahsan Mahmood
---

import V1Status from '@site/docs/_partials/_v1-release-status.mdx';

# Manage volunteer pool participation

<V1Status />

Volunteer participation controls which accounts can dispatch SMS through your phone. Newly registered devices opt in by default — only your own account can target them initially, but if you accept an organisation invite or a co-signing flow, additional accounts gain the right to assign jobs to your phone too. This recipe covers the inspection, adjustment, and opt-out of those settings.

## Prerequisites

A registered Android device (see [Register your Android device](./register-your-android-device)) and a signed-in dashboard session at `smsapp.aoneahsan.com`. Roughly two minutes per device.

## Open the device's participation panel

Go to `smsapp.aoneahsan.com/devices`. The list shows every phone registered to your account with its current participation state. Click the row for the device you want to inspect — the detail panel opens on the right (or below, on narrow screens).

The panel shows three things relevant to participation: the **Volunteering** toggle, the per-device **Rate cap** (messages per minute), and the **Authorised accounts** list (your account plus any other accounts you've explicitly allowed).

## Change the participation toggle

To pause participation, click **Stop volunteering**. The device's `participating` field flips to `false` in Firestore. The Android app receives the change through its live subscription within a few seconds; the home-screen badge changes from **Volunteering** to **Not volunteering**.

While paused, the device:

- Still receives jobs **you** create and explicitly assign to it.
- Stops receiving any new jobs from authorised secondary accounts.
- Allows any in-flight batch already running on it to complete — there's no mid-flight kill.

To resume, click **Start volunteering**. The flag flips back to `true` and the device returns to the eligible-target pool.

## Adjust the per-device rate cap

The rate cap is the maximum messages-per-minute this device will dispatch, regardless of who creates the batch. The default of 6/min is conservative and stays well below most carriers' anti-spam thresholds.

To raise it, click **Edit rate cap**, enter a new value (the per-account ceiling is enforced by Firestore rules — typical maximums depend on your account tier and recent fair-use compliance), and save. The change takes effect immediately for new jobs; in-flight jobs continue at their original assigned rate to avoid mid-batch surprises.

Lowering the cap below an in-flight rate causes the dashboard to throttle the running batch starting with the next message in the queue. There's no abrupt stop.

## Inspect the authorised accounts list

The list shows your own account at the top (always — you can't remove yourself) and any other accounts you've co-authorised. Each row shows the account's display name, email, and the date you authorised it.

To revoke an authorisation, click **Remove** on the relevant row. The other account immediately loses the ability to assign new jobs to your phone; in-flight assignments complete.

To **add** an authorisation, the other account sends you an invite from their dashboard, and you accept via an email link or the invite badge in the dashboard's notification area. There's no public "add by email" UI — every authorisation requires the other account to initiate, which prevents random invites.

## Confirm the change took effect

Open the Android app on the phone and pull down to refresh. The home screen's participation badge should match what you set on the dashboard. If the two disagree for more than a minute, sign out of the app and back in to force a session resync.

You can also verify from the dashboard's **Audit log** entry for the device — every participation change is recorded with timestamp, account, and the before/after values.

## When sync stalls

If the dashboard and the app disagree on participation status for more than a minute, the most likely cause is the Android app being put to sleep by aggressive battery management. The Firestore subscription works only while the app process is alive (the foreground service keeps it up only during active dispatch). Open the app to wake it; the subscription reattaches and resyncs in seconds.

A separate, rare class of failure is a stale browser tab — the dashboard caches the list locally and won't refresh until you navigate away and back, or hit the manual refresh icon next to the device row.

## What this enables

You now know how to pause your phone's participation for a sensitive period (a strict-quota carrier window, a low-battery road trip, a SIM-share with family), how to raise or lower the rate cap to match your carrier's tolerance, and how to manage which other accounts can target your phone for batches. Combined with [Switch SIM on a dual-SIM phone](./switch-sim-on-dual-sim), this gives you fine-grained control over what your phone is willing to do for SMS Mobile App.

## Where to go next

For the underlying design rationale behind the volunteer pool, see the [Explanation](/explanation) section's upcoming **How the volunteer device pool works** page in Batch 7. For per-batch rate-limit configuration as a creator, see the **Admin** how-to category once the **Configure rate limits** recipe ships in Batch 5.
