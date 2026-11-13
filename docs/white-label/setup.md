---
title: Setting up a licensed copy
description: The order of work from a white-label request to a branded SMS Mobile App running on the buyer's domain and their customers' phones.
sidebar_position: 3
last_update:
  date: 2026-11-13
---

# Setting up a licensed copy

The steps run in this order. Each one waits on the one before it, so the time it takes depends mostly on how quickly the buyer's details arrive.

1. **The request or the order.** The buyer sends the form on the [price page](https://smsapp.aoneahsan.com/white-label/pricing). While checkout is closed, we reply by email with how to pay. Once a payment is confirmed, the licence key and certificate arrive by email; the payment page's redirect on its own grants nothing.
2. **Name, logo and colours.** We ask for the app's name, the logo as an SVG or a large PNG, and the brand colours. These go on the Android app and the dashboard.
3. **The domain.** The buyer chooses a host such as `sms.theircompany.pk` and adds the DNS record we send them. We connect it to the hosted dashboard.
4. **The backend.** We set up the accounts, phones, contact book and send queue for the buyer's copy.
5. **The Android app.** We build the APK under the buyer's name, sign it, and give them a download link with its SHA-256 checksum to publish on their own site.
6. **The licence file.** The deployment serves `/.well-known/smsapp-white-label-license.json` and the licence certificate beside it, so anyone can [check the licence](./verify-a-licence.md).

From then on, updates reach the phones over the air and the dashboard updates in place, for as long as the buyer's updates run ([updates and renewals](./updates-and-renewals.md)).

## What the buyer's customers do

The same as any user of SMS Mobile App: sign in, register their Android phone, grant SMS permission, enable sending, then build, review and release a job. The [tutorials](/tutorials) apply word for word; only the name on the screen differs.
