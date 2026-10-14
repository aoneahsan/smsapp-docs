---
title: Firestore data model
description: Public overview of the owner, device, contact-generation, batch, recipient, and queue records used by SMSApp.
sidebar_position: 5
---

# Firestore data model

| Record | Responsibility |
|---|---|
| `sms_devices` | Owner, stable phone identity, active/enrollment state, SMS/default-SIM/service readiness, and protocol version |
| `sms_contact_syncs` | Per-owner, per-source-phone sync generation and completion state |
| `sms_contacts` | Minimum synced contact fields, source phone, and generation |
| `sms_batches` | Immutable message/source snapshot, destination-policy version, recipient totals, selected source phone, and release state |
| `sms_batches/{batchId}/recipients` | Normalized destination, policy classification, assignment, claim lease/token, attempts, and outcome |
| `sms_jobs` | Executable queue record for the selected phone and batch |

Contact generations prevent an interrupted replacement sync from appearing complete. The latest completed generation stays usable until a newer generation publishes successfully.

Recipient destinations and message snapshots do not change after release. Claims use a token, device assignment, and expiry so another runner cannot silently own the same recipient. If the system cannot prove whether Android accepted a send, the recipient remains uncertain rather than becoming an automatic retry.

This page intentionally omits internal field-by-field schemas. The deployed Firestore rules and the release's application types are authoritative.
