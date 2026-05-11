---
title: Quotas, limits, fair-use thresholds reference
description: Every quantitative limit enforced by SMS Mobile App — guest quota, device cap, batch size, per-device rate caps, retry budget, and fair-use ceilings.
sidebar_position: 7
sidebar_label: Quotas & limits
slug: quotas-and-limits
keywords: [smsapp quotas, smsapp rate limits, sms mobile app fair use, 10 device cap, guest quota sms]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Quotas, limits, fair-use thresholds

The app enforces a set of numeric ceilings. Some exist because of platform constraints (Firestore document size, Android carrier behaviour); others exist because of explicit product policy (fair-use across volunteers, anti-abuse). This page consolidates every number in one place so support, ops, and curious users can read the limits without having to reverse-engineer them from the codebase.

Each row notes **where** the limit is enforced — server-side rules, client-side service module, or remote `sms_config` — so it is clear whether a value is movable per environment or hard-coded.

## Pre-login guest allowance

| Limit | Value | Enforced where |
|---|---|---|
| Free SMS before sign-in | **10** per opaque guestId | `firestore.rules` on `sms_guest_quota` (`count ≤ 10`, monotonic non-decreasing) + client mirror in Capacitor Preferences. |
| Guest record retention | Indefinite (linked to UID on first login) | Client + rules; admin can delete for fraud cleanup. |
| Anonymous write surface | Only `count`, `guestId`, `createdAt`, `updatedAt` may be set anonymously | `firestore.rules` (the `isGuestWriteShape` helper). |
| Linking | Only an authenticated user can stamp `linkedUid`, `linkedAppIdentifier`, `linkedAt`; the `count` must not change on the link write | `firestore.rules` (the `isLinkWriteShape` helper). |

The 10-SMS allowance is **per guestId**, not per device. The guestId is generated client-side and stored in Capacitor Preferences, so reinstalling the app or clearing storage produces a fresh guestId — but in practice we observe near-zero abuse because the in-app composer requires the user to verify their own number for the first send.

## Per-message limits

| Limit | Value | Enforced where |
|---|---|---|
| Phone number length | 7–20 chars | `firestore.rules` `isValidPhone()`. |
| Message body length | 1–500 chars | `firestore.rules` `isValidMessage()`. |
| GSM-7 single-segment | 160 chars | Reported by `smsSegments.ts` in the composer; not a hard cap. |
| UCS-2 single-segment | 70 chars | Same — composer warns when a non-GSM-7 character bumps the segment count. |
| Max segments per message | 6 segments | Composer warning at 4, hard stop at 6. |

The 500-char rule cap is a sanity bound. Carriers typically charge per 160-char (GSM-7) or 70-char (UCS-2) segment regardless of what we cap at. The composer surfaces the segment count and estimated carrier-charge breakdown in real time.

## Job & retry limits

| Limit | Value | Enforced where |
|---|---|---|
| `attemptCount` on creation | Must be `0` | `firestore.rules` `isValidJobCreate()`. |
| `status` on creation | Must be `'pending'` | `firestore.rules` `isValidJobCreate()`. |
| Default `maxAttempts` per recipient | **3** | `BatchSendRunner.java` + `recipientReclaimService.ts`. Configurable per-batch via the admin dashboard. |
| Backoff schedule | Exponential with jitter: `30s × 2^retryCount + random(0..15s)` | `smsAutomation/` retry helper. |
| Permanent-failure no-retry codes | `INVALID_NUMBER`, `BLOCKED_BY_USER`, `CARRIER_REJECT_PERMANENT` | Client classifier in the runner. |
| Bounded attempt history | **5** entries max per recipient | `firestore.rules` on `sms_batches/{id}/recipients/{rid}` (`attemptHistory.size() ≤ 5`). |
| Job-claim expiry | **5 minutes** without progress | `recipientReclaimService.ts` sweeps and releases. |

## Device & batch limits

| Limit | Value | Enforced where |
|---|---|---|
| **Max devices per batch (hard cap)** | **10** | `firestore.rules` on `sms_batches` (every create + update). |
| Max batches per admin per day (default) | 5 (configurable via `sms_config`) | Client + admin dashboard. |
| Default per-device rate cap | **6 SMS/minute** | Volunteer-chosen at registration; runner enforces in-process. |
| Maximum per-device rate cap | **30 SMS/minute** | Hard cap in the runner — even if a user requests higher, the runner clamps. |
| Per-account aggregate ceiling | 200 SMS/hour by default; higher via fair-use review | `sms_config` (remote). |
| Device-rename cooldown | **7 days** between renames | `firestore.rules` on `sms_devices` (`request.time ≥ deviceNameLastEditedAt + duration.value(7,'d')`). |
| Auto-flag threshold (device health) | 5 consecutive failures → `status = 'flagged'` | Client + runner; rules enforce that only `'active'` ↔ `'flagged'` can be toggled by non-admin. |
| Auto-flag clear duration | Configured per environment (default 24h) | Stored in `sms_devices.flagAutoClearAt`. |
| Flagged-device fan-out gate | No batch can fan out to a flagged device | `firestore.rules` on `sms_batches` (`areAllAssignedDevicesHealthy()`). |
| `recentSendOutcomes` audit | Bounded to ~50 entries client-side | `smsDevicesService.ts`. |

