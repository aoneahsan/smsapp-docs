---
title: How to assign a batch to volunteer devices
description: Fan a batch's recipients across multiple linked phones. Covers manual vs automatic split strategies, rebalancing in-flight, and the 10-device hard ceiling.
sidebar_position: 2
sidebar_label: Assign a batch to devices
slug: assign-a-batch-to-volunteer-devices
keywords: [sms batch assignment, volunteer devices sms, fan out batch sms, multi-device sms send, sms mobile app device split]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Assign a batch to volunteer devices

A batch with 1,000 recipients dispatched from a single Android phone at the default 6 messages/min takes nearly three hours to complete. Fanning the same batch across 5 phones cuts that to roughly 35 minutes. This recipe covers how to split a batch's recipients across multiple devices, when manual vs automatic assignment makes sense, and the 10-device hard cap that prevents a single batch from monopolising the volunteer pool.

## Prerequisites

A batch in the **Assign devices** step of the creator at `/batches/new` (see [Send a silent batch SMS](/how-to/sending-sms/send-a-silent-batch-sms) for the flow up to this point). At least two devices eligible for the batch: your own linked devices, devices belonging to authorised secondary accounts (org members, co-signed friends), and devices currently opted-in to the volunteer pool.

## See eligible devices

The **Assign devices** step shows a table of every eligible device with its current status:

- **Device name + model** (e.g. `Ahsan's Pixel 8`)
- **Owner account** (your account, or the account that authorised you)
- **Volunteering** badge (only opted-in devices are eligible for non-owned batches)
- **Last seen** (devices inactive > 15 minutes are flagged amber)
- **Current load** (number of jobs already in this device's queue)
- **Per-device rate cap** (the ceiling the device's owner set)

The list is sorted by load ascending then last-seen descending — fresh idle devices appear at the top. Filter by owner account if your eligible-device list is long.

## Automatic assignment (recommended default)

Click **Auto-assign**. The dashboard splits your recipient list across eligible devices using a weighted strategy:

- Devices with higher per-device rate caps get proportionally more recipients (a 12/min device gets twice as many as a 6/min device, so all devices finish at roughly the same time).
- Devices currently in flight on other batches get fewer (or zero) recipients in this batch to keep them from over-committing.
- Devices flagged amber (no recent check-in) are excluded unless you explicitly tick **Include offline devices** — those would just stall the batch.

The dashboard caps the auto-assignment at 10 devices regardless of how many are eligible (see [Enforce the 10-device cap](./enforce-the-10-device-cap)). It picks the 10 with the highest combined freshness × rate-cap score.

Auto-assignment is the right default for almost every batch. Use manual assignment only when you have a specific reason to override the dashboard's choice.

## Manual assignment

Click **Manual assign**. The table becomes selectable; tick the devices you want to include, leave the rest unticked. The dashboard shows the resulting split:

- **Total recipients** — your batch size
- **Eligible devices selected** — N of M
- **Estimated time to completion** — based on the slowest selected device's rate cap and its allocated slice
- **Allocation per device** — the recipient count assigned to each phone

You can override the allocation per device by clicking the **Edit** column on any row. The recipient counts must sum to the total batch size; the dashboard rebalances the others to compensate if you change one.

Pick manual assignment when:

- A specific device has a fresh SIM with a high-rate-tolerance carrier and you want it to take a larger slice.
- A specific device is on a low-allowance plan today and you want it to take a smaller slice (or none).
- You're testing batch behaviour and want a single specific phone to handle the whole batch for diagnostics.

## Reassign in-flight

After a batch has fired, you can reassign **pending** (not-yet-dispatched) recipients to different devices:

1. Open the batch's **Detail** page (`/batches/<id>`).
2. Click **Reassign pending**.
3. Pick the new device(s) — the same selector as initial assignment.
4. Confirm.

The dashboard moves the pending child jobs to the new device(s). In-flight jobs (handed to `SmsManager` but not acknowledged) and completed jobs (sent or failed) are untouched.

This is the right escape hatch when a device assigned at fire time has gone offline or hit carrier throttling, and you want the rest of the batch to finish faster on a healthier device.

## What the device sees

When a batch is assigned to a device, the device's Android app receives the slice of `sms_jobs` documents through its live Firestore subscription. The foreground service starts (or reuses an active one) and dispatches the slice at the configured rate cap. Each dispatched job updates its own status; the parent `sms_batches` document aggregates child statuses for the dashboard's summary view.

A device can hold slices from multiple batches simultaneously — the foreground service round-robins between them at the configured per-device rate cap (not per-batch). Two batches on the same device at 6/min total = 6/min combined, not 12/min.

## Common errors

If **Auto-assign** picks fewer devices than expected, the most common cause is that other batches are already in flight on the eligible devices, dragging their freshness score down. Wait for those to complete or use manual assignment to force-pick the devices you want.

If a manually assigned device receives jobs but doesn't dispatch them, the device is online (Firestore subscription would otherwise stall) but its `SEND_SMS` permission has been revoked. Open the Android app on that device and trigger any send to re-prompt the permission, then return — pending jobs resume automatically.

If your batch is over 10 devices' worth of work and you want to use more devices, the answer is to run multiple smaller batches in sequence, not to push a single batch over the cap. See [Enforce the 10-device cap](./enforce-the-10-device-cap) for the reasoning.

## Where to go next

For the live per-recipient view that opens after assignment, continue to **Monitor job + batch progress**. For tuning the rate caps each device respects, see **Configure rate limits**. For the design reasoning behind the 10-device hard cap, **Enforce the 10-device cap** is the explicit page.
