---
title: Quotas and limits
description: First-release SMSApp recipient, CSV, device, SIM, and runtime limits.
sidebar_position: 3
---

# Quotas and limits

| Limit | First-release value |
|---|---:|
| Unique eligible recipients per job | 5,000 |
| CSV input size | 5 MiB |
| Selected sending phones per job | 1 |
| Selected SIMs per job | 1 configured Android default |
| Accepted Pakistani mobile prefixes | `030`–`036` |
| Default pacing range | 30–120 seconds between attempts |

Duplicates are counted after destination normalization and sent at most once within a job. The importer rejects an oversized job instead of truncating it.

These are product limits, not carrier allowances. A carrier may charge, throttle, block, or prompt independently. At an average 75-second interval, 5,000 attempts take about 104 hours before pauses or failures, so large jobs must survive multiple app sessions and may need owner attention.
