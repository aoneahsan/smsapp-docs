---
title: Quotas and limits
description: SMSApp plan limits plus the fixed recipient, CSV, phone, SIM and destination limits every job follows.
sidebar_position: 3
---

# Quotas and limits

## Plan limits

Each plan's limits are set on the plan by an admin and checked by the database when a job is released. The current values are on the [pricing page](https://smsapp.aoneahsan.com/pricing).

| Limit | Free | Pro | Family (per seat, 3 seats minimum) |
|---|---:|---:|---:|
| Sending phones | 1 | 3 | 4 |
| Stored contacts | 100 | 25,000 | 28,750 |
| Messages a month | 100 | no monthly cap | no monthly cap |
| Recipients in one job | 100 | 5,000 | 5,000 |
| Job history | 90 days | 1 year | 1 year |

## Limits every job follows

| Limit | Value |
|---|---:|
| Unique eligible recipients per job, on any plan | at most 5,000 |
| CSV input size | 5 MiB |
| Selected sending phones per job | 1 |
| Selected SIMs per job | 1 configured Android default |
| Accepted Pakistani mobile prefixes | `030`–`036` |
| Send rate | set per job: messages per second, minute or hour |

Duplicates are counted after destination normalization and sent at most once within a job. The importer rejects an oversized job instead of truncating it.

These are product limits, not carrier allowances. A carrier may charge, throttle, block or prompt independently. A slow send rate on a large job means many hours of sending, so large jobs must survive several app sessions.
