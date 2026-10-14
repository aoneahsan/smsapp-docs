---
title: Firestore security boundaries
description: Authorization and validation boundaries for SMSApp devices, contacts, batches, jobs, and recipients.
sidebar_position: 6
---

# Firestore security boundaries

Firestore rules enforce these first-release boundaries:

- Contact and sync records are scoped to the authenticated owner and source phone.
- A source phone referenced by a batch must belong to the owner.
- New batches use the current queue protocol and versioned Pakistani destination policy.
- Recipient destinations must match the normalized ordinary Pakistani mobile policy.
- A job can target only one active, explicitly enabled, ready owner-managed Android phone.
- The assigned phone owner can update only allowed claim/result fields and valid state transitions.
- Message, owner, destination, assignment, policy, and source snapshots cannot be rewritten during dispatch.
- Admin access does not bypass destination safety.

Same-account phones share a Firebase user identity. SMSApp therefore validates assignment and claim tokens but does not claim cryptographic per-device identity isolation.

Client validation improves feedback; Firestore rules and native dispatch checks remain necessary because a modified client can bypass browser code.
