---
title: Send your first scheduled SMS with SMS Mobile App
description: Schedule a one-off SMS for later today, watch the job sit pending, and confirm it fires automatically — no need to keep the dashboard open.
sidebar_position: 2
sidebar_label: Send your first scheduled SMS
slug: send-your-first-scheduled-sms
keywords: [schedule sms, scheduled sms android, sms mobile app schedule, delayed sms send, sms job dashboard]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Send your first scheduled SMS

Scheduling an SMS in SMS Mobile App means writing the message now and having your linked Android phone fire it at a chosen time, with no need to keep the dashboard open in between. The job lives in Firestore until its scheduled timestamp; your phone polls (and subscribes to) job changes and dispatches when the time arrives.

By the end of this tutorial you'll have a one-off SMS scheduled for a few minutes in the future, watched it sit in **Pending**, and confirmed it fired automatically. You'll also know where to find recurring schedules and how to cancel a queued job.

## Prerequisites

The five-minute [Get started](/tutorials/get-started-in-5-minutes) tutorial completed — you should already have a signed-in account, a linked Android device, and the experience of sending a single SMS. The Android phone needs to be powered on and online (mobile data or Wi-Fi) at the scheduled fire time. If the phone is offline at the moment of fire, the job is retried as soon as connectivity returns; if you've enabled the foreground service for batch work, the retry happens within seconds.

A second phone you can text as the recipient, ten minutes of attention spread across the schedule window, and an awareness that your carrier will charge its standard SMS rate when the message dispatches.

## Step 1 — Open the composer

Sign in to [smsapp.aoneahsan.com](https://smsapp.aoneahsan.com) and go to **Send message** (`/send-message`). You'll see the same composer you used in the previous tutorial, with a toggle that says **Send now** or **Schedule**.

## Step 2 — Switch to Schedule mode

Flip the toggle to **Schedule**. The composer reveals two extra fields: a **date** picker and a **time** picker. Both default to your local timezone — the dashboard reads it from your browser, not from your account.

Pick a time roughly five minutes from now. The minimum acceptable lead time is a couple of minutes — the dashboard rejects schedules that are already in the past or imminent (the validator surfaces a polite error rather than letting the job sit there).

## Step 3 — Compose and assign

Fill in the recipient and message body the same way you did before. Pick the device you want to dispatch from in the **Send via** picker; if only one phone is linked, it's auto-selected.

Click **Schedule**. The dashboard creates a job document under your account in the `sms_jobs` Firestore collection with `status: pending`, the chosen `scheduledAt` timestamp, the recipient, and the body. The Android app receives the live update through its Firestore subscription and stores the job in a local queue.

## Step 4 — Watch the job in the Jobs list

Visit **Jobs** (`/jobs`). Your scheduled job appears at the top of the list with status **Pending** and the human-readable scheduled time. The list also shows the device assigned, the recipient (masked except the last four digits), and the body preview.

Until the scheduled time, you can:

- **Edit** the message body or recipient
- **Reschedule** to a different time
- **Cancel** the job — moves it to status `cancelled` and your phone never fires it
- **Duplicate** to a similar job with a different recipient or time

If you walk away and close the browser, the job continues to live on the server. Your phone is the one with the obligation to fire — the dashboard is the planner.

## Step 5 — Confirm the automatic fire

When the scheduled time arrives, your linked Android phone wakes the SMS Mobile App's foreground service (if it isn't already running), the service hands the message to `SmsManager`, and the carrier receives it. Within a few seconds:

- The recipient phone shows the SMS, with your number as the sender.
- The Jobs list updates the row to status **Sent** (and to **Delivered** when the carrier reports the delivery receipt).
- The Android app's notification area shows a confirmation toast.

The whole loop typically completes inside ten seconds end-to-end. Slower carriers or congested networks can stretch that to a minute or two.

## Recurring schedules

For a daily, weekly, or custom-cadence schedule, switch the composer's **Frequency** dropdown from **Once** to a recurrence option. The dashboard records the recurrence pattern alongside the next-fire timestamp; after each dispatch the next-fire timestamp is recomputed and the job re-enters the pending state.

You can pause a recurring schedule from the Jobs list at any time, edit the recurrence, or end it on a fixed date. Cancellation removes the entire recurring chain — there's a separate **Stop after this fire** option if you want one final dispatch and then completion.

## Troubleshooting

If a scheduled job is still **Pending** several minutes after the scheduled time, the most likely cause is that the assigned phone is offline or the Android app has been killed by aggressive battery management on certain manufacturer ROMs (Xiaomi, Huawei, Oppo are common offenders). Open the Android app, confirm it has battery-optimisation permissions disabled, and the queue should drain immediately.

If the job goes straight to **Failed**, look at the failure reason in the row's expanded view. Common failures: the recipient number was blocked by the carrier, the SIM ran out of credit, or the message body exceeded the segment limit your carrier enforces. The dashboard surfaces the underlying carrier error verbatim where available.

## What you've learned

You've created a delayed SMS job, watched it sit in pending state on the dashboard, and confirmed automatic dispatch through your phone at the scheduled time without keeping the browser open. You know how to edit, cancel, and duplicate jobs, and how recurring schedules work end-to-end.

## Where to go next

For one-to-many sends with a CSV of recipients, continue to [Set up a small batch send](/tutorials/set-up-a-batch-send). For a deeper look at how the Android app actually keeps jobs alive across reboots and aggressive battery managers, see [How silent SMS works](/explanation) once those reference pages are published. For the data shape behind every job (the `sms_jobs` collection schema), see the upcoming [Firestore data model](/reference) page.
