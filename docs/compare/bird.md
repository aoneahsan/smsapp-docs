---
title: Moving from Bird (formerly MessageBird) to SMS Mobile App
description: "Bird runs SMS, email and WhatsApp on a funded balance. Moving only the SMS to Pakistani numbers onto your own SIM: settle the balance first, then the steps. Facts dated."
sidebar_position: 10
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from Bird (formerly MessageBird) to SMS Mobile App

Bird is a hosted messaging platform. You fund a balance and pay per SMS segment, with numbers rented separately, and the same balance covers email, WhatsApp and a shared inbox. If you use those channels together, or send at volume to the US where its segment rates are low, Bird fits better.

SMS Mobile App is SMS only: your own number on each message to people in Pakistan, a phone you already own as the sender, and a flat monthly plan.

## Moving the SMS part

1. **Settle the balance first.** Use it up or withdraw it under Bird's own terms; nothing transfers.
2. **Leave email, WhatsApp and the inbox on Bird** if you still need them.
3. **Gather the Pakistani mobile numbers** into a CSV with a `phone` column: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
4. **Install the app on the phone whose SIM will send,** checking the SHA-256 on the download page: [Install the Android app](/tutorials/install-the-android-app). Then [register the phone](/how-to/auth-and-devices/register-your-android-device).
5. **Create the job and read the review screen.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard); excluded numbers are listed with the reason.
6. **Release and follow it.** [Monitor job progress](/how-to/admin/monitor-job-progress).

## What does not move

- **The balance, rented numbers, inbox, other channels and API access.**
- **Numbers outside Pakistan,** landlines and short codes.
- **Unpaced volume.** A SIM starts at 150 messages a day and can rise to 400 as delivery reports come back, with an hourly cap of a fifth of that and at least 30 seconds between sends. Free stops at 100 messages a month, and your carrier's SMS rate applies on top.

## Bird's facts, dated

Bird's pages did not state whether it uses an Android phone, has a web dashboard, several phones, dual-SIM rotation, send-rate control, scheduling, delivery reports, spreadsheet import, templates or open source; those rows are left out.

<RivalFacts slug="bird" hideNotStated />

Side by side: [SMS Mobile App vs Bird](https://smsapp.aoneahsan.com/compare/bird).
