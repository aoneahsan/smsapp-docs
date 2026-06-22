---
title: How silent SMS works on Android
description: The Android primitives behind silent-batch send — SmsManager, the foreground service, the three-phase claim cycle, and why each piece is mandatory.
sidebar_position: 3
sidebar_label: How silent SMS works
slug: how-silent-sms-works
keywords: [android silent sms, smsmanager sendtextmessage, foreground service sms, android background sms automation]
last_update:
  date: 2026-06-22
  author: Ahsan Mahmood
---

import V1Status from '@site/docs/_partials/_v1-release-status.mdx';

# How silent SMS works on Android

<V1Status />

The product's signature capability — dispatching SMS from an automation runner without a user tap per message — rests on a small stack of Android primitives wired together carefully. Each piece is independently boring; the combination is the product. This page walks through the stack from API level down to behavioural details, and explains why each part exists.

## The two-path send model

The app exposes two SMS-send paths. **UI-prompted send** uses Android's intent system to launch the system composer; the user taps **Send** once, and one message goes out. The plugin behind it is the off-the-shelf `@byteowls/capacitor-sms`. This path is friction-tolerant by design — the user is present and consents to each send.

**Silent send** uses the in-tree custom Capacitor plugin at `src/plugins/native-sms/` plus the `SmsManager` API. The runner calls into Java code (`SmsManager.getDefault().sendTextMessage(...)`), Android dispatches via the active SIM, and a `SentIntent` PendingIntent broadcasts back with success-or-failure. No system composer appears. The user does not see a per-message prompt. The phone can be locked, the app can be in the background, and the send still completes.

The choice between paths is made at build time by `VITE_SMS_SENDER_MODE`. Development builds use `mock` (no real send); production Play-Store builds use `native_silent`. The dashboard's composer surfaces a sender-mode indicator so admins and volunteers know which path is active in their build.

## Why a foreground service is mandatory

A foreground service is an Android primitive that promises the user "this app is doing visible work right now, please don't kill it." The system keeps the process alive past normal background-killing thresholds; in return, the app posts a persistent notification so the user knows the work is happening.

Without a foreground service, the runner would be at the mercy of Android's aggressive background killer. On Android 8 and later, background apps are routinely frozen, network access denied, and process killed within minutes of the user leaving the app. A 200-recipient batch that takes 35 minutes at 6/min would be terminated long before completion.

The runner registers as a foreground service (`SmsAutomationService.java`) with `foregroundServiceType="dataSync"`. The `dataSync` category matches the Play Store policy interpretation of "the work is reconciling local state with a remote backend" — which is exactly what the runner does: pull claims from Firestore, send through SmsManager, write status back to Firestore.

On Android 14 (API 34+), `FOREGROUND_SERVICE_DATA_SYNC` is the granular permission gating that specific category. We declare it alongside the older `FOREGROUND_SERVICE` permission. Forgetting either one is a hard runtime error: the service-start call throws `ForegroundServiceStartNotAllowedException` and the runner refuses to come up.

## The foreground notification

The system requires the foreground service to post a notification within five seconds of starting. The runner's notification reads:

> SMS automation running
> Pause / Stop

That notification is non-dismissible while the runner is active. Tapping it opens the in-app **Pause / Stop** screen. The runner updates the notification body in place to show progress ("Sent 47 of 200 — Failed 2"), so the user has continuous visibility.

Suppressing the notification is not an option. Even on Android 13+ where `POST_NOTIFICATIONS` is a runtime permission and the user can deny it, Android still maintains the ongoing-service slot — the service stays alive, the notification body is just hidden. That is intentional: the *fact* of foreground work happening is part of the system's social contract with the user, not just a UI affordance.

## The claim cycle

Silent-batch automation works as a series of **claims**. A claim is a recipient-level transaction with three phases.

**Acquire.** The runner queries Firestore for the next pending recipient assigned to its device, filtered by `nextRetryAt <= now`. The query is constrained by the `firestore.rules` `isBatchAssignedToCaller()` helper, which walks the (hand-unrolled, max-10) `assignedDeviceIds` array. The runner writes `claimedByDeviceId = thisDevice` and `claimedAt = now` to mark the row.

