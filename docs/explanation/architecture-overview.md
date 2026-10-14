---
title: Architecture overview
description: How the SMSApp web admin, Firebase coordination layer, and owner-managed Android sender work together.
sidebar_position: 2
---

# Architecture overview

SMSApp separates job control from SMS transport. The browser authenticates the owner, selects one phone and one recipient source, creates a reviewed snapshot, and monitors progress. Firebase stores authorized coordination state. The selected Android phone claims recipients and sends through its configured SIM.

<a id="why-three-parts"></a>
## Why three parts&nbsp;[#](#why-three-parts)

- The web admin gives the owner a larger interface for import, review, assignment, and monitoring.
- Firebase gives both surfaces a durable authenticated record without operating an SMS gateway.
- Android exposes `SmsManager`, runtime SMS permission, a default subscription, and sent-result callbacks.

<a id="safety-boundaries"></a>
## Safety boundaries&nbsp;[#](#safety-boundaries)

The recipient policy runs during import, persistence, release, and native dispatch. Contact data is scoped to owner and source phone. Creating a batch does not release it. One selected phone owns the job, and claim tokens prevent another runner from silently taking the same recipient.

SMS outcomes are limited by what Android reports. A callback can confirm submission success or failure, but it cannot guarantee carrier delivery. A lost callback after modem handoff becomes uncertain and needs owner reconciliation.
