---
title: Moving from SMSGate to SMS Mobile App
description: "SMSGate turns your phone into an API for your own code. If a person, not a script, starts your sends, here is how to move them and what is left behind. Facts dated."
sidebar_position: 2
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';

# Moving from SMSGate to SMS Mobile App

SMSGate is an open-source Android app that turns the phone into an SMS API, through a local, cloud or self-hosted server. If you write your own software and want a free REST API, webhooks and replies, it is the better fit and you should stay.

SMS Mobile App is for people who would rather not write code. The list goes into a web dashboard, you read it on a review screen, and the phone sends it with each SIM paced for you. There is no API, so only the sends a person prepares by hand can come across.

## Sorting out what can move

Open the scripts that call SMSGate. Anything that fires on its own (an order alert, a webhook reply, a login code) has nothing to call here and stays where it is. A send that starts because someone edited a list and ran a script is the kind that moves.

1. **Pull the numbers out of that script's input.** Put them in a CSV with one column headed `phone` or `mobile`: [Prepare a CSV recipient file](/how-to/auth-and-devices/import-contacts-from-csv).
2. **Check for per-person text.** If your script built a different message for each number, that ends here: a job sends one message to everyone, and a message column in the CSV is ignored.
3. **Install SMS Mobile App on the phone that will send.** Get it from the download page and compare the SHA-256 before you open the file: [Install the Android app](/tutorials/install-the-android-app).
4. **Sign in, register the phone, allow SMS.** [Sign in with Google](/how-to/auth-and-devices/sign-in-with-google), [register your Android device](/how-to/auth-and-devices/register-your-android-device), [grant SMS permissions](/how-to/auth-and-devices/grant-sms-permissions).
5. **Create the job and read what was dropped.** [Create a job](/how-to/admin/create-a-job-from-the-admin-dashboard). Numbers your script used to send to may now be excluded: only `030` to `036` mobiles go through, each refusal comes with its reason, and there is no override.
6. **Release it and follow the delivery reports.** [Monitor job progress](/how-to/admin/monitor-job-progress).

## What you give up

- **The REST API, webhooks and replies.** None of these exist here, and received messages are never read.
- **Open source.** SMSGate's code is public; ours is not.
- **Foreign numbers.** Only Pakistani mobile numbers are accepted.
- **Unpaced sending.** A SIM starts at 150 messages a day and can rise to 400 as delivery reports come back, with an hourly cap of a fifth of that and at least 30 seconds between sends. The Free plan stops at 100 messages a month, and your carrier's SMS rate is yours to pay on top.

## SMSGate's facts, dated

<RivalFacts slug="sms-gateway-for-android" />

Both side by side on the app's site: [SMS Mobile App vs SMSGate](https://smsapp.aoneahsan.com/compare/sms-gateway-for-android).
