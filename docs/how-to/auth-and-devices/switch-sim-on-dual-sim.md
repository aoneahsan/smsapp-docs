---
title: How to switch SIM on a dual-SIM Android phone
description: Set the default SIM for SMS Mobile App, override per job, and understand the OS-level fallback that controls behaviour when the in-app picker is unavailable.
sidebar_position: 6
sidebar_label: Switch SIM on a dual-SIM phone
slug: switch-sim-on-dual-sim
keywords: [dual sim sms android, switch sim sms mobile app, default sms sim, sim selector sms, multi-sim sms send]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Switch SIM on a dual-SIM phone

Dual-SIM phones expose two cellular subscriptions to Android, each with its own number, carrier, and SMS allowance. The app needs to know which SIM to use for any given send. This recipe covers the per-device default, per-job override, and the OS-level fallback Android applies when the in-app picker isn't available.

## Prerequisites

A dual-SIM Android phone with both SIMs activated and showing in **Settings → Network & Internet → SIMs** (the path varies by ROM, but every dual-SIM device has an equivalent screen). A registered SMS Mobile App device on this phone (see [Register your Android device](./register-your-android-device)). Awareness that the two SIMs probably have different carriers, different SMS rates, and different carrier-side anti-spam thresholds.

## How the SIM selection actually works

Android's `SmsManager` API lets a sending app specify a subscription ID at dispatch time. SMS Mobile App reads the `defaultSimSubscriptionId` you've configured per device, then for any given job either uses that default or applies a per-job override if one is set on the job's payload.

If neither is set, Android falls back to the system-wide **Default messaging SIM** chosen in Android Settings. If the system default is also unset (rare on dual-SIM phones, but possible on freshly set-up devices), Android picks SIM 1 as a final fallback. The behaviour is OS-controlled at that point — the app cannot force a different SIM without an explicit subscription ID.

## Set the default SIM for this device

1. Open the SMS Mobile App on your dual-SIM phone.
2. Tap **Devices** in the navigation, or open the **Device settings** card on the home screen.
3. Find the **SIM** section. The app lists both SIMs with their carrier-reported names ("Vodafone", "Jazz", "T-Mobile") and the last few digits of each number.
4. Tap the SIM you want as the default for outbound SMS from this phone. The selection persists in `@capacitor/preferences` storage and syncs to Firestore on the next online tick.
5. The dashboard's device row now shows the selected SIM's masked number — so when you assign jobs to this device from the dashboard, you can confirm which SIM will dispatch.

## Override a SIM for a single job

When composing a job from the dashboard or the Android app, the **Send via** picker shows the device, and a small **SIM** dropdown shows the available SIMs for that device. The dropdown defaults to the device's chosen default; pick the other SIM to override for this one job.

The override applies to that specific job only. A subsequent job dispatches via the device default again unless you override it again.

For a batch, the override applies to every recipient in the batch — there's no per-recipient SIM override. If you want different SIMs for different recipients, split the recipient list across two batches and assign different SIMs.

## Verify the SIM was used

After dispatch, the **Sent log** entry for the message includes the dispatching SIM (carrier name + last four digits). Cross-check against the recipient phone — the SMS arrives showing the SIM's number as the sender, which is the ground truth.

If you've enabled per-message delivery receipts at the carrier level, the receipt header lists the originating SIM number. Most carriers do this by default; some require a one-time SMS to a `*113#`-style USSD code to activate.

## What happens when both SIMs are valid but only one is provisioned for SMS

Some MVNOs (mobile virtual network operators) and data-only SIMs don't support outbound SMS. The app treats them as unavailable for SMS dispatch — they appear in the SIM list with a warning indicator and can be selected, but every send from them will fail at the carrier level with a clear error in the dashboard's failure column.

Practical effect: pick a SIM that is provisioned for SMS as your default, and use the warned SIM only when you've verified outbound SMS works on it.

## Common errors

**Only one SIM appears in the picker even though the phone has two.** Some manufacturer ROMs (older MIUI, certain BLU and budget phones) restrict the dual-SIM API to system apps only. Check **Settings → SIMs** — if both SIMs are visible there but the app sees only one, the ROM is the constraint. There's no workaround at the app level; the OS has to expose the second SIM to user-space apps.

**The chosen SIM keeps reverting to SIM 1.** Some Android battery-saver modes reset preference storage on aggressive cleanup. Disable battery optimisation for SMS Mobile App ([Grant permissions](./grant-sms-permissions) covers the path) and reapply your SIM choice once.

**Dispatch goes through SIM 1 even when SIM 2 is the chosen default.** Android's system-wide **Default messaging SIM** is set to SIM 1 and is overriding the per-app preference on a ROM that doesn't honour the subscription-ID parameter properly. This is rare but does happen on heavily customised builds. Set the system-level **Default messaging SIM** to SIM 2 in Android Settings as a workaround, or accept SIM 1 dispatch on this device.

**The dashboard's device row shows a different SIM than the app currently uses.** Sync lag — the SIM choice is local-first and pushes to Firestore on the next online tick. Pull-to-refresh the dashboard or wait a few seconds.

## What this enables

Choosing the right SIM per device and per job avoids three concrete problems: blowing through a low-SMS allowance on a personal SIM when a work SIM has a generous bundle, having recipients see a number they don't recognise, and tripping carrier anti-spam thresholds on the wrong account. With the recipe above you can split usage cleanly across both SIMs.

## Where to go next

For the broader device-management story (rate caps, volunteer pool participation), see [Manage volunteer pool participation](./manage-volunteer-pool-participation). For the underlying architecture — how the app gets a subscription ID from Android and passes it to `SmsManager` — see the upcoming [Architecture overview](/explanation) page in Batch 7.
