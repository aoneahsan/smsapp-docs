---
title: Moving from Traccar SMS Gateway to SMS Mobile App
description: "Traccar SMS Gateway sends a tracking server's alerts through a phone; SMS Mobile App sends one reviewed message to a list. Rarely a real move: how they differ and where to start. Facts dated."
sidebar_position: 6
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from Traccar SMS Gateway to SMS Mobile App

Traccar SMS Gateway is an Android messaging app from the Traccar GPS project. It gives a Traccar server a small HTTP API so the server's alerts go out as SMS through a phone. If that is what you use it for, keep it: SMS Mobile App has no API, so a server cannot send through it.

SMS Mobile App is for a different job: one message, written by a person, sent to a list of people, with a review screen, delivery reports and plan limits.

## Where to start

Keep your Traccar alerts where they are. If you also need to text a list of drivers or customers by hand, that part can run here alongside:

1. **Install SMS Mobile App** from the download page, checking the SHA-256: [Install the Android app](/tutorials/install-the-android-app).
2. **Sign in and register the phone** that will send: [Sign in with Google](/how-to/auth-and-devices/sign-in-with-google), [register your Android device](/how-to/auth-and-devices/register-your-android-device), [grant SMS permissions](/how-to/auth-and-devices/grant-sms-permissions).
3. **Build the list** from the phone's synced contacts or a CSV: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
4. **Create the job, review it and release it:** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard).

## Limits to know first

- **Pakistani mobile numbers only.** Foreign numbers, landlines and short codes are refused.
- **Paced per SIM.** A SIM starts at 150 messages a day and can rise to 400 as delivery reports come back; the hourly cap is a fifth of that, with at least 30 seconds between sends. The Free plan stops at 100 messages a month.
- **Your carrier still decides delivery,** and its SMS rate is yours to pay on top of any plan.

## Traccar SMS Gateway's facts, dated

Traccar's page told us three things: the app sends from your own SIM, runs on an Android phone and offers an HTTP API. It did not say whether there is a web dashboard, replies, several phones, dual-SIM rotation, send-rate control, scheduling, delivery reports, spreadsheet import, templates, open source, a free tier or a per-message fee, so those rows are left out below.

<RivalFacts slug="traccar-sms-gateway" hideNotStated />

The app's site puts them side by side: [SMS Mobile App vs Traccar SMS Gateway](https://smsapp.aoneahsan.com/compare/traccar-sms-gateway).
