---
title: Moving from httpSMS to SMS Mobile App
description: "httpSMS sells an API through your phone, priced by messages a month. Moving to a dashboard and review screen: your CSV, your send rate and your SIMs, step by step. Facts dated."
sidebar_position: 3
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from httpSMS to SMS Mobile App

httpSMS is an open-source Android companion app with a hosted API that sends and receives through your phone, priced by messages a month. It suits someone building on an API who wants scheduling, a send rate set per phone and offline alerts, and whose volume fits a few thousand messages a month.

SMS Mobile App suits someone sending to Pakistani numbers from a dashboard rather than from code. Pro has no monthly message cap, and a dual-SIM phone rotates its SIMs on its own. Your phone and SIM can stay the same.

## Moving your sends

1. **Keep the CSV you already upload.** It needs one recognised phone column, such as `phone` or `mobile`, and must stay under 5 MiB: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
2. **Write down the send rate you set on httpSMS.** Here the rate belongs to the job (messages per second, minute or hour), and each SIM keeps its own daily and hourly caps on top: [Quotas and limits](/reference/quotas-and-limits).
3. **Install the app from the download page** and check its SHA-256 before opening it: [Install the Android app](/tutorials/install-the-android-app).
4. **Sign in and register the phone.** [Sign in with Google](/how-to/auth-and-devices/sign-in-with-google), then [register it](/how-to/auth-and-devices/register-your-android-device) and [grant SMS permissions](/how-to/auth-and-devices/grant-sms-permissions). On a dual-SIM phone both SIMs are used, switching every 50 sends.
5. **Create a job from the CSV and start small.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard) with a handful of your own numbers, read the review screen, release it, then [watch it run](/how-to/admin/monitor-job-progress).

## What stays on httpSMS

- **The API and anything that calls it.** SMS Mobile App has no HTTP API.
- **Replies.** It sends only; received messages are never read or uploaded.
- **Destinations outside Pakistan,** and any number outside the `030` to `036` mobile ranges.
- **Sending past a SIM's caps.** A SIM starts at 150 a day and can rise to 400 as delivery reports come back; the hourly cap is a fifth of that, with at least 30 seconds between sends. Free stops at 100 messages a month, and your carrier's SMS rate applies to every message.

## httpSMS's facts, dated

<RivalFacts slug="httpsms" />

For the side-by-side view: [SMS Mobile App vs httpSMS](https://smsapp.aoneahsan.com/compare/httpsms).
