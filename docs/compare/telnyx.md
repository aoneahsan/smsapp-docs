---
title: Moving from Telnyx to SMS Mobile App
description: "Telnyx bills its own per-part rate plus the carrier's fee, for software on its API. If you are not building software and your recipients are in Pakistan, the steps. Facts dated."
sidebar_position: 13
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from Telnyx to SMS Mobile App

Telnyx is a hosted messaging API that publishes its own per-part rate and passes the carrier's fee through at cost. If you build on an API and want every line of the bill spelled out, with discounts at very high volume, Telnyx is made for you.

SMS Mobile App is for people who are not building software. If your recipients are in Pakistan, a flat plan with your own SIM is the simpler bill.

## Moving across

1. **Leave the integration and inbound messages on Telnyx.** There is no API here and replies are not read.
2. **Foreign destinations stay on Telnyx.** Only `030` to `036` Pakistani mobiles are accepted here.
3. **Warn recipients about the new number.** Messages will come from your SIM.
4. **Put the Pakistani numbers in a CSV:** [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
5. **Install and register the phone.** [Install the Android app](/tutorials/install-the-android-app) from the download page, check the SHA-256, then [register it](/how-to/auth-and-devices/register-your-android-device) and [grant SMS permissions](/how-to/auth-and-devices/grant-sms-permissions).
6. **Send, then read the delivery reports.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard), [monitor it](/how-to/admin/monitor-job-progress).

## What you lose

- **The API, inbound messages and every non-Pakistani route.**
- **Very high volume.** A SIM starts at 150 messages a day and can rise to 400 as delivery reports come back; the hourly cap is a fifth of that, and a job waits at least 30 seconds between sends. Free stops at 100 messages a month.
- **Delivery is up to your carrier,** and its SMS rate applies on top of the plan.

## Telnyx's facts, dated

Telnyx's pages did not state whether it sends from your own SIM, uses an Android phone, has a web dashboard, several phones, dual-SIM rotation, send-rate control, scheduling, delivery reports, spreadsheet import, templates, open source or a free tier. Those rows are not shown.

<RivalFacts slug="telnyx" hideNotStated />

Both side by side: [SMS Mobile App vs Telnyx](https://smsapp.aoneahsan.com/compare/telnyx).
