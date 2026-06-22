---
title: How to send a silent batch SMS (Android foreground service)
description: Dispatch many SMS without opening the system composer. Covers the foreground service, rate caps, offline queueing, and the per-recipient retry behaviour.
sidebar_position: 2
sidebar_label: Send a silent batch SMS
slug: send-a-silent-batch-sms
keywords: [silent sms android, foreground service sms, batch sms sender, sms mobile app silent send, native sms plugin android]
last_update:
  date: 2026-06-22
  author: Ahsan Mahmood
---

import V1Status from '@site/docs/_partials/_v1-release-status.mdx';

# Send a silent batch SMS

<V1Status />

A silent batch SMS dispatches without opening the device's system composer — the SMS Mobile App hands each message directly to Android's `SmsManager` API through a custom NativeSms plugin, paced by a foreground service that's visible in your notification shade. This is the right mode for batches, scheduled jobs, and any flow where opening a system composer per message is impractical.

The trade-off is that silent sends require explicit `SEND_SMS` consent (granted once during setup) and run with a visible foreground-service notification — Android requires both. You cannot send SMS programmatically in the background on Android without these two affordances.

## Prerequisites

A linked Android phone with `SEND_SMS` already granted (see [Grant SMS and Contacts permissions](/how-to/auth-and-devices/grant-sms-permissions)). Battery optimisation disabled for the SMS Mobile App, otherwise aggressive ROMs (MIUI, EMUI, ColorOS) will kill the foreground service mid-batch. A signed-in dashboard session. A prepared recipient list (CSV or contact-picker selection — see [Import contacts from a CSV file](/how-to/auth-and-devices/import-contacts-from-csv)).

## From the web dashboard

1. Open `smsapp.aoneahsan.com` and navigate to **Batches → Create batch**.
2. Upload your CSV or pick recipients from the contact directory. The validator confirms which rows pass and which were skipped.
3. Compose the message body. Use `{{column_name}}` tokens for per-recipient personalisation if your CSV has additional columns.
4. In **Send mode**, select **Silent**. The toggle defaults to silent for batches above 5 recipients; manual override is available.
5. Assign one or more devices. Each assigned device dispatches its allotted slice of recipients in parallel with the others.
6. Set the per-device rate cap. Default is 6 messages/min — conservative and below most carriers' anti-spam thresholds. You can raise it to 10–15 on accommodating SIMs; pushing past 20/min frequently trips carrier throttling.
7. Click **Fire batch**.

The dashboard writes a parent `sms_batches` document and one `sms_jobs` document per recipient, all linked by `batchId`. Every assigned device picks up its slice through Firestore's live subscription.

## What happens on each device

The SMS Mobile App receives the batch assignment, starts (or reuses) its Android foreground service, and shows a notification: **"SMS Mobile App is sending messages — N of M complete"**. The notification is non-dismissable while the batch runs; this is an Android requirement, not a UX choice.

The foreground service dispatches the first message via `SmsManager.sendTextMessage()`, waits for the rate-cap interval (10 seconds at 6/min, 4 seconds at 15/min, and so on), dispatches the next, and continues. Per-message delivery callbacks update each job's status in Firestore as the carrier responds.

When the last message in the device's slice is dispatched, the foreground service self-stops and the notification disappears.

## Why the foreground service is mandatory

Android prohibits background SMS dispatch from non-default messaging apps. Without a foreground service, a job that fires while the app is backgrounded would be killed before `SmsManager` completes. The `FOREGROUND_SERVICE_DATA_SYNC` permission paired with a visible notification is the only sanctioned path for non-default-SMS apps to do programmatic SMS work.

This is also why iOS has no equivalent feature — Apple doesn't grant a similar permission to any third-party app. Silent SMS on iOS is architecturally impossible.

## Monitor progress live

The dashboard's **Batch detail** page is a per-recipient table that updates in real time as each message ticks from Pending → Sending → Sent → Delivered. The summary bar at the top counts successes, failures, and remaining. You can walk away — the table updates whether the browser is open or not, and you can return later to see live status.

The Android app's home screen also shows the active batch's progress as a card. Tap it to see the same per-recipient list directly on-device.

## Offline handling

If the phone loses connectivity mid-batch, the foreground service pauses dispatch (it can still hand SMS to `SmsManager`, but carrier-side delivery may fail without data sync). When connectivity returns, the live Firestore subscription reattaches, pending job documents resync, and dispatch resumes from where it stopped — the queue is durable in Firestore, not in transient device memory.

For jobs created on the dashboard while the phone is offline, the same applies: jobs sit in Firestore until the phone comes back online and the subscription delivers them.

## Pause, resume, cancel

The dashboard's **Batch detail** page has three controls:

- **Pause** — stops new dispatch on the assigned devices. Already-in-flight messages (handed to `SmsManager` but not yet acknowledged) complete; nothing new starts.
- **Resume** — restarts dispatch from the first pending recipient.
- **Cancel** — marks remaining recipients as `cancelled`. They will not be retried. Already-sent recipients keep their sent status.

You can also pause/cancel a batch from inside the Android app — the device-side state syncs back to the dashboard within seconds.

## Common errors

If the batch starts but stalls partway through with no failures, the foreground service was killed by aggressive battery management. Reopen the app, confirm battery optimisation is disabled, and the queue resumes within seconds via the live subscription.

If consecutive recipients fail with carrier-side rate errors (`SMS_ERROR_LIMIT_EXCEEDED`, `SMS_ERROR_RATE_LIMITED`, or vendor-specific codes), your carrier is throttling. The dashboard auto-backs-off on detection — the per-device rate is halved and the batch continues at the slower pace. You'll see a brief banner in the batch detail explaining the back-off.

If a specific recipient never goes through after multiple retries, the carrier has blocked the number (often because it's a landline) or it's outside your carrier's roaming agreements. The dashboard records the underlying error verbatim where the carrier surfaces one.

## What you've achieved

You can now dispatch arbitrary-sized batches across one or more linked Android phones without manual per-message intervention. The foreground service makes it visible (Android requirement) and auditable (your notification shade is the live status). The offline queue makes it durable (jobs survive connectivity drops). The rate cap keeps you on the right side of carrier anti-spam thresholds.

## Where to go next

For reusable message bodies — `"Hi {{name}}, your appointment is tomorrow"` saved once and used across many batches — see **Use templates**. For batches that fire on a recurring schedule, see **Schedule a recurring SMS**. For the auto-retry semantics that catch transient carrier failures, see **Retry failed messages**.
