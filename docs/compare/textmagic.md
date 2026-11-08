---
title: Moving from Textmagic to SMS Mobile App
description: "Textmagic rents a texting number and sells per-text credit, mostly for the US, Canada, the UK and Australia. Moving your Pakistani contacts to your own SIM. Facts dated."
sidebar_position: 15
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from Textmagic to SMS Mobile App

Textmagic is a hosted business texting service: pay-as-you-go credit, a monthly texting number and a web app. If your contacts are mostly in the US, Canada, the UK or Australia, and you want free inbound replies on a hosted number, it is the better fit.

SMS Mobile App suits contacts in Pakistan who already know your number, and someone who would rather pay a flat plan than a number rental plus a per-text price.

## Splitting your contact list

1. **Sort contacts by country.** Only Pakistani mobile numbers (`030` to `036`) can come across; everyone else stays on Textmagic.
2. **Use up your credit first.** Remaining credit and the rented number stay behind.
3. **Save the Pakistani contacts as a CSV** with a `phone` column: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
4. **Install the app on your own phone** from the download page and compare the SHA-256: [Install the Android app](/tutorials/install-the-android-app). Then [sign in](/how-to/auth-and-devices/sign-in-with-google) and [register it](/how-to/auth-and-devices/register-your-android-device).
5. **Send a small job first.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard), read the review, release, [monitor it](/how-to/admin/monitor-job-progress).

## What you leave behind

- **The rented number and its inbound replies.** Replies to your SIM go to the phone's own messaging app; SMS Mobile App does not read them.
- **Every contact outside Pakistan.**
- **Uncapped sending.** A SIM starts at 150 messages a day and can rise to 400 as delivery reports come back; its hourly cap is a fifth of that, with at least 30 seconds between sends. Free stops at 100 messages a month.
- **Your carrier's rate** applies to every message, on top of the plan.

## Textmagic's facts, dated

Textmagic's pages did not state whether it uses an Android phone, has a web dashboard or an HTTP API, several phones, dual-SIM rotation, send-rate control, scheduling, delivery reports, spreadsheet import, templates, open source or a free tier. Those rows are left out.

<RivalFacts slug="textmagic" hideNotStated />

Side by side: [SMS Mobile App vs Textmagic](https://smsapp.aoneahsan.com/compare/textmagic).