The 10-device cap is the single most-asked-about ceiling. The full rationale is in [Enforce the 10-device cap](/how-to/admin/enforce-the-10-device-cap). Briefly: it prevents single-account monopolisation of the volunteer pool, limits carrier-side anti-spam exposure, and keeps the Firestore rules-side iteration tractable (rules cannot loop arbitrarily — the 10-element walk is hand-unrolled).

## Batch size limits

| Limit | Value | Enforced where |
|---|---|---|
| Recipients per batch | Up to **5,000** (soft, configurable via `sms_config`) | CSV import client + admin dashboard. |
| Recipients per batch (hard ceiling) | **10,000** | Server-side composite-write budget; beyond this, batch creation is rejected to protect Firestore write quotas. |
| Max sub-collection write rate | ~500 writes/sec per batch | Firestore platform limit — the runner is paced well below this. |
| CSV file size | 5 MB | Client upload cap (FilesHub-enforced). |
| Contact-form message length | 5,000 chars | `firestore.rules` `isValidContactSubmissionCreate()`. |

If a single workload would exceed 5,000 recipients, the admin dashboard splits it into multiple sequential batches (Campaign chunking). The user UX surfaces it as a Campaign card composed of N batches in serial.

## Form-input limits

| Limit | Value | Enforced where |
|---|---|---|
| Contact name | 1–100 chars | `firestore.rules`. |
| Contact email | 1–200 chars | `firestore.rules`. |
| Contact subject | 1–200 chars | `firestore.rules`. |
| Contact message | 1–5,000 chars | `firestore.rules`. |
| Template name | 1–120 chars | Client schema. |
| Template body | 1–500 chars | Client schema (mirrors message limit). |
| Draft body | 1–500 chars | Client schema. |
| Group name | 1–80 chars | Client schema. |

## Fair-use thresholds

Fair-use is the soft policy layer that sits above hard rules-enforced limits. Crossing a fair-use line does **not** auto-reject — it triggers a review.

| Threshold | Value | Trigger |
|---|---|---|
| Per-account daily volume (free tier) | 2,000 sends/day | Auto-paused; admin notified; user emailed with appeal instructions. |
| Per-account weekly volume | 10,000 sends/week | Same. |
| Recipient-uniqueness ratio | < 50% unique recipients per batch | Flagged for review — high duplication is a spam signal. |
| Failure ratio (sustained) | > 30% failures over 100+ attempts | Per-device auto-flag (covered above) + account flag in extreme cases. |
| Carrier-throttle ratio | > 20% `CARRIER_THROTTLED` errors per batch | Auto-backoff kicks in; the runner slows by 50% for the rest of the batch. |
| Upgrade path | `tier: 'fair_use_upgraded'` | Admin-managed via `/admin/users`. Raises daily/weekly caps. |

Detailed fair-use policy is at [/fair-use](https://smsapp.aoneahsan.com/fair-use) on the main app; the [How to configure rate limits](/how-to/admin/configure-rate-limits) recipe covers the operational levers.

## Session limits

| Limit | Value | Enforced where |
|---|---|---|
| ID-token refresh | Every **45 minutes** in background | `AuthProvider`. |
| Session restore on cold start | Yes (Firebase Auth persistence) | Default. |
| `EnvMissingScreen` blocker | Renders before any feature mounts if a required env is missing | `src/config/env.ts`. |

## Where these numbers come from

Every numeric limit traces back to one of three sources:

1. **`firestore.rules`** — the canonical, server-enforced ceilings (10-device cap, 500-char messages, attempt-history size, guest 10-SMS, etc.).
2. **`sms_config` Firestore collection** — admin-tunable remote configuration. `/admin/config` is the dashboard for these.
3. **Client constants** in the relevant service module — e.g. `recipientReclaimService.ts` for claim-expiry, `smsAutomation/` for backoff schedule.

When in doubt about a specific value in a deployment, the diagnostic at `/admin/diagnostics` prints the effective values for that environment.
