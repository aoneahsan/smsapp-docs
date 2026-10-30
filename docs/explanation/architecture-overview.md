---
title: Architecture overview
description: How the SMSApp web dashboard, the Supabase database, and each user's own Android sender work together.
sidebar_position: 2
---

# Architecture overview

SMSApp separates job control from SMS transport. You sign in with Google, register your own Android phone, choose one recipient source, review a snapshot of the job and start it. Supabase (Postgres with row-level security) stores the account, phone, contact and job records. Your selected Android phone claims recipients and sends through its configured SIM.

<a id="why-three-parts"></a>
## Why three parts&nbsp;[#](#why-three-parts)

- The web dashboard gives a larger screen for import, review, assignment and monitoring.
- Supabase gives both surfaces one authenticated record. Every table has row-level security, and queue changes go only through database functions, so neither surface can skip a check.
- Android exposes `SmsManager`, the runtime SMS permission, a default subscription and sent-result callbacks.

There is no SMS gateway. Every message leaves from a real phone's SIM.

<a id="safety-boundaries"></a>
## Safety boundaries&nbsp;[#](#safety-boundaries)

The recipient policy runs during import, persistence, release and native dispatch. Contact data is scoped to the account and the phone it came from. Creating a job does not start it. One selected phone owns the job, and a claim lease stops another runner from silently taking the same recipient. Plan limits are checked by the database when a job is released.

SMS outcomes are limited by what Android reports. A callback can confirm submission success or failure, but it cannot guarantee carrier delivery. A lost callback after modem handoff becomes uncertain and is never retried automatically.
