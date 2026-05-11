---
title: Why SMS Mobile App is not a default SMS handler
description: The deliberate choice to stay send-only — what becoming a default SMS handler would unlock, what it would cost, and why send-only is the right scope for the product.
sidebar_position: 8
sidebar_label: Not a default SMS handler
slug: not-a-default-sms-handler
keywords: [default sms handler android, why not default sms app, send only sms app, replace messages app]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Why SMS Mobile App is not a default SMS handler

Android allows an app to register itself as the **default SMS handler** — the app the system routes incoming SMS to, the app that owns the Messages tile on the home screen, the app that handles MMS and RCS. SMS Mobile App could become that app. We deliberately do not. This page explains the trade and why send-only is the correct scope for what we are building.

## What "default SMS handler" means in concrete terms

Becoming the default SMS handler is a one-time installation prompt followed by a permanent system state. After the user grants it, Android routes every incoming SMS, every MMS, every RCS conversation, every group chat to your app. Your app owns the **read inbox**, the **incoming notification**, the **conversation list**, the **MMS attachments**, the **group chat semantics**, and the **carrier-side message threading**. The user's Messages app is bypassed entirely until the default is revoked.

The Android permission set required to be the default handler is large. `RECEIVE_SMS`, `READ_SMS`, `WRITE_SMS`, `RECEIVE_MMS`, `READ_MMS`, `WRITE_MMS`, `RECEIVE_WAP_PUSH`. The Google Play **Permissions Declaration** rules for these permissions are stricter still — apps that request them must be reviewed under the explicit "default SMS handler" use case, not a generic "send-only" declaration.

The Play Store's stated guidance is that an app should request these permissions only if it intends to **replace the user's primary SMS experience**. Apps that request them for narrower use cases (auto-reply bots, two-factor auto-fill helpers, marketing tools) are rejected.

## What becoming the handler would buy us

Two things, technically:

**Programmatic send without the `SEND_SMS` Permissions Declaration gate.** Default handlers can send through Android's `Telephony.Sms.Inbox` provider with simpler permission semantics. The current `SEND_SMS` permission would still be needed, but the Permissions Declaration would shift to the "default handler" track, which is procedurally clearer.

**Access to the full message lifecycle.** We could read delivery receipts directly from the inbox, correlate them to outgoing batches automatically, and offer features like "reply auto-handling" or "incoming-message-as-trigger" workflows that the send-only product cannot.

That is the entire upside. The downside is much larger.

## What becoming the handler would cost

Five concrete costs, in roughly descending order.

**Scope explosion.** Default handlers must implement the full Messages app. The list of features the system *requires* of a default handler (and the user *expects* of one) includes: a complete conversation-list UI; per-thread message view with all senders and recipients; MMS image, video, audio attachments; group MMS thread management; RCS feature support where the carrier offers it; SIM-selection per outgoing message; emergency-services routing (911 / 112 / 999 short codes); carrier-controlled OTA configuration messages; visual-voicemail integration on carriers that use SMS for VVM. Each of those is a sub-app worth of work. We would be building Google Messages from scratch.

**Privacy posture inverts.** The current product is honest about a narrow data scope: we read no incoming SMS, no MMS, no call log, no inbox. Becoming the default handler means we *must* read every incoming message the user receives — that is what being the default handler means. The privacy policy would need to declare full inbox access. The Data Safety form would need to list every category. Users who installed the product because of the minimal-scope claim would feel deceived.

**Permission review risk balloons.** The Permissions Declaration for a default handler has been the source of repeated, well-documented rejections of SMS apps across the Play Store. Our current narrow declaration ("send-only productivity tool with rate caps and fair-use") has survived multiple submission cycles. The default-handler declaration is reviewed against a much higher bar — "are you actually trying to replace Google Messages?" — and the honest answer is no, we are trying to send automated batches. The mismatch between the declared intent and the actual intent would fail review.

**Carrier and OEM testing burden grows by an order of magnitude.** Default handlers must be tested against every major carrier's anti-spam thresholds, every MMS configuration variant, RCS rollout state per carrier (some have RCS, some are migrating, some opted out), every OEM Android customisation (Samsung, Xiaomi, Oppo, Huawei, OnePlus, Pixel — each has its own SMS UX overlay that interacts with default-handler apps differently). The matrix is large enough that a single-developer product cannot cover it well.

**User trust risk increases.** The bigger the surface area we own, the bigger the responsibility. A bug in the send-only path costs one user one message. A bug in the default-handler path can mute a user's incoming message notifications for weeks (until they notice and switch the default back), and they will (correctly) blame us for it.

## What we keep by staying send-only

The send-only scope is not just a cost-saving measure; it produces a better product on several axes.

**The product is composable with the user's existing setup.** A user with Google Messages, Samsung Messages, or any other SMS app keeps that app for their normal conversations. SMS Mobile App handles their automated batches. The two coexist; the user is not forced to give up the familiar inbox UX.

**The mental model is small.** "This app sends SMS. It does not read SMS." The volunteer's mental model is the same: "My phone is dispatching messages. It is not reading anyone's incoming traffic." Both can be explained in one sentence, and both are true.

**The permission set is small.** `SEND_SMS` plus six standard permissions is a tight surface. The audit story for [Google Play SMS-permission policy](/explanation/google-play-sms-policy) is short and honest.

**The Play Store review surface is small.** We are one declaration on the Permissions form; default handlers are five permissions plus a full UX review. Less to defend.

**The codebase is small.** The send-only path is `SmsManager.sendTextMessage` + a foreground service + Firestore. A default-handler path is all of that plus the entire conversation-management subsystem. Less to maintain.

## What users with default-handler-shaped problems should do

If a user genuinely needs a default SMS handler with automation, they should install **Google Messages, Samsung Messages, or another mainstream SMS app** as their default, and use **SMS Mobile App alongside it for the automation part**. The two apps do not conflict — the user's default keeps handling incoming SMS and per-message replies, while SMS Mobile App handles batches and schedules. This is the supported use pattern.

For users who want auto-reply, auto-forward, or read-receipt-driven workflows: those are default-handler features and require a default-handler app. SMS Mobile App will not be that app. The right tool for those workflows is one of the dedicated automation tools that *is* willing to take on the default-handler scope (Tasker + an SMS plugin, or a paid commercial product).

## How the boundary is reinforced

The boundary is enforced in three layers.

**Manifest.** The merged AndroidManifest pre-flight audit (referenced in [Permissions reference](/reference/permissions)) explicitly denies `READ_SMS`, `RECEIVE_SMS`, `WRITE_SMS`, MMS-family permissions, and the WAP-push permission. A Capacitor plugin upgrade that adds any of them blocks the AAB build.

**Policy declaration.** The Permissions Declaration form on Play Console states explicitly that the app is **not a default SMS handler**. Submitting a build that contradicts the declaration is a guaranteed rejection.

**Code review.** Pull requests that touch the `android/` directory are reviewed against the permission boundary. The CI gate that runs the manifest audit is the safety net under code review.

## The honest framing

The product description on the Play Store and the marketing site is precise: "Send SMS at scale from your own SIM. We do not read your inbox." That sentence is the entire positioning. Becoming the default handler would invalidate the second half — and that half is half the reason people install the app.

Being the default handler is a different product. We are not building that product. We are building this one.

## Reading further

The full permission story is in [Permissions](/reference/permissions). The Play Store compliance posture is in [Google Play SMS-permission policy](/explanation/google-play-sms-policy). The privacy boundaries are in [Privacy and data handling](/explanation/privacy-and-data-handling). The send mechanics are in [How silent SMS works](/explanation/how-silent-sms-works).
