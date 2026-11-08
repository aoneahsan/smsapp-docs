---
title: Moving from Plivo to SMS Mobile App
description: "Plivo gives your software per-network rates into Pakistan. If a few hundred reviewed messages a day is the real job, here is how to move it to your own SIM. Facts dated."
sidebar_position: 11
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from Plivo to SMS Mobile App

Plivo is a hosted SMS API with pay-as-you-go rates for each destination network and discounts as volume grows. If your software needs a route into Pakistan with published per-network rates and queueing included, Plivo does that and we do not.

SMS Mobile App fits when the job is a few hundred reviewed messages a day from your own SIM, and a flat plan plus your carrier's rate suits you better than a per-message price.

## Checking it fits, then moving

1. **Count a normal day's messages.** A SIM starts at 150 a day and can rise to 400 as delivery reports come back; its hourly cap is a fifth of that. If your Plivo traffic is far above that, stop here: [Quotas and limits](/reference/quotas-and-limits).
2. **Keep API sends and OTP flows on Plivo.** There is no API here.
3. **Note which network your SIM is on.** Plivo prices Zong, Mobilink and the rest separately; here your own carrier's SMS rate applies to every message, on top of the plan.
4. **Put the recipients in a CSV** of `030` to `036` numbers: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
5. **Install, sign in and register the phone.** [Install the Android app](/tutorials/install-the-android-app) from the download page and check the SHA-256; then [sign in](/how-to/auth-and-devices/sign-in-with-google) and [register it](/how-to/auth-and-devices/register-your-android-device).
6. **Set the send rate on the job and release it.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard), [monitor it](/how-to/admin/monitor-job-progress).

## What stays on Plivo

- **The API, OTP and Plivo's queueing.**
- **Volume a hosted route carries.** Each job also waits at least 30 seconds between sends, and the Free plan stops at 100 messages a month.
- **Anything outside Pakistan's mobile ranges.**
- **Delivery is in your carrier's hands.** Whether a message arrives depends on your SIM and carrier, and their SMS rate is yours to pay.

## Plivo's facts, dated

Plivo's pages did not state whether it uses an Android phone, has a web dashboard, receives replies, runs several phones or dual-SIM rotation, controls send rate, schedules, reports delivery, imports spreadsheets, keeps templates or is open source. We left those rows out.

<RivalFacts slug="plivo" hideNotStated />

Read them side by side: [SMS Mobile App vs Plivo](https://smsapp.aoneahsan.com/compare/plivo).
