---
title: Why the sender is Android-only
description: Why SMSApp uses an Android phone for native SIM-based SMS dispatch.
sidebar_position: 3
---

# Why the sender is Android-only

The sending surface depends on Android `SmsManager`, runtime `SEND_SMS` permission, a configured SMS subscription, and foreground-service behavior. The web browser can prepare and monitor jobs but cannot access a phone's modem or SIM.

SMSApp therefore requires an Android phone for dispatch. There is no desktop sender or cloud SMS gateway in the first release. iOS: removed 2026-10-30 — re-add when an Apple Developer account exists. An operator may use the web admin from another device, but the selected registered Android phone performs every send.

Android still controls permission prompts, foreground-task limits, SIM selection, and carrier interaction. SMSApp blocks when it cannot establish a safe default subscription rather than choosing another SIM silently.
