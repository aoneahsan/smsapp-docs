---
title: How to configure rate limits per batch, per device, and per account
description: Tune the three-layer rate-limit system so batches dispatch fast enough to be useful but stay below carrier anti-spam thresholds. Covers ceilings, floors, and auto-backoff.
sidebar_position: 4
sidebar_label: Configure rate limits
slug: configure-rate-limits
keywords: [sms rate limit, messages per minute sms, carrier throttling, sms mobile app rate cap, anti-spam sms]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Configure rate limits

The product enforces rate limits at three layers. The per-batch rate (chosen by the batch creator) is the desired pace. The per-device rate cap (set by the device owner) is the ceiling the batch can ask for from that phone. The per-account ceiling (a fair-use boundary) is the ceiling the device-owner can ever set. Plus, when carrier-side throttling kicks in, the dispatcher auto-backs-off underneath all three.

This recipe walks through each layer, when to change it, and how the auto-backoff catches the cases where the configured rate turns out to be too aggressive at dispatch time.

## Prerequisites

A signed-in dashboard session. Awareness that "rate" here means messages-per-minute, not total daily volume — total daily volume is a separate fair-use threshold covered in [Enforce the 10-device cap](./enforce-the-10-device-cap). A batch in flight or in the creator at `/batches/new`.

## Layer 1: Per-batch rate

The per-batch rate is the dispatcher's *target* messages-per-minute for this specific batch on each assigned device. Set during batch creation in the **Assign devices** step (`/batches/new`); editable while the batch is paused; immutable while in flight.

Default per-batch rate is 6 messages/min. The dashboard shows this as `1 message every 10 seconds` for clarity. Click **Edit** to change; valid range is 1/min (one every minute) to 60/min (one every second).

Pick the per-batch rate based on:

- **Carrier tolerance.** Consumer SIMs from major carriers usually tolerate 6–15/min without throttling. Bulk-tariff SIMs and short-code-equipped SIMs go higher (some up to 60/min on premium tiers).
- **Recipient tolerance.** A batch reaching the same recipient family multiple times in a minute (test runs, sloppy CSV with duplicate variants) trips both carrier and recipient-side perception of spam.
- **Time pressure.** A 1,000-recipient batch at 6/min runs ~3 hours. At 12/min it runs ~1.5 hours. Trade time vs throttling risk.

## Layer 2: Per-device rate cap

The per-device rate cap is the ceiling the device owner has set on `Devices → [device] → Edit rate cap`. The dispatcher cannot exceed this regardless of what any batch's per-batch rate asks for.

Why this exists: a volunteer device's owner has direct skin in the game — their carrier, their bill, their phone's battery. The device owner gets the final say on how hard their phone can be worked. A batch creator targeting a volunteer device cannot override this; the dispatcher silently clamps the effective rate to the lower of (batch rate, device cap).

The dispatcher records when it clamps. The batch detail's per-recipient view shows the *effective* rate it actually dispatched at, which may be below the batch's chosen rate if the device cap was the binding constraint.

To change your own device's rate cap, see [Manage volunteer pool participation](/how-to/auth-and-devices/manage-volunteer-pool-participation). To raise a per-device cap above the default 6/min ceiling, you need an account-level allowance (Layer 3 below).

## Layer 3: Per-account ceiling

The per-account ceiling is the maximum per-device cap any device on your account can set. Default is 15/min for new accounts. Above 15/min requires a fair-use review — the account-level setting is editable on `/admin/account → Rate-cap ceiling` (admin role required), but values above 15/min are gated behind a manual review.

The review process:

1. Open `/admin/account/request-higher-rate`.
2. Fill in the requested ceiling (e.g. 30/min) and a short justification (your carrier-side bulk-SMS contract, your test data showing consistent success at this rate, your documented use case).
3. Submit. The review queue is processed manually within 1-2 business days.
4. If approved, the per-account ceiling is raised. You can now set per-device caps up to the new ceiling.
5. If rejected, the rejection notes explain why. Common rejection reasons: no documented carrier contract, recent fair-use violations on the account, mismatch between requested rate and recent send patterns.

This is deliberate friction. The high rates are real but not the default — they exist for users with the carrier-side support to use them responsibly.

## Auto-backoff under carrier throttling

Underneath all three configured layers, the dispatcher monitors carrier-side responses for throttling signals:

- `SMS_ERROR_LIMIT_EXCEEDED`, `SMS_ERROR_RATE_LIMITED` — explicit carrier rate-limit
- 3+ consecutive transient failures from the same SIM within 60 seconds — implicit signal
- Vendor-specific throttling codes from major carriers

On any of these, the dispatcher halves the effective rate for the affected device and shows a banner in the batch detail: **"Auto-backed off to 3/min on Pixel 8 — carrier throttling detected"**. If conditions improve (10 consecutive successes at the lower rate), the dispatcher restores the configured rate gradually.

You can override the auto-backoff in the batch detail by clicking **Restore configured rate** — useful if you know the throttling was a transient blip rather than sustained carrier behaviour.

## Practical configurations

A few worked examples for common scenarios:

- **Consumer SIM, weekly reminder to 200 recipients.** Per-batch rate 6/min, single device. Runs ~33 minutes. Default is fine.
- **Same scenario, time-sensitive (must complete within 15 min).** Per-batch rate 15/min, single device. Likely needs the device's per-device cap raised to 15 (default is 6); may need account ceiling raised if 15 isn't already permitted.
- **Bulk-tariff SIM, 5,000 recipients across 5 devices.** Per-batch rate 12/min per device, 5-device assignment. Runs ~17 min. Per-device caps need to be 12+, account ceiling needs to permit it.
- **Diagnostic test, single recipient, isolated device.** Per-batch rate 1/min (so you can intercept and abort if anything goes wrong). Default per-device cap is fine.

## Common errors

If the effective rate is lower than the per-batch rate but auto-backoff isn't active, the per-device cap is binding. Check the device's rate cap on `/devices/[id]`.

If raising the per-device cap is greyed out with "exceeds account ceiling", the per-account ceiling is binding. Request a higher account ceiling per the Layer 3 process.

If auto-backoff repeatedly triggers on the same device, the per-batch rate is too aggressive for that SIM in those network conditions. Lower the per-batch rate; the auto-backoff banner stops appearing.

If a batch is configured at 30/min and finishes at exactly 30/min with no failures, your carrier and account both support that rate — congratulations, but stay alert: rates that work today can trip throttling tomorrow if your carrier updates their anti-spam thresholds.

## Where to go next

For the diagnostic patterns when failures cluster at the carrier or recipient level instead of clean rate-throttle, see **Handle failures and partial sends**. For the design reasoning behind the 10-device hard cap that sits alongside these rate caps, see **Enforce the 10-device cap**.
