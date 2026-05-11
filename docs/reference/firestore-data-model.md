---
title: Firestore data model reference
description: Every Firestore collection used by SMS Mobile App with its purpose, key fields, relationships, and the access pattern that governs reads and writes.
sidebar_position: 4
sidebar_label: Firestore data model
slug: firestore-data-model
keywords: [smsapp firestore schema, sms_jobs collection, sms_batches schema, firestore data model sms mobile app]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Firestore data model

Every persistent record in the app lives in a Firestore collection prefixed `sms_`. The prefix scopes our collections within the shared Firebase project and keeps a clean separation when this database is consolidated with other Zaions products in the future.

Field types follow Firestore primitives: `string`, `number` (int / double), `boolean`, `timestamp`, `map`, `array`, `reference`. Where the schema is enforced by `firestore.rules`, the rule constraint is noted in the **Access** column. Where the schema is enforced only client-side (in service modules under `src/lib/`), it is documented but flagged.

## Primary collections

### `sms_users/{userId}`

Per-user profile, synchronised on every login. The `userId` is the Firebase Auth UID (Google `sub` claim).

| Field | Type | Purpose |
|---|---|---|
| `userId` | string | Mirror of the doc id. |
| `email` | string | Google email. Used as the admin gate (`aoneahsan@gmail.com`). |
| `displayName` | string | Google display name. |
| `photoURL` | string | Google profile photo. |
| `preferences` | map | Theme, default SIM index, default rate cap, opted-in-pool flag, locale. |
| `tier` | string | `'free' \| 'fair_use_upgraded'`. Default `free`. |
| `createdAt` | timestamp | First sign-in. |
| `lastLoginAt` | timestamp | Updated on every successful login. |
| `signInProvider` | string | Always `google.com` — enforced by rules. |

**Access.** User can read/write only their own doc. Admin can read/write any. Enforced by `match /sms_users/{userId}` in `firestore.rules`.

### `sms_jobs/{jobId}`

The SMS job queue. Every single-recipient send (UI-prompted, mock, or silent), every recurring schedule, and every batch sub-job is one document here.

| Field | Type | Purpose |
|---|---|---|
| `ownerUid` | string | Firebase UID of the user who created the job. Immutable. |
| `to` | string | Recipient phone number, 7–20 chars. |
| `message` | string | Body, 1–500 chars (Firestore rule). |
| `frequency` | string | `'once' \| 'daily' \| 'send_now_batch' \| 'batch_send'`. |
| `status` | string | `'pending' \| 'scheduled' \| 'sending' \| 'sent' \| 'failed' \| 'cancelled'`. |
| `createdAt` | timestamp | Composer commit time. |
| `updatedAt` | timestamp | Bumped on every state transition. |
| `attemptCount` | int | Number of dispatch attempts so far. |
| `maxAttempts` | int | Default 3. Higher for admin-created jobs. |
| `lastError` | string | Last error code if any (e.g. `carrier_throttle`, `invalid_number`). |
| `lastAttemptAt` | timestamp | When the most recent attempt fired. |
| `processingDeviceId` | string | Device that holds the current claim. Cleared on release. |
| `processingStartedAt` | timestamp | Used to detect expired claims. |
| `progressCompleted` / `progressSent` / `progressFailed` | int | Per-job progress counters for `batch_send`. |
| `sentByDeviceId` | string | Final device on terminal success. |
| `assignedDeviceIds` | array&lt;string&gt; | Single-element list for `batch_send` jobs naming the device responsible. |

**Access.** User can read/create/update/delete their own. Admin reads all. For `batch_send` jobs, the assigned device's owner can also read + update a whitelisted set of progress fields without satisfying `isOwner` against the admin's UID. This is the **claim-transition** rule path (Phase 9.5).

### `sms_logs/{logId}`

Append-only audit trail of every dispatch attempt. Admin-only read; users can append logs for their own jobs.

| Field | Type | Purpose |
|---|---|---|
| `jobId` | string | Reference back to `sms_jobs`. |
| `ownerUid` | string | Job owner (for audit trail integrity). |
| `attemptNumber` | int | 1-indexed attempt counter. |
| `result` | string | `'sent' \| 'failed' \| 'cancelled'`. |
| `errorCode` | string | Non-null when `result == 'failed'`. |
| `deviceId` | string | Volunteer device. |
| `createdAt` | timestamp | Append time. |

