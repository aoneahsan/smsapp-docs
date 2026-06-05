---
title: Firestore security rules summary
description: Plain-English summary of who can read and write each collection in SMS Mobile App, the helper functions that gate access, and the special multi-actor paths.
sidebar_position: 8
sidebar_label: Security rules
slug: security-rules
keywords: [smsapp firestore rules, sms_jobs security rules, sms_batches access control, firestore rules google auth]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Firestore security rules

The canonical source is `firestore.rules` in the main repo. This page is a readable map of what those rules grant and deny.

The rule set runs at version `rules_version = '2'`. All operations require authentication unless explicitly noted, and **authentication means Google sign-in only** — the `isGoogleAuth()` helper rejects anonymous, email/password, phone, and any other provider that may slip through the Auth flow.

## Helper functions

The rules file declares a small library of helpers used across every collection.

| Helper | What it checks |
|---|---|
| `isGoogleAuth()` | `request.auth != null` AND `request.auth.token.firebase.sign_in_provider == 'google.com'`. |
| `isAuthenticated()` | Currently identical to `isGoogleAuth()`. The indirection lets us flip in additional providers later without rewriting every rule. |
| `isAdmin()` | `isAuthenticated()` AND `request.auth.token.email == 'aoneahsan@gmail.com'`. |
| `isOwner(uid)` | `isAuthenticated()` AND `request.auth.uid == uid`. |
| `existingOwnerUid()` | Reads `resource.data.ownerUid` for owner-vs-update checks. |
| `isValidPhone(p)` | `p is string && size between 7 and 20`. |
| `isValidMessage(m)` | `m is string && size between 1 and 500`. |
| `isValidFrequency(f)` | `f in ['once', 'daily', 'send_now_batch']` (plus `'batch_send'` allowed by the batch path). |
| `isValidStatus(s)` | `s in ['pending', 'scheduled', 'sending', 'sent', 'failed', 'cancelled']`. |
| `isAssignedDeviceOwner()` | Multi-actor path: for `batch_send` jobs, allow the assigned-device's owner to read + write whitelisted progress fields without satisfying `isOwner` against the admin's UID. |

## Collection-by-collection access table

| Collection | Read | Create | Update | Delete |
|---|---|---|---|---|
| `sms_jobs/{id}` | Admin, owner, assigned-device owner (batch_send) | Auth user — must set their own `ownerUid`, valid shape, `status='pending'`, `attemptCount=0` | Admin/owner (full schema check) **OR** assigned-device owner (whitelisted fields only) | Admin or owner |
| `sms_logs/{id}` | Admin only | Admin **OR** auth user (logging their own job) | ❌ Forbidden (append-only) | ❌ Forbidden |
| `sms_devices/{id}` | Admin or owner | Auth user — must set their own `ownerUid` | Owner with rename-cooldown gate + status-restriction; admin bypasses | Admin only |
| `sms_users/{userId}` | Admin or self | (write covers create) | Admin or self | (write covers delete) |
| `sms_settings/{id}` | Any auth user | Admin | Admin | Admin |
| `sms_config/{id}` | Any auth user | Admin | Admin | Admin |
| `sms_advertisements/{id}` | **Public** (no auth) | Admin | Admin | Admin |
| `sms_contact_submissions/{id}` | Admin or submitter (when signed in) | Anonymous create with strict shape | Admin only | Admin only |
| `sms_ad_user_state/{id}` | Admin or self | Auth user — must set `userId == auth.uid` | Self | Admin only |
| `sms_blog_posts/{id}` | Auth user (published) or admin (any) | Admin | Admin | Admin |
| `sms_user_files/{userId}` | Admin or self | (write covers create) | Admin or self | (write covers delete) |
| `sms_contacts/{id}` | Admin or owner | Auth user — must set their own `ownerUid` | Admin or owner, `ownerUid` immutable | Admin or owner |
| `sms_quick_replies/{id}` | Admin or owner | Auth user — own `ownerUid` | Admin or owner, `ownerUid` immutable | Admin or owner |
| `sms_drafts/{id}` | Admin or owner | Auth user — own `ownerUid` | Admin or owner, `ownerUid` immutable | Admin or owner |
| `sms_templates/{id}` | Admin or owner | Auth user — own `ownerUid` | Admin or owner, `ownerUid` immutable | Admin or owner |
| `sms_contact_groups/{id}` | Admin or owner | Auth user — own `ownerUid` | Admin or owner, `ownerUid` immutable | Admin or owner |
| `sms_user_achievements/{id}` | Admin or self | Auth user — own `userId` | Self | Admin only |
| `sms_user_usage/{id}` | Admin or self | Auth user — own `userId` | Self | Admin only |
| `sms_guest_quota/{guestId}` | **Public read** | Anonymous create with shape (count ≤ 10, monotonic) | Anonymous count-bump **OR** auth user link-stamp | Admin only |
| `sms_batches/{id}` | Admin or any device-owner whose device is in `assignedDeviceIds` | Admin — fan-out ≤10, every assigned device healthy | Admin **OR** assigned-device owner (counter fields + `deviceProgress` only) | Admin only |
| `sms_batches/{id}/recipients/{rid}` | Admin or any device-owner via parent-batch check | Admin only | Admin **OR** auth user (whitelisted field set, attempt-budget invariants) | Admin only |
| **Catch-all `/{document=**}`** | ❌ | ❌ | ❌ | ❌ |

