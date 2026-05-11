---
title: How to retry failed SMS messages
description: Understand the automatic per-recipient retry policy, trigger a manual retry, and identify failures that need recipient-list or message changes rather than a re-send.
sidebar_position: 6
sidebar_label: Retry failed messages
slug: retry-failed-messages
keywords: [retry sms send, sms failed messages, carrier error sms, sms mobile app retry, transient sms failure]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Retry failed SMS messages

SMS sometimes fails — congested cell towers, momentarily-disconnected phones, transient carrier errors. The dashboard distinguishes between **transient** failures (worth retrying automatically) and **permanent** failures (the recipient is invalid, the message is blocked, retrying won't change anything), and applies a per-recipient retry policy that handles the transient class without manual intervention.

This recipe covers the automatic policy, the manual retry button for the cases the automatic policy gave up on, and the diagnostic columns that tell you which failures need a different recipient list rather than a re-send.

## Prerequisites

A signed-in dashboard session. Awareness that retries consume carrier-side SMS allowance same as the original send — a recipient that fails twice and is retried thrice has cost you 5 SMS at your carrier's rate, not 1.

## How the automatic retry policy works

Every job document carries `retryCount` (default 0) and `maxRetries` (default 3). On dispatch failure, the dispatching device evaluates the failure code:

- **Transient codes** (`SMS_ERROR_NO_SERVICE`, `SMS_ERROR_RADIO_OFF`, `SMS_ERROR_GENERIC_FAILURE` with vendor-specific transient flags) → `retryCount` increments, the job re-enters pending with `nextRetryAt = now + backoff(retryCount)`.
- **Permanent codes** (`SMS_ERROR_NO_DEFAULT_SMS_APP`, `SMS_ERROR_FDN_CHECK_FAILURE`, vendor codes for "invalid number" / "number blocked") → the job moves to `status: failed` with no further retries.

The backoff is exponential with jitter: `30s × 2^retryCount + random(0–30s)`. First retry runs ~30s after failure, second after ~1m, third after ~2m. After `maxRetries` retries (default 3), the job is marked `failed` and the dispatching device stops trying.

The policy is per-recipient, not per-batch. One stubborn recipient does not slow down the rest of a batch.

## See current failures

1. Open `smsapp.aoneahsan.com/jobs` (or, for a specific batch, navigate to **Batches → [batch] → Detail**).
2. Filter by status **Failed** (or **Pending** with `retryCount > 0` to catch ones still cycling).
3. The list shows per-row: recipient, attempt count, last error code, last error message verbatim from the carrier (where available), and the next-retry timestamp (or **— max retries reached**).

The error message is the single most useful diagnostic — it's the carrier's own words about why the message bounced. A short list of what you'll see:

- `Generic failure` — the catch-all transient class; usually fixes itself on retry.
- `Service not available` — recipient phone was off-network at the moment of dispatch; will retry when conditions improve.
- `No such number` / `Invalid recipient` — the number is wrong (typo, decommissioned, never existed). Retrying won't help; fix the source data.
- `Message blocked by recipient` — recipient explicitly blocked your sender number. Retrying won't help.
- `Rate limit exceeded` — carrier-side anti-spam throttling. The batch auto-backs-off; you can also lower the per-device rate cap.

## Manual retry

For jobs that exhausted automatic retries but you believe could succeed now (the recipient is back online, the recipient unblocked you, the carrier outage is over):

1. Open the **Jobs** list filtered by **Failed**.
2. Tick the rows you want to retry — single, several, or **Select all**.
3. Click **Retry selected**. The dashboard resets `retryCount` to 0 and moves the rows back to `status: pending`.
4. The assigned device picks them up through the live subscription and dispatches per the rate cap.

Manual retries respect the same per-device rate cap as the original batch — selecting 50 failures and clicking Retry doesn't fire 50 SMS instantly; they queue at the rate cap.

You can also retry a specific recipient from the row's detail view: click the row, click **Retry this recipient**.

## Bulk retry across many batches

If a carrier-side outage caused failures across many of your batches in the last 24 hours, the dashboard's **Batches → Retry recent failures** action collects every recent `failed` job across all your batches and queues them for retry in one operation.

Use this sparingly — retrying 10,000 failures at once will tie up your assigned devices for hours and may re-trip the carrier throttle that caused the failures in the first place. The dashboard warns above 1,000 selected rows.

## Adjust the retry policy

The default `maxRetries: 3` is appropriate for most workloads. To change it for a specific batch:

1. Open the batch creator at `/batches/new`.
2. In **Review**, click **Advanced settings**.
3. Set **Max retries per recipient** — values from 0 (no retry) to 10 (aggressive). The dashboard surfaces a warning when set above 5, since aggressive retry on transient failures is a common way to trip carrier-side throttling.
4. Save and fire.

You cannot change `maxRetries` for an in-flight or completed batch. Set it before firing.

## When a failure means something other than "retry"

Three patterns suggest the message itself (or the recipient list) needs to change, not the retry policy:

- **Most or all failures on a single batch immediately after fire**, error `Service not available` or carrier-specific rate-limit code → carrier throttling. Lower the per-device rate cap and refire.
- **One specific recipient fails consistently across multiple batches** with `No such number` → the number is invalid. Remove from your recipient source.
- **Many recipients fail with `Message blocked by recipient`** → you're using a sender number with poor reputation, or the message body matches a carrier's spam filter. Try a different body, a different SIM, or both.

## Common errors

If the **Retry selected** button is greyed out, the assigned device is offline or none of your devices is currently eligible to dispatch (battery optimisation killed the foreground service, account paused, etc.). Open the Android app, confirm recent last-seen.

If retries succeed but the recipient still reports not receiving the SMS, the message left your SIM but the carrier dropped it silently. There's no fix at the app level — the carrier owns that pipeline. Contact carrier support if it persists for a known-good recipient.

If `nextRetryAt` is in the past but the job hasn't retried, the assigned device hasn't checked in since the timestamp passed. The retry fires whenever the device comes online and resyncs.

## What you've learned

You understand the transient-vs-permanent failure classification, the exponential-backoff retry schedule, where to find the carrier's verbatim error message for diagnostics, how to manually retry exhausted failures, and how to recognise the three patterns where retry is the wrong fix. Combined with the [send a silent batch SMS](./send-a-silent-batch-sms) recipe's rate-cap guidance, this gives you the full failure-handling story for batches.

## Where to go next

This is the last recipe in the **Sending SMS** how-to category. For admin-side controls (job creation from the dashboard, batch assignment, rate-limit configuration across devices, the 10-device cap), continue to the **Admin** how-to category once those pages ship in Batch 5. For the underlying data model (`sms_jobs`, `sms_batches`, the retry fields), see the upcoming [Firestore data model](/reference) page.
