---
title: How the volunteer device pool works
description: The opt-in default-on volunteer model behind SMS Mobile App — what your phone is doing when it volunteers, the fair-use rules, and how opt-out is designed to be one tap away.
sidebar_position: 4
sidebar_label: Volunteer device pool
slug: volunteer-device-pool
keywords: [volunteer sms device, opt-in sms pool, distributed sms send, fair use sms automation]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# How the volunteer device pool works

SMS Mobile App is free because the dispatching infrastructure is **distributed across volunteer devices** instead of being centralised on cloud-hosted SIP trunks. Every install can opt to contribute a small share of its SIM's send capacity to other users' batches in exchange for the same access to the pool itself. This page covers how the pool works, why we chose **opt-in default-on**, and what the volunteer's phone is actually doing.

## The basic exchange

The product needs SIMs to dispatch through. Without volunteer SIMs we would need to either run our own SIP trunks (paid, ongoing) or charge users per-send (paid, ongoing for them). Both break the zero-cost promise. The third option is to share: every user contributes a fraction of their SIM's daily capacity to the pool, and in return draws from the pool when they have their own batches to send.

When you sign up and opt in, your device becomes one of N possible dispatchers for other users' batches. When you compose your own batch, your batch is assigned to up to 10 other volunteers' devices (or to yours plus theirs). The fan-out is symmetric: the same matchmaking that picks devices for *their* batches picks devices for *yours*.

The model is closer to BitTorrent or Folding@home than to SaaS. You bring resources, you get resources, no money changes hands, and a small enforcement layer prevents abusers from siphoning more than they give.

## Opt-in default-on, and why that's not opt-out

When a new user registers a device, the **Participate in the send pool** preference defaults to **on**. The volunteer toggle is visible on the same screen as device registration (`/settings`), one tap away. The product surfaces a one-time welcome card on first sign-in that explains the trade and offers the same toggle.

This is opt-in default-on, not opt-out. The distinction matters: opt-out would mean the user has to discover the setting in order to escape it. Opt-in default-on means the user is shown the setting at registration time, explicitly chooses (yes by default, but they can flip the toggle right there), and can flip it again from settings whenever they want. The data flow is honest at every step.

Default-on is the right default because:

- Users who want the product want the pool to work. The pool only works if most users contribute. If we defaulted off, contribution would collapse — see every "BYOD network" that asked users to opt-in to sharing.
- Sharing a phone's spare SIM capacity is low-cost for the volunteer. A typical batch send is six messages per minute for ten minutes — sixty SMS. Most modern carrier plans include 1,000+ SMS per month, so a volunteer contributing 60 SMS once or twice a week is using ~12% of their monthly allowance. Opt-in default-on works because the cost is small enough not to matter to most users, and the value (free access to the same pool) is real.
- The first-run welcome card surfaces the choice early, with the off toggle visible. Users who don't want this are told within seconds, not weeks later when they wonder why their phone sent a stranger's appointment reminder.

## What your phone is actually doing when it volunteers

Concretely, when your device is opted-in and the automation runner is active:

It runs a foreground service (the visible "SMS automation running" notification — covered in [How silent SMS works](/explanation/how-silent-sms-works)). The service is paused by default; it starts dispatching only when an admin assigns one of your device's slots to a batch.

It dispatches **at most** the per-device rate cap you have chosen (default 6 SMS/minute, max 30/minute). The cap is volunteer-set — admins cannot override it. The runner sleeps between sends to maintain the cap.

It writes claim records and result records to Firestore as it dispatches. No batch data — recipient phone numbers, message bodies — is ever uploaded *from* your phone. Your phone is reading the batch (which the admin owns) and writing per-recipient status back. Your phone is a *dispatcher*, not a *source*.

It honours your **Pause / Stop** controls. **Pause** suspends dispatch until you resume; the foreground notification stays up so you do not forget. **Stop** releases all in-flight claims back to the pool and shuts the service down. Both controls are one-tap from the notification.

