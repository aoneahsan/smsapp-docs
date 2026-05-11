---
title: How to handle batch failures and partial sends
description: Diagnose why a batch finished partial, decide whether to retry, fix the source, or salvage the remaining recipients into a new batch. Covers four failure-cluster patterns.
sidebar_position: 5
sidebar_label: Handle failures and partial sends
slug: handle-failures-and-partial-sends
keywords: [partial sms batch, sms batch failures, sms recovery, sms mobile app diagnostics, batch salvage]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Handle batch failures and partial sends

A "partial send" is a batch that completed (no more pending recipients, every row reached a terminal state) but where some rows landed in `failed` rather than `sent`/`delivered`. The right response depends on why the rows failed, and the four characteristic failure-cluster patterns each point to a different fix.

This recipe covers how to read the failure distribution, the four patterns, the decision tree for each, and the **Salvage** workflow that creates a follow-up batch from the failed recipients of a previous one.

## Prerequisites

A completed or in-flight batch with at least some failures. The [Monitor job + batch progress](./monitor-job-progress) recipe covers the live view; this one picks up where monitoring identifies "something's wrong, what now?".

## Read the failure distribution

Open the batch detail at `/batches/<id>` and filter the recipient table by **Status = Failed**. The dashboard surfaces a small failure-distribution summary at the top of the filtered view:

- **By error code** — `SMS_ERROR_NO_SERVICE: 47 rows; SMS_ERROR_GENERIC_FAILURE: 12 rows; SMS_ERROR_FDN_CHECK_FAILURE: 3 rows; ...`
- **By device** — `Pixel 8: 52 rows; Galaxy A54: 10 rows`
- **By recipient region** — `US (+1): 8 rows; PK (+92): 47 rows; UK (+44): 7 rows`
- **By time window** — `14:00-14:15: 35 rows; 14:15-14:30: 27 rows`

A glance at these four cuts usually tells you which of the four patterns below applies.

## Pattern 1: Concentrated on one device

**Symptom:** 80%+ of failures are dispatched by a single device. Other devices in the same batch succeed at normal rates.

**Likely cause:** That device's SIM is throttled, the SIM is out of SMS balance, the device's foreground service was killed by aggressive battery management, or the device went offline mid-batch and the live subscription stalled.

**Fix:** Open the device's detail page, confirm last-seen is recent. Check the SIM has balance. Disable battery optimisation. Reassign the failed recipients to a healthier device via **Reassign pending** (covered in [Assign a batch to volunteer devices](./assign-a-batch-to-volunteer-devices)). Manually retry the failed rows from the affected device after fixing the root cause.

## Pattern 2: Concentrated on one region

**Symptom:** 80%+ of failures share a country code. The other regions in the batch succeed at normal rates.

**Likely cause:** Your dispatching SIM doesn't have an active roaming agreement with the target region's carriers, the target region's carriers have specific anti-spam rules your sender SIM is tripping, or the target region requires sender-ID registration that you haven't completed.

**Fix:** This is rarely an in-app fix — you need a different SIM (one with international SMS), a registered sender ID (regulatory-compliance work outside the app), or to accept that some regions need a different transport mechanism. The dashboard surfaces the carrier's error message verbatim where available; that's the diagnostic anchor.

## Pattern 3: Concentrated in a time window

**Symptom:** 80%+ of failures happened in a narrow time window (10-30 min); rates before and after were normal.

**Likely cause:** A carrier-side outage, a regional cell-tower congestion event, or a brief throttling pulse that auto-backoff didn't catch fast enough.

**Fix:** Wait for the window to pass, then manually retry the failed rows. The dashboard's **Retry failed** button on the batch detail filters by failure status and queues all of them for one fresh attempt. Most will succeed second time around.

If the same pattern repeats at the same time daily (e.g. peak-hour throttling on a budget carrier), shift your batches outside peak hours. The dashboard's **Schedule a recurring SMS** flow ([recipe](/how-to/sending-sms/schedule-a-recurring-sms)) lets you fire at quieter hours.

## Pattern 4: Concentrated on a few specific recipients across many batches

**Symptom:** Same handful of recipients fail in batch after batch, regardless of device, SIM, or time. Their numbers look syntactically valid.

**Likely cause:** Those recipients have blocked your sender number, have deactivated their phone numbers, are landlines (which can't receive SMS in many regions), or are flagged in carrier-side blacklists as do-not-contact.

**Fix:** Remove the persistent-failure recipients from your source list. The dashboard's **Failures → Persistent** view (across all your batches) lists recipients that failed in 3+ batches with the same error code; you can bulk-export and remove from your CRM/spreadsheet.

There is no in-app way to override a recipient-side block. The recipient owns that decision.

## The Salvage workflow

Once you've identified the cause and decided you want to retry the failed recipients in a new batch — perhaps with different rate caps, different devices, or after fixing the recipient list — use **Salvage**:

1. Open the failed batch's detail at `/batches/<id>`.
2. Click **Salvage failed → New batch**.
3. The dashboard pre-fills a new batch with:
   - **Recipients** — only the failed rows from the source batch (you can further trim them in the next step)
   - **Body** — same as source
   - **Device assignment** — auto-assigned fresh to currently-eligible devices
   - **Rate cap** — defaults to the source batch's rate, with a banner suggesting lowering by 50% if Pattern 3 (time-window) was detected
4. Edit any of the prefilled fields, then fire as a normal new batch.

The salvage batch is fully independent of the source — it has its own batch ID, its own audit trail, its own dispatch history. The source batch retains its original failure record.

## When retry is the wrong fix

Three failure patterns mean retry won't help:

- **Permanent recipient blocks** — re-dispatch will fail the same way. Remove from source.
- **Invalid number format that somehow passed validation** — fix in your CSV; rerunning the same invalid number is wasteful.
- **Sender-reputation issues** — if all your batches across all regions show declining success rates over weeks, your sender number's reputation has degraded with carriers. The fix is a new sender (different SIM), not more retries.

The [Retry failed messages](/how-to/sending-sms/retry-failed-messages) recipe covers the manual retry button itself; this recipe covers when to reach for it vs. salvage vs. accept the failures.

## Common errors

If **Salvage** is greyed out, the source batch isn't yet complete — wait for all pending rows to resolve before salvaging. Salvage of an in-flight batch is intentionally blocked because it would race with the still-dispatching rows.

If the salvage batch's auto-assignment picks the same problematic devices as the source, manually override the assignment (covered in [Assign a batch to volunteer devices](./assign-a-batch-to-volunteer-devices)). Auto-assignment doesn't have visibility into which devices caused failures in past batches.

If the failure-distribution summary is empty even though you see failed rows, the rows may have failed before the carrier returned a parseable error (network drop, SmsManager exception). The "Notes" column on each row falls back to the OS-level exception text in that case.

## Where to go next

For the design reasoning behind the 10-device fan-out cap that affects salvage assignment options, continue to **Enforce the 10-device cap**. For the upstream rate-cap configuration that may have prevented these failures, see [Configure rate limits](./configure-rate-limits).
