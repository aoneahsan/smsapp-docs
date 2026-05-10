---
slug: /
title: SMS Mobile App documentation
description: Official documentation for SMS Mobile App, an Android-first SMS automation app that sends from your phone's own SIM card with Firebase-backed scheduling. Free for individuals.
sidebar_position: 1
sidebar_label: Introduction
hide_table_of_contents: false
keywords: [sms automation, android sms, sim sms sender, scheduled sms, batch sms, capacitor sms, firebase sms]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# SMS Mobile App documentation

**SMS Mobile App is an Android-first SMS automation app that schedules and sends user-authored text messages from your phone's own SIM card, using Firebase to coordinate jobs across the web dashboard, browser extension, and Android app.** Recipients see your real mobile number; you pay only your carrier's standard SMS rate; nothing is routed through a third-party SMS gateway.

This site is the **official, comprehensive product manual**. Marketing pages live at [smsapp.aoneahsan.com](https://smsapp.aoneahsan.com). Source code for SMS Mobile App is private; the source for these docs is public at [github.com/aoneahsan/smsapp-docs](https://github.com/aoneahsan/smsapp-docs).

## What this site covers

- Every public route on the web dashboard
- Every screen in the Android app
- Every Firestore collection touched by the user-facing layer
- Every Android permission we ask for and why
- The compliance story: send-only, never a default SMS handler, no inbox, no read-SMS

## What it doesn't cover

- Internal architecture details that aren't user-visible
- Any feature that hasn't shipped — the product reflects what's running in production today
- Cloud SMS gateway integration (we don't have one — that's the differentiator)

## Where to start

The documentation is organised in four sections following the [Diátaxis framework](https://diataxis.fr/):

| Section | When to read | Style |
|---|---|---|
| **[Tutorials](/tutorials)** | You're brand-new and want to learn by doing. | A guided lesson. |
| **[How-to guides](/how-to)** | You know the product and need a recipe for one specific task. | Numbered steps, no fluff. |
| **[Reference](/reference)** | You need exact details — a permission name, a Firestore field, a route URL. | Tables and lists. |
| **[Explanation](/explanation)** | You want to understand WHY the product works the way it does. | Discussion. |

If you're not sure where to look, start with [**Get started in 5 minutes**](/tutorials).

## At a glance

| | |
|---|---|
| Platforms | Web dashboard, Android app, Chrome / Firefox / Edge extension |
| SMS transport | Native Android `SmsManager` via your SIM card. No cloud gateway. |
| Cost | Free for individuals. Carrier's standard SMS rate per message. |
| Permissions | `SEND_SMS` (required). `READ_CONTACTS` (optional, for the recipient picker). |
| Auth | Sign in with Google. |
| Data | Firestore for jobs, batches, devices, drafts, templates. Files via FilesHub. |
| iOS | Web dashboard works. Native silent send is **Android-only**. |

## Honest framing

A few things that competitors fudge but this app is straightforward about:

- **We are not a default SMS handler.** Android reserves features like reading the inbox or replying inline for the default SMS app. SMS Mobile App is purposely a sender, not a replacement messaging app.
- **Carrier rates still apply.** "Free" means we don't charge per message. Your carrier still does.
- **iOS is a web-dashboard experience only.** iOS doesn't expose a programmatic SMS sender; the app sending happens on Android devices.
- **Volunteer device pool is opt-in default-on.** See the [Explanation](/explanation) section before you deploy a batch — it explains who actually sends the SMS when you fire a job.

## Credits

Built and maintained by **Ahsan Mahmood** — a senior software engineer specialising in cross-platform mobile and web (React, Capacitor, Firebase). [Portfolio](https://aoneahsan.com) · [LinkedIn](https://linkedin.com/in/aoneahsan) · [GitHub](https://github.com/aoneahsan) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com).

If these docs help you, the kindest thing you can do is link to them from your own writing — backlinks are how this small project becomes findable.
