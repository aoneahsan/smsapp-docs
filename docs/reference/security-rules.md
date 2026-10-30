---
title: Access boundaries
description: Authorization and validation boundaries for SMSApp phones, contacts, jobs and recipients, enforced in the database.
sidebar_position: 6
---

# Access boundaries

Row-level security and database functions in Supabase enforce these boundaries:

- Contact and sync records belong to the signed-in account and the phone they came from.
- A job's selected phone must belong to the same account, be active, and report SMS permission and a default SIM.
- Recipient destinations must match the normalized ordinary Pakistani mobile policy.
- Releasing, pausing and cancelling a job, claiming recipients and reporting results happen only through database functions, never as direct table writes.
- Message, destination, phone and source snapshots cannot be rewritten after release.
- The plan's limits (recipients per job, messages a month) are checked when a job is released.
- Admin access does not bypass destination safety.

Phones on the same account share that account's sign-in. SMSApp checks the selected phone and the claim lease, but does not claim cryptographic per-phone identity isolation.

Client validation improves feedback; the database checks and the native dispatch checks remain necessary because a modified client can bypass browser code.
