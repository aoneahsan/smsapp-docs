---
title: Prepare an owner-managed batch
description: Prepare a reviewed contacts or CSV batch for one registered Android phone.
sidebar_position: 1
---

# Prepare an owner-managed batch

1. Confirm the Android phone is registered, explicitly enabled, and reports current SMS/default-SIM readiness.
2. Open the admin batch import screen.
3. Select that phone.
4. Choose its completed contact sync or upload a CSV file.
5. Enter one message.
6. Review eligible, excluded, duplicate, and SMS-segment totals.
7. Create the draft.
8. Open the detail screen, assign the same phone, and explicitly start dispatch.

Preparing a draft does not send SMS. The Android phone performs the sends only after launch. Keep the foreground sender available and expect long jobs to continue across sessions; at the default pacing, thousands of recipients can require days.

Do not call an Android sent callback a delivery receipt. If SMSApp cannot prove whether a send occurred, it records an uncertain outcome for owner review instead of automatically retrying it.
