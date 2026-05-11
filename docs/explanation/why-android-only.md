---
title: Why SMS Mobile App is Android-only (and what iOS users can do today)
description: The platform constraints that made Android-only silent SMS the product's reality, what iOS users can do right now, and the conditions that would change the answer.
sidebar_position: 2
sidebar_label: Why Android-only
slug: why-android-only
keywords: [android only sms app, why no ios sms app, ios sms automation, silent sms ios alternative]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Why SMS Mobile App is Android-only

The product is **Android-only by deliberate choice**, not by accident or temporary scope cut. iOS support is not on the near-term roadmap. This page explains why — what iOS forbids, what the product would lose if we shipped a half-feature on iOS, and what iOS users can do today.

## The capability that makes the product work

Everything interesting about SMS Mobile App reduces to one capability: **dispatching a text message from an automation runner, while the screen is off, without a user tap per message**. Recurring schedules, batch sends, the volunteer device pool, retry-with-backoff — every advertised feature collapses without that primitive.

Android grants that capability through the `SmsManager` API plus the `SEND_SMS` runtime permission. The app holds a foreground service (`FOREGROUND_SERVICE_DATA_SYNC` permission, `dataSync` category), the runner pulls a claim off Firestore, calls `SmsManager.sendTextMessage(...)`, and Android delivers the message via the active SIM. The user can be asleep; the phone can be locked; the screen can be dark. The send still happens.

## What iOS does not allow

iOS does not expose any equivalent API. There is no public framework on iOS for sending an SMS from an application context. The closest available primitive is `MFMessageComposeViewController` — a system-presented composer that the user has to tap **Send** on, one message at a time. The user must be looking at the screen, the app must be in the foreground, and there is no programmatic way to bypass either constraint.

Apple does ship its own deep SMS integration (Messages app, automation via Shortcuts, iMessage-as-default for Apple-to-Apple chat), but none of it is available to third-party apps. The walled-garden distinction here is not "iOS is harder to develop for" — it is "iOS does not allow this category of app at all." A third-party iOS SMS-sending app would be one of the following: a glorified link to the system composer (not a product); a SIP-trunk relay that sends through a paid commercial gateway (not free); or a jailbreak-only tweak (not distributable on the App Store).

## What we would lose if we shipped on iOS anyway

We could ship a hollow iOS build that mirrors the dashboard, the contacts UI, the templates, and lets users compose. The user would tap **Send**, the system composer would appear, they would tap **Send** again, and one message would go out. We could call that "iOS support" and claim feature parity in the listing.

We would not do that for four reasons.

**Schedules wouldn't work.** A recurring schedule fires while the app is in the background. iOS denies the send. The schedule becomes a notification reminding the user to open the app and tap **Send** manually — that is not a schedule, that is a calendar entry.

**Batches wouldn't work.** A 200-recipient batch on iOS would require the user to stand at the phone tapping **Send** 200 times. Carriers throttle that pace; users would give up.

**The volunteer pool wouldn't work.** A volunteer phone has to dispatch without user attention. iOS volunteers contribute zero.

**The product positioning would dilute.** Marketing copy would need iOS asterisks on every feature ("works on Android; iOS requires per-message tap"). Listing reviews would judge the iOS build against the Android pitch. We would burn trust faster than we burned development hours.

A worse outcome than no iOS support is iOS support that does not deliver on the promise. The product is honest about what it is — *Android automation, including silent batch send* — and any iOS build that does not honour that promise would be deceptive.

## What iOS users can do today

iOS users can still get value from SMS Mobile App without an iOS install.

**Sign in from the web.** The dashboard at [smsapp.aoneahsan.com](https://smsapp.aoneahsan.com) is a full PWA. iOS users sign in with Google, browse templates, save drafts, view their job history, and manage their account. Everything except actually sending the messages works in Mobile Safari. iOS users also get the contact-form, blog, public sitemap, and other public-content surfaces.

**Use an Android device to run the send.** The iOS user composes on the web dashboard, the Android volunteer pool dispatches. This is the multi-device case the product was designed for in the first place — there is no requirement that the operator and the dispatching SIM be on the same physical device. An iOS user with one Android phone in the drawer has the full product.

**Opt in to admin views.** Admins on iOS get all the same dashboard views — `/admin/jobs`, `/admin/batches`, audit logs, analytics. They can monitor and orchestrate from an iPad. The dispatching happens on Android volunteer devices, but the operator can be anywhere.

The honest pitch for iOS users is: *"the app is the dashboard, and at least one Android device dispatches the actual SMS."* For a solo user with no Android device, the product is not for them — yet.

## What would change the answer

Two things would push iOS onto the roadmap.

The first would be Apple opening a vetted SMS-send API for third-party apps. There is no public signal that this is coming, but Apple has progressively opened previously-walled APIs (NFC writing, Find My network, Tap to Cash). A vetted, opt-in API with strict abuse controls is the only path. We would adopt it the day it shipped.

The second would be a meaningful market for SIP-trunk-backed iOS send. We have been clear that the free tier is zero-cost — adding a paid SIP gateway would break that. If a future enterprise tier exists with paid per-send pricing, an iOS build that uses Twilio, Plivo, or a similar provider would be feasible. That is a different product line, not a port; it would launch under a different name to avoid confusing free-tier expectations.

## A note on cross-platform technologies

The app uses Capacitor 8, which targets both iOS and Android. The web front end builds and runs on both platforms unchanged. The blocking constraint is not the cross-platform layer — it is the underlying OS capability. Capacitor faithfully reports `not_supported` from the SMS sender module when running on iOS, and the front end responds by hiding the **Send** affordance and surfacing the dashboard-only experience above.

Migrating to React Native, Flutter, native Swift, or any other stack would not change the answer. The Apple SDK boundary is the same regardless of which build tool wraps it.

## Reading the marketing carefully

If you find a third-party app on the App Store claiming "automated SMS for iOS" it is doing one of three things. It is wrapping `MFMessageComposeViewController` and lying about the tap-per-message reality. It is routing through a paid SIP gateway and charging per send (which is a different product). Or it is selling a desktop companion that drives an Android phone over USB or ADB (which is a workaround, not iOS support).

SMS Mobile App is none of those. The web dashboard is fully iOS-compatible; the actual sending is Android. That is the truth of what the product is, and Android-only is the honest label for it.

## Related reading

The Android-side capability is covered in detail in [How silent SMS works on Android](/explanation/how-silent-sms-works). The compliance posture that lets us ship the Android side is in [Compliance: Google Play SMS-permission policy](/explanation/google-play-sms-policy). The volunteer-pool model that makes the Android-side scale across iOS-and-Android operator pairs is in [Volunteer device pool](/explanation/volunteer-device-pool).
