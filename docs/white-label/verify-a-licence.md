---
title: Checking a white-label licence
description: How anyone can check that a copy of SMS Mobile App is licensed, by its licence key or by the website it runs on.
sidebar_position: 5
last_update:
  date: 2026-11-13
---

# Checking a licence

Every licensed copy of SMS Mobile App carries a licence key that starts `SMSAPP-WL-` and serves a licence file at:

```text
https://<the buyer's domain>/.well-known/smsapp-white-label-license.json
```

Anyone can check either one on the [Check a licence](https://smsapp.aoneahsan.com/verify-license) page. Verification is run by our licensing service.

## By key

| Answer | Meaning |
|---|---|
| This licence is active. | The key is valid. |
| Paid for and being set up | The licence exists; its deployment is not finished yet. |
| Revoked | The licence was ended for use outside its terms or on a domain it does not cover. |
| No licence has this key | The key does not exist. |

## By website

The service fetches the site's licence file and checks the key it names: whether the site is licensed, whether the licence names a different domain, or whether the site serves no file at all.

## Inside a licensed copy

A licensed build checks its own key once when it starts and again when it is brought back to the foreground, never on a timer. If the licensing service says the licence is not active for that address, the app shows one screen saying so, with a link to the check page. No data is deleted. If the service cannot be reached, the app carries on and asks again on the next start.