**Send.** The runner calls `SmsManager.sendTextMessage(phone, null, message, sentIntent, deliveryIntent)`. Android queues the message in the radio modem and returns immediately. The `sentIntent` is a `PendingIntent` we register that broadcasts back with one of `RESULT_OK`, `RESULT_ERROR_GENERIC_FAILURE`, `RESULT_ERROR_NO_SERVICE`, `RESULT_ERROR_NULL_PDU`, `RESULT_ERROR_RADIO_OFF`.

**Settle.** When the broadcast fires, the runner writes the result back to Firestore: on success, `status='sent'`, `sentAt=now`, `sentByDeviceId=thisDevice`; on failure, either a permanent classification (`invalid_number`, `blocked_by_user` → no retry) or a transient classification (`radio_off`, `network_throttle` → `nextRetryAt = now + backoff`). The `attemptHistory` array is appended (bounded to 5 entries by `firestore.rules`).

The cycle repeats. If the runner crashes or the device reboots mid-batch, the **recipient-reclaim service** (`src/lib/smsBatches/recipientReclaimService.ts`) detects expired claims (claim older than 5 minutes without progress) and releases them. Another device — or the same device on next start — picks them up. This is what makes the system tolerant of single-device failures.

## Rate caps inside the runner

`SmsManager` has no built-in rate-limiting. We add it. Each runner has a **per-device rate cap** (default 6 SMS/minute, max 30/minute, configurable per volunteer). The cap is enforced in process — the runner sleeps between sends to maintain the configured pace. There is no need for Firestore round-trips on every send to coordinate rates; each device limits itself, and the **per-batch rate cap** (admin-set, lives on the batch document) bounds the aggregate by capping how many devices each batch fans out to.

When the runner detects carrier-side throttling (high rate of `RESULT_ERROR_GENERIC_FAILURE` with carrier-throttle signatures), it auto-backs off to 50% of its configured rate for the rest of the batch. The throttle is sticky for the duration of the batch — even if subsequent sends succeed, we stay slow to avoid baiting the carrier again.

## Why we do not need MMS, RCS, or carrier APIs

The app does not ship MMS support, does not handle RCS, and does not integrate with carrier-side APIs. Each of those decisions is intentional.

**MMS** requires a different code path (`MmsManager`), different permissions (`SEND_MMS` if available, or the more invasive `WRITE_SMS` on older versions), and different carrier billing. The product is text-only; MMS is out of scope.

**RCS** (Rich Communication Services) is the carrier-led successor to SMS. It runs through Google Messages on Android, requires the user's device to be the default RCS client, and has no third-party send API analogous to `SmsManager`. We do not need it — SMS still works globally on every carrier, which is the actual product requirement.

**Carrier APIs** (Twilio, Plivo, Vonage) are a different product entirely: they send through cloud SIP trunks rather than through the device's own SIM. They cost per send. The whole point of the product is to use the user's own SIM, paying only the user's existing carrier rates, with no per-send markup. The carrier-API model is on a different roadmap line; see [Why Android-only](/explanation/why-android-only) for the cross-reference to a potential paid-iOS tier.

## What happens on Doze and App Standby

Android Doze (deep-sleep when stationary and unplugged) and App Standby (rare-use apps get demoted) can both pause foreground services in some carrier-modified Android builds (Xiaomi, Huawei, Oppo are the canonical examples). The runner survives standard Doze because foreground-service execution time is explicitly exempted in AOSP. The aggressive vendor variants are partially mitigated by:

- The boot-receiver (`BootReceiver.java`) re-arms scheduled jobs after a reboot or a forced doze wake.
- The `WAKE_LOCK` permission lets the runner hold the CPU long enough to drain its current batch.
- The settings page surfaces a **Disable battery optimisation for this app** deep link for vendor builds that need it.

Carrier-modified Android is not perfectly solvable. Volunteers on aggressive builds may see their devices flagged for missed claims; the auto-flag-clear logic in `sms_devices` lets them recover without admin intervention.

## What this means for users

If you are a user composing a batch, none of this needs to be in your head. Hit **Send**, watch progress update in the dashboard, get notified when the batch completes. If you are a volunteer, the foreground-service notification is your only visible touchpoint — pause it whenever you want, stop it when your day starts. If you are an operator debugging a stuck batch, the [Handle failures and partial sends](/how-to/admin/handle-failures-and-partial-sends) recipe shows the four failure-cluster patterns and how to interpret them.

The stack is intentionally boring once you know what each layer does. The interesting part is that it works.
