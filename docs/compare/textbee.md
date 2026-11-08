---
title: Moving from textbee to SMS Mobile App
description: "textbee and SMS Mobile App both send from your SIM; the difference is how a send starts. Which textbee sends can move, how to bring them across, and dated facts."
sidebar_position: 4
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from textbee to SMS Mobile App

textbee is an open-source Android gateway with a dashboard and a REST API, sold as flat monthly plans with a message allowance. Both send from your SIM, so the move is about how a send gets started. If you rely on its API, webhooks, replies or n8n and Zapier flows, and the monthly allowance covers you, textbee is the better home.

SMS Mobile App is built around one job: a reviewed message to people in Pakistan, prepared in a web dashboard. Pro has no monthly cap, and each SIM is paced against its own daily limit.

## Bringing your sends across

1. **Split automated from hand-made.** Anything n8n, Zapier or a webhook triggers has no equivalent here. Sends you type into textbee's dashboard move cleanly.
2. **Copy the wording of the templates you reuse.** SMS Mobile App has message templates too, but nothing imports them, so paste each one in.
3. **Pick where the numbers come from.** A job can use the phone's synced contacts or a CSV: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
4. **Install and register your phones.** [Install the Android app](/tutorials/install-the-android-app) from the download page, check its SHA-256, then [register each phone](/how-to/auth-and-devices/register-your-android-device). textbee Pro allows five devices; here Free has one sending phone, Pro three and Family four per seat, and each job uses one phone.
5. **Create the job, read the review, release.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard), then [monitor it](/how-to/admin/monitor-job-progress).

## What does not come with you

- **API calls, webhooks and automation flows.** There is no HTTP API.
- **Replies.** Received messages are never read.
- **Open source.** textbee's code is public; ours is not.
- **Numbers outside Pakistan.** Foreign numbers, landlines and short codes are refused.
- **Unlimited pace.** A SIM starts at 150 messages a day (textbee's Free plan stops at 50) and can rise to 400 as delivery reports come back. Its hourly cap is a fifth of that, with at least 30 seconds between sends. Our Free plan stops at 100 messages a month, and your carrier's rate applies on top.

## textbee's facts, dated

<RivalFacts slug="textbee" />

The app's site has [SMS Mobile App vs textbee](https://smsapp.aoneahsan.com/compare/textbee) side by side.
