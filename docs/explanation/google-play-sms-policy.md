---
title: SMS permission and Google Play
description: Why SMSApp ships as a signed APK instead of through Google Play, and how the app uses the SMS permission.
sidebar_position: 7
---

# SMS permission and Google Play

The Android app `com.aoneahsan.smsapp` ("SMS Mobile App") is not released on Google Play. Google Play restricts `SEND_SMS` to a small set of approved uses, so the app ships as a signed APK from the [Apps page](https://smsapp.aoneahsan.com/apps#download) and receives its web-layer updates inside the app.

The Android app uses `SEND_SMS` for its core device-automation function, operated by the person who owns the phone, and does not request inbox or receive-SMS access.
