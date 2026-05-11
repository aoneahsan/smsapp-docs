---
title: How to monitor job and batch progress
description: Watch per-recipient progress live, read the aggregate metrics, filter and export, and read the audit log entries for every dispatch.
sidebar_position: 3
sidebar_label: Monitor job + batch progress
slug: monitor-job-progress
keywords: [monitor sms progress, sms batch detail, live sms tracking, sms mobile app analytics, audit log sms]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Monitor job and batch progress

After a job or batch fires, the monitoring surfaces show what's happening in real time: which recipients are pending, sending, sent, delivered, or failed; which device is dispatching what; how the aggregate metrics roll up; and an immutable audit log of every state transition. This recipe walks through the four monitoring views and the filters available to slice them.

## Prerequisites

A fired job or batch — the monitoring views are populated by data the dispatching devices write to Firestore, which only exists once a job is in flight. The [Create a job from the admin dashboard](./create-a-job-from-the-admin-dashboard) recipe creates a job; this one watches it.

## The four monitoring views

The dashboard exposes monitoring at four levels of zoom:

- **Jobs list** (`/jobs`) — your fastest overview of every active and recent job. Each row shows status, type, recipient summary, and last update. Default sort: most recent first.
- **Batch detail** (`/batches/<id>`) — per-recipient table for one specific batch, updating live as each child job changes state.
- **Device detail** (`/devices/<id>`) — what one specific phone is currently dispatching, with the queue depth and recent throughput.
- **Audit log** (`/admin/audit`) — chronological event stream covering job creation, fires, retries, failures, manual interventions. Admin-role-gated.

You'll typically live in **Batch detail** while a batch is running and **Jobs list** between batches.

## Per-recipient live table

Open `/batches/<id>`. The recipient table is a 5-column live view:

| Column | What it shows | Updates when |
|---|---|---|
| Recipient | Phone (last 4 visible, rest masked) + personalisation row preview | Never (set at fire time) |
| Status | Pending → Sending → Sent → Delivered or Failed | Each state transition |
| Device | Which phone is dispatching this row | Initial assignment + any reassignment |
| Sent at | UTC timestamp when carrier accepted | Once on Send |
| Notes | Carrier error code + message (Failed) or delivery receipt time (Delivered) | On Failed/Delivered |

The table updates without a page refresh — the dashboard subscribes to the parent `sms_batches` document and its child `sms_jobs` so every Firestore change pushes to the table within milliseconds.

At the top, a summary bar counts **Total**, **Sent**, **Delivered**, **Failed**, **Pending**, and **In progress (sending)** with live percentages. A progress bar shows completion.

## Aggregate metrics

The summary bar at the top of every batch detail surfaces:

- **Success rate** — `(sent + delivered) / total` as a percentage.
- **Delivery rate** — `delivered / sent` as a percentage. Lower than success means carriers accepted the message but didn't confirm delivery; usually a carrier-side issue, not yours.
- **Avg time per message** — wall-clock seconds from queue entry to acknowledged sent. Useful for spotting devices throttled by their carrier.
- **Estimated time to completion** — based on the remaining pending count and the current avg-time-per-message, extrapolated.

For a finished batch, these metrics freeze at completion. For an in-flight batch, they update with every state change.

## Filtering and slicing

The per-recipient table accepts filters:

- **By status** — show only Failed, only Pending, only Delivered. The most common slice.
- **By device** — show only recipients assigned to a specific phone. Useful when one phone is misbehaving.
- **By region/country code** — filter by the leading country code of the recipient number. Useful when carrier-side issues are region-specific.
- **By body** — for batches with `{{token}}` personalisation, search the rendered body. Useful for retroactively finding "all recipients whose city was X".
- **By time** — only rows whose state changed in the last N minutes.

Filters compose. **Status = Failed AND Device = Pixel 8 AND Time = last 30 min** is a typical diagnostic slice when a specific phone has had a bad half-hour.

## Export

Click **Export** in the batch detail header. The dashboard generates a CSV with every row in the current filter view (or the full batch if no filters are active):

```csv
recipient,status,device,sent_at,delivered_at,error_code,error_message
+15551234567,delivered,Pixel 8,2026-05-11T14:32:01Z,2026-05-11T14:32:03Z,,
+15551234568,failed,Pixel 8,2026-05-11T14:32:11Z,,SMS_ERROR_FDN_CHECK_FAILURE,Invalid recipient
```

The CSV is generated client-side from the live data — no upload to a third-party service. Files up to ~100,000 rows export comfortably in the browser.

## Audit log

Admin role gives access to `/admin/audit`. The audit log records every relevant event for compliance review:

- Job creation (`job.create`)
- State transitions (`job.state_change`)
- Manual retries (`job.retry`)
- Cancellations (`job.cancel`)
- Reassignments (`batch.reassign`)
- Rate-cap changes (`account.rate_cap_change`)
- Permission grants/revokes (`account.permission_grant`, `account.permission_revoke`)

Each entry includes the actor's uid, the affected account/job, the before/after state where applicable, and a server-side timestamp. Entries are append-only — there is no UI to delete or amend an audit row.

Filter the audit log by event type, actor, affected account, or date range. Export to CSV the same way the batch detail does.

## Common errors

If the live table shows "Stalled — no updates in 5+ minutes" banner, the dashboard's Firestore subscription has dropped. Refresh the page; the subscription reattaches and the table catches up within seconds.

If a row sits in **Sending** forever (more than a few minutes), the dispatching device's foreground service was killed mid-dispatch. The retry logic catches this on next subscription reattach — the row will return to **Pending** and retry within the backoff window.

If aggregate metrics don't add up (Total ≠ Sent + Failed + Pending), you may be looking at a paused batch with rows in `cancelled` status. The aggregate counts that as a separate bucket that's hidden from the default summary.

## Where to go next

For configuring how fast each device dispatches (and how aggregate failure patterns drive rate adjustments), continue to **Configure rate limits**. For specific failure patterns and how to resolve them, **Handle failures and partial sends** is next.
