---
title: Services and state flow
description: Responsibility boundaries from web review through the Supabase database to Android SMS results.
sidebar_position: 7
---

# Services and state flow

```text
Web dashboard
  -> sign in with Google
  -> select your phone and a recipient source
  -> normalize, exclude, deduplicate, preview
  -> create the job and its recipients as a draft
  -> explicitly release the job

Supabase
  -> check the account, the phone and the plan limits
  -> persist phone, contact, job and recipient state
  -> hand out recipient claims (leased) and record results

Android sender
  -> confirm the phone is ready: permission, default SIM, job state
  -> claim recipients
  -> enforce the destination policy again
  -> call subscription-aware SmsManager
  -> report a sent, failed or uncertain outcome
```

Supabase is coordination storage, not an SMS gateway. The browser never dispatches a native SMS. The Android sender rechecks the job and its own readiness before each modem call and stops new attempts when state cannot be confirmed.

Analytics and error-reporting events must exclude message bodies, contact data and full phone numbers. Operational state belongs in the authorized job records, not in public logs.