**Access.** Read: admin only. Create: admin or job owner. Update/Delete: never (append-only).

### `sms_devices/{deviceId}`

Volunteer device registry. One document per registered SIM device.

| Field | Type | Purpose |
|---|---|---|
| `ownerUid` | string | Firebase UID of the volunteer. Immutable on the user-update path. |
| `deviceName` | string | Human-readable label. Renaming is rate-limited to once per 7 days (rules-enforced). |
| `deviceNameLastEditedAt` | timestamp | Cooldown gate. |
| `appIdentifier` | string | Stable per-install identifier (Capacitor Preferences–backed). |
| `platform` | string | `'android'` for now. |
| `androidApiLevel` | int | API level at registration. |
| `simSlotIndex` | int | 0 or 1 for dual-SIM phones. |
| `defaultRateCap` | int | Volunteer-chosen rate cap (default 6/min). |
| `status` | string | `'active' \| 'flagged' \| 'inactive' \| 'deleted'`. Non-admin can only toggle between `active` and `flagged`. |
| `healthScore` | int | 0–100 rolling score. |
| `errorCount` / `consecutiveErrors` | int | Reliability signal. |
| `recentSendOutcomes` | array | Bounded list (max ~50) of recent attempt outcomes. |
| `flaggedAt` / `flagReason` / `flagAutoClearAt` | timestamp / string / timestamp | Set when the device is auto-flagged for repeated failures; auto-clears after the configured cooldown. |
| `lastHeartbeatAt` | timestamp | Heartbeat from the runner. Used to detect missing devices. |

**Access.** User reads/writes their own; admin manages everyone's. The rules enforce the rename cooldown, immutable `ownerUid` on the user path, the `status in ['active','flagged']` restriction for non-admin writes, and admin-only deletes.

### `sms_batches/{batchId}` + `recipients` sub-collection

Operator-side container for CSV-imported recipient batches. Each batch fans out to at most 10 volunteer devices (the **hard cap** is enforced server-side at every write).

| Field | Type | Purpose |
|---|---|---|
| `label` | string | Admin-set name. |
| `batchNumber` | int | Sequential, admin-set. |
| `totalRecipients` | int | Set at import; immutable thereafter. |
| `sentCount` / `failedCount` | int | Monotonic counters. Admin or assigned-device runner can increment via Firestore `DocumentTransform.increment` (atomic). |
| `assignedDeviceIds` | array&lt;string&gt; | Devices receiving this batch's load. Size ≤ 10 — rules enforce it on every write. Rules also check each named device's `status != 'flagged'` at fan-out time. |
| `status` | string | `'draft' \| 'assigning' \| 'running' \| 'complete' \| 'failed'`. |
| `rateCap` | int | Batch-level rate cap applied to each assigned device. |
| `deviceProgress` | map | Per-device live progress (`{ [deviceId]: { sent, failed, lastUpdateAt } }`). Atomic field-transform increments only. |
| `createdAt` / `updatedAt` | timestamp | Standard. |
| `createdByOnBehalfOfUid` | string | Set when the admin uses **Create on behalf of** to attribute the batch to another user. |

**`sms_batches/{batchId}/recipients/{recipientId}`**: one document per CSV row.

| Field | Type | Purpose |
|---|---|---|
| `phone` / `name` / `vars` | string / string / map | Recipient + template variable substitutions. |
| `status` | string | `'pending' \| 'claimed' \| 'sent' \| 'failed' \| 'permanent_failure'`. |
| `claimedByDeviceId` | string | Holding device during a claim. |
| `claimedAt` | timestamp | Claim time; used to detect expired claims. |
| `attemptCount` | int | Per-recipient counter. Rules enforce `≤ maxAttempts`. |
| `maxAttempts` | int | Default 3. |
| `nextRetryAt` | timestamp | When backoff allows the next attempt. |
| `attemptHistory` | array&lt;map&gt; | Bounded (≤5 entries) audit trail. |
| `sentAt` / `sentByDeviceId` | timestamp / string | Set on terminal success. |

**Access.** Admin always. Assigned-device owners get whitelisted-field updates so the runner can write claim primitives, retry budget, and attempt history without escalating to admin.

