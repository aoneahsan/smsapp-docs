---
title: Data model
description: Public overview of the account, phone, contact, job, recipient and attempt records SMSApp keeps in Supabase.
sidebar_position: 5
---

# Data model

SMSApp's records live in a Supabase Postgres database. Every table has row-level security.

| Record | Responsibility |
|---|---|
| `devices` | The account's registered phones: active state, SMS permission, default SIM and readiness, and protocol version |
| `contacts` · `contact_phone_numbers` | Address-book entries from one phone, one row per number with the shared destination policy's verdict |
| `contact_syncs` | The last sync attempt per phone |
| `send_jobs` | One reviewed job: the message snapshot, the recipient source and the selected phone (a single message is a one-recipient job) |
| `send_job_recipients` | One eligible, normalized destination per job, with its claim lease and outcome |
| `send_attempts` | An append-only log of each modem attempt, with masked numbers |
| `plans` | The plan set and its limits, read by the database when a job is released |

Recipient destinations and message snapshots do not change after release. Claims use a lease on one selected phone, so another runner cannot silently own the same recipient. If the system cannot prove whether Android accepted a send, the recipient stays uncertain rather than becoming an automatic retry.

This page leaves out field-by-field schemas. The released database migrations are authoritative.