## Multi-actor rules: how the runner writes without admin

Two paths in the rules let a non-admin volunteer write to documents created by the admin. They power Phase 7's batch-send runner.

### 1. Batch-send job updates (`sms_jobs`)

The standard owner path requires `request.auth.uid == resource.data.ownerUid`. For `batch_send` jobs, however, the runner runs as the volunteer device's user — not the admin. The `isAssignedDeviceOwner()` helper makes that path safe:

```
isAssignedDeviceOwner() =
    request.auth != null
 && resource.data.frequency == 'batch_send'
 && resource.data.assignedDeviceIds.size() == 1
 && get(/sms_devices/{assignedDeviceIds[0]}).data.ownerUid == request.auth.uid
```

When this returns true, the runner may update **only** the whitelisted field set: `status`, `attemptCount`, `lastError`, `lastAttemptAt`, `processingDeviceId`, `processingStartedAt`, `progressCompleted`, `progressSent`, `progressFailed`, `sentByDeviceId`, `updatedAt`. It **cannot** change `ownerUid`, `frequency`, `assignedDeviceIds`, or the recipient list — those stay immutable on this path. The `isValidStatus()` check still applies.

### 2. Batch progress counters (`sms_batches`)

Admins create batches and seed counters. Runners then increment `sentCount`, `failedCount`, and `deviceProgress` atomically via Firestore's `DocumentTransform.increment`. The rules path `isBatchAssignedToCaller()` walks the (hand-unrolled, max-10) `assignedDeviceIds` array to confirm the caller owns at least one device on the list. When that holds, the runner may write only the four counter fields plus `updatedAt` and `deviceProgress`. The monotonic invariant is enforced: `request.resource.data.sentCount >= resource.data.sentCount` (counters can never decrease).

### 3. Recipient state machine (`sms_batches/{id}/recipients`)

The runner writes one document per recipient per dispatch attempt. The rules permit the whitelisted update — `status`, `lastError`, `updatedAt`, `sentAt`, `sentByDeviceId`, plus the Phase B claim primitives (`claimedByDeviceId`, `claimedAt`), retry budget (`attemptCount`, `maxAttempts`, `lastAttemptAt`, `nextRetryAt`), and the bounded `attemptHistory` (≤5 entries). Rule-level invariants enforce: `attemptCount is int && ≥ 0 && ≤ maxAttempts`; `attemptHistory is list && size ≤ 5`. The full status-transition matrix is enforced **on the client** (runner state machine) — rules cover shape + bounds, not transitions, because the transition graph would push the rules file past readability.

## Special paths

### Anonymous reads
Two paths permit unauthenticated reads:
- `sms_advertisements` — promotional content shown to all visitors. Public reads, admin writes.
- `sms_guest_quota` — pre-login quota mirror. Public reads (no PII stored), shape-validated anonymous writes.

### Anonymous writes
One path: `sms_guest_quota`'s quota-bump rule. The bump is heavily constrained: the doc id must equal `data.guestId`, the count must be monotonic non-decreasing, capped at 10, and only the four allowed keys may be touched.

The contact-form path (`sms_contact_submissions`) accepts both anonymous and authenticated creates but enforces a strict schema (`isValidContactSubmissionCreate()`). The `userId` field, if present, must equal `auth.uid` — so anonymous submitters cannot claim someone else's identity.

### Public-read admin-write
`sms_advertisements` is the only such path: ads are public reads to support the marketing surfaces.

### Health-gated fan-out
A batch's `assignedDeviceIds` cannot include any device with `status == 'flagged'`. The `areAllAssignedDevicesHealthy()` helper walks the assigned array (up to 10 entries) and `get()`s each device doc. Any flagged device fails the entire write — admin must clear the flag (manually or via auto-clear) before the batch can fan out.

## Default deny

The final block — `match /{document=**} { allow read, write: if false; }` — denies anything not explicitly allowed above. New collections must add their own `match` rule. Forgetting the explicit rule means the collection is denied by default until you add it.

## Index dependencies

Rule helpers like `isAssignedDeviceOwner()` and `isBatchAssignedToCaller()` rely on `get()` and `exists()` against other documents. Those reads count against Firestore's per-request read budget. The 10-device cap exists in part to keep this budget tractable — beyond 10 lookups per rule evaluation, Firestore's documented limit on cross-document reads in a single rule starts to bite.

## How to validate rules changes

Exercise a rules change against the local Firestore emulator before deploying. Deploy rules and indexes only after the change behaves as expected:

```bash
yarn firebase:emulators        # start the Firestore emulator
firebase deploy --only firestore:indexes  # AFTER validating — never use --only firestore (it deletes indexes)
```

## Where to dig deeper

- The full rule text: `firestore.rules` in the main repo.
- The query coverage audit: [FIREBASE-QUERY-COVERAGE-AUDIT.md](https://github.com/aoneahsan/smsapp-docs/blob/main/REFERENCE.md) — every front-end query mapped to a rule + index.
- The how-to recipes that exercise the multi-actor paths: [Configure rate limits](/how-to/admin/configure-rate-limits), [Handle failures and partial sends](/how-to/admin/handle-failures-and-partial-sends).
