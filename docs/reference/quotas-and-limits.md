---
title: Quotas and limits
description: SMSApp plan limits plus the fixed recipient, CSV, phone, SIM and destination limits every job follows.
sidebar_position: 3
---

# Quotas and limits

## Plan limits

Each plan's limits are set on the plan by an admin and checked by the database: job limits when a job is released, the daily allowance each time a phone asks for its next message. The current values are on the [pricing page](https://smsapp.aoneahsan.com/pricing).

| Limit | Free | Pro | Family (per seat, 3 seats minimum) |
|---|---:|---:|---:|
| Sending phones | 1 | 3 | 4 |
| Stored contacts | 100 | 25,000 | 28,750 |
| Messages a day | 10 on day 1, +10 each day you send in a row, 70 from day 7 | no plan limit | no plan limit |
| Recipients in one job | 100 | 5,000 | 5,000 |
| Job history | 90 days | 1 year | 1 year |

### The Free daily allowance

- A day is a Pakistan calendar day, and it counts once at least one message goes out.
- Day 1 allows 10 messages. Each day in a row with a send adds 10, up to 70 from day 7. Keep sending every day and it stays at 70.
- Miss a day and the next day is day 1 again: 10 messages.
- A campaign bigger than what is left today is accepted. The phone sends what today allows, waits until 12:00 am Pakistan time and carries on by itself.
- Messages sent from the send page on the phone count too.
- Without an account, a phone can send 10 messages once. They do not refill; signing in starts the daily allowance.

## Limits every job follows

| Limit | Value |
|---|---:|
| Unique eligible recipients per job, on any plan | at most 5,000 |
| CSV input size | 5 MiB |
| Selected sending phones per job | 1 |
| SIMs | a dual-SIM phone rotates across its SIMs every 50 sends |
| Each SIM's daily cap | starts at 150, can rise to 400 as delivery reports come back |
| Each SIM's hourly cap | a fifth of its daily cap |
| Wait between sends in a job | at least 30 seconds |
| Accepted Pakistani mobile prefixes | `030`–`036` |
| Send rate | set per job: messages per second, minute or hour |

Duplicates are counted after destination normalization and sent at most once within a job. The importer rejects an oversized job instead of truncating it.

These are product limits, not carrier allowances. A carrier may charge, throttle, block or prompt independently. A slow send rate on a large job means many hours of sending, so large jobs must survive several app sessions.