### `sms_drafts/{draftId}`, `sms_templates/{templateId}`, `sms_quick_replies/{replyId}`

User-owned composition aids. Each has the same shape: `ownerUid`, `name` / `label`, `body`, `vars` (templates only), `createdAt`, `updatedAt`. Drafts auto-save every 2 seconds from the composer; templates are explicit; quick replies are one-tap inserts.

**Access.** Users own theirs; admin manages all. `ownerUid` immutable on update.

### `sms_contacts/{contactId}` + `sms_contact_groups/{groupId}`

Per-user address book sync. `sms_contacts` rows hold `phone`, `displayName`, `tags`, `groupIds`, `ownerUid`. `sms_contact_groups` hold `name`, `description`, `memberCount`, `ownerUid`.

The on-device address book itself is **never** synchronised here. We only persist contacts the user has explicitly used as recipients or added to a group.

### `sms_guest_quota/{guestId}`

Pre-login allowance mirror. Lets the unauthenticated `/send-message` surface enforce the 10-SMS guest cap.

| Field | Type | Purpose |
|---|---|---|
| `guestId` | string | Opaque client-generated ID. Doc id must equal this value. |
| `count` | int | 0–10. Monotonic non-decreasing; rules enforce both. |
| `createdAt` / `updatedAt` | timestamp | Standard. |
| `linkedUid` | string | Filled on the user's first login to associate the pre-login allowance with the account. |
| `linkedAppIdentifier` | string | Optional Capacitor-backed identifier for cross-device linking. |
| `linkedAt` | timestamp | First-login stamp. |

**Access.** Anyone may read. Anonymous create with the shape-enforced "guest write" payload. Updates split: (a) anonymous quota bump (count + updatedAt only); (b) authenticated link stamp (link fields only, count unchanged).

## Auxiliary collections

| Collection | Purpose | Access |
|---|---|---|
| `sms_settings/{settingId}` | Global feature toggles + limits. | Read: any auth user. Write: admin. |
| `sms_config/{docId}` | Remote app configuration (rate cap defaults, fair-use thresholds, ad targeting). | Read: any auth user. Write: admin. |
| `sms_advertisements/{adId}` | Promotional surfaces shown on public pages. | Read: public (anyone). Write: admin. |
| `sms_ad_user_state/{stateId}` | Per-user ad impression / click / dismissal tracking. | User reads/writes their own. Admin reads all; admin-only delete. |
| `sms_contact_submissions/{submissionId}` | Contact-form messages. | Anonymous create with strict shape. Read: submitter + admin. Update/Delete: admin only. |
| `sms_blog_posts/{postId}` | Blog content. | Published readable by any auth user. Drafts admin-only. Write: admin. |
| `sms_user_files/{userId}` | FilesHub upload references. | User reads/writes their own. Admin manages all. |
| `sms_user_achievements/{achievementId}` | Achievement / badge progress. | User reads/writes their own. Admin-only delete. |
| `sms_user_usage/{usageId}` | Per-user feature usage counters used by `featureLimits`. | User reads/writes their own. Admin-only delete. |

## Indexes

The indexes that back the user-facing queries live in `firestore.indexes.json`. The query coverage audit at [`docs/FIREBASE-QUERY-COVERAGE-AUDIT.md`](https://github.com/aoneahsan/smsapp-docs/blob/main/REFERENCE.md) in the main repo is the authoritative list. Every `where`-with-`orderBy` combination, every `array-contains` query, and every cursor-paginated list has a matching composite index.

Deploy with `firebase deploy --only firestore:indexes`. Never `firebase deploy --only firestore` — that deletes indexes.

## Where the schema lives in code

TypeScript types: `src/types/sms.ts`, `src/types/admin.ts`, `src/types/batch.ts`. Service modules that own each collection's reads/writes: `src/lib/smsJobs/`, `src/lib/smsBatches/`, `src/lib/smsDevices/`, `src/lib/smsUsers/`, `src/lib/contacts/`, `src/lib/drafts/`, `src/lib/templates/`, `src/lib/quota/`. Rules: `firestore.rules`.

Adding a new collection touches all three: the type, the service module, and a fresh `match /sms_xxx/{id}` block in `firestore.rules`. The emulator-gated suite in `src/test/firestore.rules.test.ts` (~1500 lines) is where the rule's allow/deny matrix is exercised.