The service is **never silently active**. The foreground notification is part of Android's social contract with you, not just a UI element. If you cannot see the notification, the service is not running.

## Fairness rules

The pool has explicit fairness rules so it cannot be siphoned dry by takers who never contribute.

**Reciprocity over a rolling window.** Devices that draw heavily from the pool without contributing are deprioritised in the matchmaker. The matchmaker tracks `sentByOtherDevicesForMe / sentByMeForOthers` over a rolling 30-day window and biases assignments away from devices with a ratio above an internal threshold. There is no public public-facing number — exposing it would invite gaming.

**Hard ceilings regardless of contribution.** Even maximally-contributing devices are capped at the per-account daily / weekly volumes documented in [Quotas & limits](/reference/quotas-and-limits). The hard cap exists so single accounts cannot monopolise the pool even if their contribution stats look good.

**Health gating.** Devices with `status = 'flagged'` (auto-flagged after 5 consecutive failures, or admin-flagged for policy violations) cannot receive new assignments until the flag clears. This protects pool reliability — repeatedly-failing devices waste recipient slots that could go to healthier ones.

**Geographic and carrier diversity.** The matchmaker prefers to fan out batches across multiple carriers and country codes where possible, reducing carrier-anti-spam exposure for any single SIM. (This is a soft preference, not a hard rule — it activates only when the volunteer pool is large enough.)

## When a volunteer wants out

Opting out is two paths.

**Soft opt-out** — flip the **Participate in send pool** toggle off in settings. Your device stays registered (so you can still send your own batches) but the pool will not assign it to others' batches. New claims stop within seconds; in-flight claims (max 1 per batch per device per cycle) complete and are not refilled. This is the right path if you want to take a break, run on data instead of carrier, or save battery.

**Hard opt-out** — delete the device record from settings. Your device is removed from the pool entirely and any in-flight claims are released to other volunteers. Re-registering re-adds the device but resets the per-device contribution / draw history.

Both paths are reversible at any time. There is no penalty for repeated soft opt-outs.

## What we explicitly do not do

Volunteers do **not** see other users' recipient phone numbers in any UI surface. The numbers travel through `SmsManager` directly — they appear in the device's system SMS log because Android records every dispatched message there, but they are never shown in the SMS Mobile App UI on the volunteer's device.

We do **not** sell, share, or analyse the pool's send data with third parties beyond the analytics pipelines documented in [Privacy and data handling](/explanation/privacy-and-data-handling). Aggregate counts (how many sends per day pool-wide) are published in the marketing copy and the about page; per-volunteer or per-batch detail is not.

We do **not** allow the pool to be used for SMS that the originating user has not consented to. Every send originates from a logged-in user who composed the message and authorised the batch. The volunteer pool is the dispatching layer, not a source of senders.

## Why the pool model survives at scale

Three properties keep the pool sustainable as it grows.

**Per-device cap is small.** No single volunteer can be exhausted. The default 6/min cap means a worst-case 24-hour utilisation is 8,640 SMS — far above what any one volunteer actually sees, but well below the threshold where the volunteer's monthly plan would be depleted.

**Fan-out cap is small.** No single batch can dominate the pool. The 10-device cap (server-enforced via `firestore.rules`) means a single batch is sharing load across at most 10 SIMs at once, not all of them. The next batch can use a different set.

**Reciprocity is invisible-to-the-user.** Users do not see the ratio. They see "your batches send when assigned" and "you contribute when not your batch." The matchmaker does the bookkeeping; abuse becomes the matchmaker's problem rather than the volunteer's.

## Reading further

The on-device mechanics are in [How silent SMS works](/explanation/how-silent-sms-works). The operational levers are in [How to configure rate limits](/how-to/admin/configure-rate-limits) and [How to enforce the 10-device cap](/how-to/admin/enforce-the-10-device-cap). The privacy boundaries are in [Privacy and data handling](/explanation/privacy-and-data-handling). The compliance posture that lets the pool exist legally is in [Compliance: Google Play SMS-permission policy](/explanation/google-play-sms-policy).
