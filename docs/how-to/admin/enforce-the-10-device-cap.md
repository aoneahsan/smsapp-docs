---
title: How the 10-device cap is enforced and how to live within it
description: Understand the hard ceiling on devices per batch, why it exists, what fits inside it, and how to structure large workloads as multiple batches instead.
sidebar_position: 6
sidebar_label: Enforce the 10-device cap
slug: enforce-the-10-device-cap
keywords: [10 device cap sms, fair-use sms, bulk sms limit, sms mobile app cap, multi-batch workload]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Enforce the 10-device cap

The product enforces a hard ceiling: no single batch can fan out across more than 10 SIMs. The cap is checked server-side at fire time and again on every reassignment — there is no client-side toggle that bypasses it. This recipe covers what the cap is, why it exists, what fits comfortably inside it, and how to structure larger workloads as a sequence of batches instead of attempting to push one batch past the limit.

## Prerequisites

A signed-in dashboard session. A batch in mind that you think might benefit from more than 10 devices. (If your workloads currently fit in fewer than 10 devices, the cap is non-binding for you and this recipe is informational rather than operational.)

## The cap in concrete terms

A batch document's `assignedDevices` array can have at most 10 entries. The dashboard's **Auto-assign** stops at 10 even if 20 eligible devices are present. The **Manual assign** UI greys out the 11th device tick. Direct API calls (when admin tooling later supports them) fail the server-side validation with `error: device_cap_exceeded`.

The cap counts unique device IDs. Reassignment from an in-flight batch to a different device counts the new device against the cap; the freed device's slot is recovered.

The 10-device cap is independent of:

- **Rate limits** — those govern how fast each of the (up to) 10 devices dispatches, covered in [Configure rate limits](./configure-rate-limits).
- **Daily volume** — that's a separate fair-use threshold, covered below.
- **Account-level device count** — you can have 20 devices registered to your account; only 10 can serve any single batch.

## Why the cap exists

The hard cap solves three problems:

1. **Single-account monopolisation.** Without a cap, an account with 100 volunteer devices in its network could tie up the whole pool for one massive batch, leaving every other account stuck. The cap forces large workloads to be split across batches that run in sequence, giving the rest of the pool capacity in between.

2. **Carrier-side anti-spam exposure.** Each carrier monitors sender reputation per-SIM. A batch spanning 50 SIMs at once draws more scrutiny than 5 batches of 10 SIMs each, run hours apart. The cap inherently limits how broad a single batch's anti-spam signature looks.

3. **Audit-trail clarity.** A failure post-mortem with 10 dispatching devices is tractable; a post-mortem across 50 devices is not. The cap keeps the per-batch dispatcher footprint small enough to reason about.

The cap is set at 10 because empirically 10 devices is the largest practical fan-out before carrier-side anti-spam signals start kicking in noticeably (per the 3rd reason above), and because tracing a stalled batch across 11+ devices stops being useful for diagnostics.

## What fits inside the cap

At the default 6/min per-device rate, a 10-device batch dispatches 60 messages/min total. That handles:

- 600 recipients in 10 minutes
- 3,600 recipients in 60 minutes
- 28,800 recipients in an 8-hour day (a single "batch window")

At the maximum default per-device cap of 15/min, 10 devices dispatch 150 messages/min:

- 1,500 recipients in 10 minutes
- 9,000 recipients in 60 minutes
- 72,000 recipients in 8 hours

These are *theoretical* throughputs assuming no failures, no carrier throttling, and continuous availability of all 10 devices. Real throughputs are typically 70-85% of theoretical for well-tuned batches.

## How to structure workloads larger than the cap accommodates

For a one-time workload that doesn't fit in 10 devices × your account's per-device caps, split it into a sequence of smaller batches.

The pattern:

1. **Split the recipient list** into chunks of (10 × per-device rate × target duration). For 100,000 recipients with 15/min × 10-device dispatch capacity, that's 9,000 recipients per chunk per hour. So split into roughly 11 chunks for an 11-hour campaign.
2. **Schedule each chunk** at staggered start times — Chunk 1 at 09:00, Chunk 2 at 10:00, and so on. Use the [Schedule a recurring SMS](/how-to/sending-sms/schedule-a-recurring-sms) flow with **Frequency: Once** and a specific start time per chunk.
3. **Stagger device assignment** if possible. Chunk 1 uses Devices 1-10; Chunk 2 uses Devices 6-15 (with overlap); Chunk 3 uses Devices 11-20. Spreading load across more total devices across the campaign reduces per-device fatigue.
4. **Monitor each chunk** with the standard [Monitor job + batch progress](./monitor-job-progress) view. Pause subsequent chunks if Chunk N reveals systemic failures (carrier outage, bad recipient list).

The dashboard's **Campaign** feature (visible to admin role) automates this pattern — input the full recipient list, the desired duration, and the per-device rate, and it generates the chunked batch sequence with staggered start times. The Campaign UI is still the 10-device cap underneath; it just hides the chunk-splitting bookkeeping.

## What does NOT work

A short list of workarounds that get tried but don't bypass the cap:

- **Splitting one batch into two and firing both within seconds of each other.** The cap is per-batch, so this technically works but ties up 20 devices simultaneously and triggers more carrier-side scrutiny than a single 20-device batch would have. The carriers see your sender signature on 20 SIMs at once either way.
- **Pre-creating 10 batches and firing them all at once via the API.** Same outcome as above; doesn't bypass the spirit of the cap.
- **Asking secondary authorised accounts to fire batches "for you" using your devices.** They can — but each of their batches is still capped at 10 of their own eligible devices. They cannot fire onto your devices unless you've authorised participation, and even then their batch counts against your account's per-device load.

The cap is structural. Live within it; structure workloads accordingly.

## Higher caps via fair-use review

For genuinely large workloads that need higher fan-out (regulatory broadcasts, large-business customer notifications, validated bulk-SMS use cases), the fair-use review process can grant a per-account higher device cap.

Request at `/admin/account/request-higher-device-cap`. The process mirrors the rate-cap review described in [Configure rate limits](./configure-rate-limits): submit the justification, wait 1-2 business days, get approved or rejected with specific reasoning. Approved accounts can fan a single batch across up to 25 devices.

Approval is rare for new accounts and unusual for accounts without documented bulk-SMS use cases. The default 10-device cap is the right number for the vast majority of workloads.

## Common errors

If **Auto-assign** picks only 8 devices even though 15 are eligible, your eligible devices include some flagged amber (no recent check-in) which auto-assign skips. Either wait for them to come back online or use manual assignment.

If you've requested a higher device cap and it's been "Pending review" for more than 5 business days, ping the contact form on the main site — manual review is occasionally backlogged.

If a Campaign workflow's chunks have wildly different success rates, the recipient list isn't randomised. Sort the source CSV randomly before chunking; otherwise Chunk 1 might be all valid recipients while Chunk N is all expired numbers (or vice versa).

## Where to go next

This is the last admin how-to in the current docs. From here, the [Reference](/reference) section dives into the data model (`sms_jobs`, `sms_batches`, `sms_devices` field reference), the security rules that enforce the caps server-side, the analytics events, and the configuration variables — once those pages ship in Batch 6. The [Explanation](/explanation) section covers the design reasoning behind every cap, including this one, in Batch 7.
