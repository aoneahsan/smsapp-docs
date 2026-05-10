---
title: Explanation
description: Understanding-oriented discussion of why SMS Mobile App is designed the way it is. Architecture, trade-offs, compliance posture, and the reasoning behind Android-only silent send.
sidebar_position: 1
sidebar_label: Overview
keywords: [why android sms, sms compliance google play, foreground service sms, default sms handler]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Explanation

Explanation is **the conversation** — discussion-style essays that clarify design rationale, trade-offs, and the reasoning behind decisions you might otherwise find surprising.

## Topics

1. **Why Android-only** — and what iOS users can do today.
2. **How silent SMS works on Android** — `SmsManager`, the foreground service, the `FOREGROUND_SERVICE_DATA_SYNC` permission.
3. **How the volunteer device pool works** — opt-in default-on, fair-use boundaries, what your phone is actually doing.
4. **Privacy and data handling** — what stays local, what syncs to Firestore, what we never collect.
5. **Architecture overview** — Capacitor + Firebase + the custom `NativeSms` plugin.
6. **Compliance: Google Play SMS-permission policy** — why we publish under "Permissions Declaration" and what we declare.
7. **Why we are not a default SMS handler** — and why that's the right call.

:::note Status
Explanation content lands in **Batch 7** of the [docs build plan](https://github.com/aoneahsan/smsapp-docs).
:::
