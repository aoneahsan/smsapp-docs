---
title: How to schedule a recurring SMS
description: Set up daily, weekly, or custom-cadence SMS jobs that fire automatically. Covers next-fire computation, pause/resume, end-conditions, and timezone behaviour.
sidebar_position: 5
sidebar_label: Schedule a recurring SMS
slug: schedule-a-recurring-sms
keywords: [recurring sms, scheduled sms android, daily weekly sms, cron sms, sms mobile app recurrence]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Schedule a recurring SMS

A recurring SMS fires the same message on a repeating cadence — daily reminders, weekly check-ins, monthly invoice nudges. The dashboard records the recurrence pattern alongside the next-fire timestamp; after each successful dispatch the next-fire is recomputed and the job re-enters the pending queue.

## Prerequisites

A signed-in account with at least one linked Android device. A clear recurrence pattern in mind — daily, weekly on specific weekdays, monthly on a specific date, or a custom cron-style expression. Carrier rate awareness, because a daily SMS sent to many recipients across a year adds up fast.

## Choose a cadence

The composer's **Frequency** dropdown offers:

- **Once** — single fire at the chosen date/time, then complete. Covered in [Send your first scheduled SMS](/tutorials/send-your-first-scheduled-sms).
- **Daily** — fires every day at the chosen time.
- **Weekly** — fires on selected weekdays at the chosen time. Picking three weekdays (Mon, Wed, Fri at 9am) fires three times per week.
- **Monthly** — fires on a specific day-of-month (e.g. the 15th at 10am). Months without that day-of-month (Feb 31st) skip cleanly.
- **Custom** — accepts a cron-style expression for power users (`0 9 * * MON-FRI` fires weekdays at 9am).

Pick the simplest option that captures your pattern. Custom expressions are tested against your timezone — see the timezone section below for the exact semantics.

## Create a recurring schedule

1. Open `smsapp.aoneahsan.com/send-message`.
2. Compose the recipient + body as usual. For recurring sends to many recipients, switch to the batch creator at `/batches/new` instead — recurring works for both single and batch.
3. Set **Send mode** to your preference (UI-prompted for single, silent for batch — see [Send a silent batch SMS](./send-a-silent-batch-sms) for the trade-offs).
4. Change **Frequency** from **Once** to your chosen pattern. The composer reveals the parameters specific to that pattern: weekday picker for Weekly, day-of-month picker for Monthly, expression input for Custom.
5. Set the start date/time (when the first fire happens) and optionally an end condition — **Run forever**, **End after N fires**, or **End on a specific date**.
6. Save. The dashboard creates a recurring `sms_jobs` document with `recurrence: { ... }` and `nextFireAt: <ISO timestamp>`.

## What happens on each fire

The first fire is exactly like a single scheduled send: the assigned Android phone receives the job through the live Firestore subscription, the foreground service dispatches the SMS (or opens the system composer for UI-prompted), and the result syncs back.

After a successful fire, the dashboard recomputes `nextFireAt` based on the recurrence pattern, the job re-enters status `pending`, and the cycle repeats. The job's history (visible on the **Jobs → Detail** page) shows every past fire with its timestamp and outcome.

After a failed fire, the dashboard retries per the retry policy (see [Retry failed messages](./retry-failed-messages)), then computes the next scheduled fire normally — a failed fire does not delay the recurrence schedule.

## End the recurrence

Three ways to stop a recurring job:

- **Pause** — temporarily halts future fires without deleting the job. Click **Pause** in the Jobs list. To resume, click **Resume**; the next fire is whatever the recurrence pattern computes from "now".
- **End after this fire** — runs one more fire and then completes. Useful for graceful sunset.
- **Cancel** — removes the recurrence immediately, no further fires. The job moves to `status: cancelled` and disappears from the active Jobs list (it remains in the history).

## Timezone behaviour

Recurrence times are interpreted in the timezone you saw in the composer when you created the schedule, which defaults to your browser's local timezone. The dashboard records the timezone explicitly in the recurrence document — switching browsers or moving across timezones does not shift the fire time.

If you scheduled a job in `Asia/Karachi` (UTC+5) for 9am, that job will fire at 9am Karachi time regardless of where the Android device is physically located. The device-side scheduler reads the recurrence's timezone, computes the absolute UTC time, and fires when the system clock crosses it.

Daylight Saving Time is handled correctly for timezones that observe it — `America/New_York` 9am will be UTC-5 in winter and UTC-4 in summer, with the actual fire time staying anchored to local 9am.

## Custom cron expressions

For schedules the dropdowns can't express, **Custom** accepts a 5-field cron expression:

```
┌─ minute (0–59)
│ ┌─ hour (0–23)
│ │ ┌─ day of month (1–31)
│ │ │ ┌─ month (1–12 or JAN-DEC)
│ │ │ │ ┌─ day of week (0–6 or SUN-SAT)
│ │ │ │ │
0 9 * * MON-FRI       → weekdays at 9am
0 10 1 * *            → 10am on the 1st of every month
0 9 * 1,4,7,10 *      → 9am every day of Jan, Apr, Jul, Oct
*/30 9-17 * * MON-FRI → every 30 min during 9–5 weekdays
```

The composer's preview shows the next 5 fires for your expression so you can sanity-check it before saving.

## Common errors

If a recurring job stops firing without any explicit pause/cancel, the most likely cause is the assigned device being offline or killed by aggressive battery management. The job's history will show no failure events — the device just stopped picking up jobs. Open the Android app, confirm a recent last-seen, disable battery optimisation if not already.

If a Monthly-on-the-31st schedule "skips" months, that's correct behaviour for months with fewer than 31 days. The dashboard explicitly skips rather than rolling forward to the 1st of the next month, which would surprise users in February.

If a Custom cron expression fires at the wrong time, double-check the timezone — composing the expression in one timezone and then expecting it to fire in another is the most common cron mistake.

If you scheduled `0 0 1 1 *` (midnight on New Year's Day) and the dashboard reports no upcoming fires, the schedule is too far in the future for the next-fire preview window. The dashboard surfaces the next 5 fires for the next 12 months; a yearly schedule shows the next 5 years.

## Where to go next

For the carrier-side error handling that catches transient failures across many fires of a recurring schedule, see **Retry failed messages**. For per-fire history and counters, the upcoming [Firestore data model](/reference) reference page covers the schema.
