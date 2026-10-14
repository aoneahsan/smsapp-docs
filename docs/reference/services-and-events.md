---
title: Services and state flow
description: Responsibility boundaries from web review through Firebase coordination to Android SMS results.
sidebar_position: 7
---

# Services and state flow

```text
Web admin
  -> authenticate owner
  -> select phone and recipient source
  -> normalize, exclude, deduplicate, preview
  -> stage batch and recipients
  -> explicitly release one job

Firebase
  -> authorize owner and assignment
  -> persist device/contact/job/recipient state
  -> coordinate claims and results

Android sender
  -> confirm enrollment, permission, default SIM, and job state
  -> claim one recipient
  -> enforce destination policy again
  -> call subscription-aware SmsManager
  -> persist sent, failed, or uncertain outcome
```

Firebase is coordination storage, not an SMS gateway. The browser never dispatches a native SMS. The Android sender rechecks authorization and readiness before each modem call and stops new attempts when state cannot be confirmed.

Analytics and error-reporting events must exclude message bodies, contact data, and full phone numbers. Operational state belongs in the authorized job records, not in public logs.
