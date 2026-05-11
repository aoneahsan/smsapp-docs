---
slug: /
title: SMS Mobile App documentation
description: Official documentation for SMS Mobile App, an Android-first SMS automation app that sends from your phone's own SIM card with Firebase-backed scheduling. Free for individuals.
sidebar_position: 1
sidebar_label: Introduction
hide_table_of_contents: false
keywords: [sms automation, android sms, sim sms sender, scheduled sms, batch sms, capacitor sms, firebase sms]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

import Link from '@docusaurus/Link';

<div className="reveal-on-mount">

# SMS Mobile App documentation

**An Android-first SMS automation app that sends user-authored text messages from your phone's own SIM card.** Schedule one-off reminders, recurring sends, or batches of hundreds — coordinated by a Firebase-backed dashboard. Recipients see your real mobile number. No cloud SMS gateway. You pay only what your carrier charges for an SMS.

</div>

<div className="reveal-on-mount delay-1">

This site is the **official, comprehensive product manual**. The marketing site lives at [smsapp.aoneahsan.com](https://smsapp.aoneahsan.com); the source for these docs is public at [github.com/aoneahsan/smsapp-docs](https://github.com/aoneahsan/smsapp-docs). The product's own source remains private.

</div>

## Where to start

<div className="diataxis-grid reveal-on-mount delay-2">

<Link className="diataxis-card" to="/tutorials">
  <h3>Tutorials</h3>
  <p>End-to-end lessons. Sign in, register your Android device, send your first scheduled SMS in five minutes.</p>
  <span className="diataxis-card__when">If you're new — start here</span>
</Link>

<Link className="diataxis-card" to="/how-to">
  <h3>How-to guides</h3>
  <p>Eighteen recipes for specific tasks: send a silent batch, schedule a weekly recurring SMS, switch SIM on dual-SIM phones, handle failures.</p>
  <span className="diataxis-card__when">If you have a specific problem</span>
</Link>

<Link className="diataxis-card" to="/reference">
  <h3>Reference</h3>
  <p>Exhaustive lookup — every route, every permission, every Firestore field, every config knob, every rate-limit number.</p>
  <span className="diataxis-card__when">If you need exact details</span>
</Link>

<Link className="diataxis-card" to="/explanation">
  <h3>Explanation</h3>
  <p>Why Android-only, how the volunteer pool works, the privacy posture, the Play Store compliance runbook — design rationale in essay form.</p>
  <span className="diataxis-card__when">If you want to understand WHY</span>
</Link>

</div>

If you're not sure which one to open first, [**Get started in 5 minutes**](/tutorials/get-started-in-5-minutes) is the friendliest path.

## At a glance

| | |
|---|---|
| **Platforms** | Web dashboard, Android app, Chrome / Firefox / Edge extension |
| **SMS transport** | Native Android `SmsManager` via your SIM card. No cloud gateway. |
| **Cost** | Free for individuals. Carrier's standard SMS rate per message. |
| **Permissions** | `SEND_SMS` (required). `READ_CONTACTS` (optional, for recipient autocomplete). |
| **Auth** | Sign in with Google. |
| **Data** | Firestore for jobs, batches, devices, drafts, templates. Files via FilesHub. |
| **iOS** | Web dashboard works. Native silent send is **Android-only**. |

<div className="honest-framing">

## Honest framing — what this app isn't

A few things competitors fudge but this app is straightforward about:

- **We are not a default SMS handler.** Android reserves features like reading the inbox or replying inline for the default SMS app. SMS Mobile App is purposely a sender, not a replacement messaging app.
- **Carrier rates still apply.** "Free" means we don't charge per message. Your carrier still does.
- **iOS is a web-dashboard experience only.** iOS does not expose a programmatic SMS sender; the actual sending happens on Android devices.
- **The volunteer device pool is opt-in default-on.** Read [How the volunteer device pool works](/explanation/volunteer-device-pool) before you fire a batch — it explains who actually dispatches each message when you click Send.

</div>

## Built by

The product, the docs, and the Android plugin behind silent send are all written and maintained by **[Ahsan Mahmood](/about)** — a senior software engineer focused on cross-platform mobile and web (React, Capacitor, Firebase). [Portfolio](https://aoneahsan.com) · [LinkedIn](https://linkedin.com/in/aoneahsan) · [GitHub](https://github.com/aoneahsan) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com).

If these docs help, the kindest thing you can do is link to them from your own writing — backlinks are how this small project becomes findable.
