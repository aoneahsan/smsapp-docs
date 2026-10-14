---
title: Handle failures and uncertain outcomes
description: Diagnose readiness, carrier, and callback problems without creating duplicate SMS attempts.
sidebar_position: 4
---

# Handle failures and uncertain outcomes

<a id="phone-not-ready"></a>
## Phone not ready&nbsp;[#](#phone-not-ready)

Open the Android app and confirm the signed-in account, active registration, explicit sender enrollment, `SEND_SMS` permission, configured default SMS subscription, and sender-service state. Keep the phone online long enough to publish readiness.

<a id="confirmed-failure"></a>
## Confirmed failure&nbsp;[#](#confirmed-failure)

Correct the reported cause before using the retry action. Common causes include missing permission, missing default SIM, no carrier service, or a phone becoming unavailable before dispatch. The destination policy runs again and can block a previously staged value if policy changes.

<a id="uncertain-outcome"></a>
## Uncertain outcome&nbsp;[#](#uncertain-outcome)

Do not bulk retry. Android may have accepted the SMS before the app lost its callback or result upload. Check the phone and carrier records, then resolve the recipient explicitly. Treat duplicate-message risk as more important than making the progress counter look complete.

<a id="long-job-interrupted"></a>
## Long job interrupted&nbsp;[#](#long-job-interrupted)

Android can stop a foreground task, the phone can reboot, or connectivity can disappear. Reopen SMSApp, restore readiness, and resume only the recipients that remain safely pending. Never replay the full source file as a new job without comparing existing outcomes.
