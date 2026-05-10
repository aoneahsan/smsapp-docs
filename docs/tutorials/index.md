---
title: Tutorials
description: Five end-to-end walkthroughs that turn a brand-new SMS Mobile App user into someone who can confidently schedule, batch-send, and manage volunteer devices.
sidebar_position: 1
sidebar_label: Overview
keywords: [sms tutorial, sms mobile app tutorial, send first sms android, schedule sms tutorial, batch sms csv tutorial]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Tutorials

A tutorial is a **lesson** — you follow along, you get a working result, and you learn the product by doing. Every tutorial here is verified end-to-end. If a step doesn't work for you on a real device, please [report it](https://github.com/aoneahsan/smsapp-docs/issues) so we can keep these accurate.

## The five getting-started tutorials

Read them in order. Each one assumes the previous one is complete and builds on it.

1. **[Get started in 5 minutes](/tutorials/get-started-in-5-minutes)** — sign in to the web dashboard, send your first SMS, see it land on a recipient phone.
2. **[Send your first scheduled SMS](/tutorials/send-your-first-scheduled-sms)** — schedule a one-off SMS for later today, watch the job sit pending, confirm it fires automatically.
3. **[Set up a small batch send](/tutorials/set-up-a-batch-send)** — upload a 10-row CSV, fire a batch from one device, watch per-recipient delivery roll in.
4. **[Install the Android app and link it](/tutorials/install-the-android-app)** — install from Google Play, sign in, grant `SEND_SMS`, link the phone to your account.
5. **[Become a volunteer device](/tutorials/become-a-volunteer-device)** — the opt-in default-on volunteer pool, fair-use boundaries, and how to opt out cleanly.

## When you're done

By the end of all five tutorials, you will have:

- A signed-in account at `smsapp.aoneahsan.com`
- A linked Android device with permissions granted
- A successful one-off send, a successful scheduled send, and a successful 10-row batch send under your belt
- A clear understanding of the volunteer device pool, what it means for your phone, and how to opt in or out

## Where to go after

For specific recipes ("how do I switch SIM on a dual-SIM phone?"), jump to [How-to guides](/how-to). For exact data — Firestore field names, every Android permission, every quota — see [Reference](/reference). For the design rationale behind decisions like Android-only silent send, see [Explanation](/explanation).

## Why this many getting-started tutorials?

Five is the minimum honest number. The product has three distinct surfaces (web dashboard, Android app, browser extension) and three distinct send modes (single, scheduled, batch). Cutting any of the five out means leaving a real user without working knowledge of a real path through the product. The trade-off is the time investment — about 30 minutes total — which is fair for getting a programmatic-SMS workflow set up correctly.
