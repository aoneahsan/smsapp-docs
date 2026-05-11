---
title: Privacy and data handling explained
description: What SMS Mobile App stores, what stays on-device only, what we never collect, and how to inspect and delete your data at any time.
sidebar_position: 5
sidebar_label: Privacy & data handling
slug: privacy-and-data-handling
keywords: [sms mobile app privacy, sms app data handling, on-device contacts sms, gdpr sms app, account deletion sms]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Privacy and data handling

The privacy posture is one of the design pillars. The product is free, distributed, and Android-first — and it is also explicit about what data exists where, what we collect, and what is never collected. This page is the conversational form of the privacy policy; the formal version lives at [smsapp.aoneahsan.com/privacy](https://smsapp.aoneahsan.com/privacy) and the Data Safety form on Play Store is its summary.

## The three places data lives

Everything the app touches lives in one of three places, with different lifetimes and access rules.

**On your device only.** The system SMS log (Android's `Telephony.Sms` provider) records every sent message — sender, recipient, body, timestamp. That log is owned by Android, viewable from the system Messages app, and not read by SMS Mobile App. Your address book is read on-demand only when you tap **From contacts** in the composer; the address book itself is never uploaded. Capacitor Preferences storage holds your local-only settings (selected SIM index, last-used template). None of these leave your device.

**Your Firestore documents.** Your `sms_users/{uid}` profile, your composed jobs (`sms_jobs`), your saved templates (`sms_templates`), drafts (`sms_drafts`), groups (`sms_contact_groups`), and the subset of your address book you have explicitly used as recipients (`sms_contacts`). These are scoped to your Firebase UID and protected by the security rules — only you and the admin can read them. Each row carries `ownerUid == request.auth.uid`, enforced server-side.

**Aggregated analytics.** Sanitized event records in Firebase Analytics, Amplitude, and Microsoft Clarity. These carry counts (number of sends, click positions, time-on-page) and never carry phone numbers, message bodies, or email addresses. Sentry receives error stack traces with PII scrubbing applied at the breadcrumb pipeline.

## What we deliberately do not collect

The list below is as important as the list of what we do collect.

We do not collect the **content of incoming SMS**. The app does not request `READ_SMS` or `RECEIVE_SMS`. Your inbox is invisible to us.

We do not collect the **call log**. No `READ_CALL_LOG` permission is declared.

We do not collect **location**. No `ACCESS_FINE_LOCATION`, no `ACCESS_BACKGROUND_LOCATION`. The product has no location-dependent feature.

We do not collect your **full address book**. We read contacts only when you tap **From contacts**, and we persist only the recipients you explicitly select. Names and numbers of unrelated contacts are never uploaded.

We do not collect **device identifiers Google flags as high-risk**. No IMEI, no MAC address, no Android Advertising ID for identification purposes. Per-install identification uses a Capacitor-Preferences–backed `appIdentifier` (an opaque UUID we generate at install time).

We do not collect **payment information**. The product is free; there is no payment flow.

We do not run **third-party SDKs that load remote code**. No Google Tag Manager, no AdMob, no `gtag.js` injected from a CDN. The browser extension companion explicitly avoids Firebase Auth's `signInWithPopup` for the same reason (Chrome Web Store policy). Every SDK in the bundle is statically linked at build time, scanned for remote-code-loading patterns before release.

## What we do collect and why

**Account profile (`sms_users/{uid}`).** Email, display name, photo URL from Google. We need these to identify you across devices and to render the welcome message in the dashboard. The email is also the gate for admin access (single hard-coded address). Removing your account removes this row.

**Jobs and recipients (`sms_jobs`, `sms_batches`, `sms_batches/{id}/recipients`).** The messages you composed, the recipients you addressed, the schedules you set. These are the *product* — without them there is nothing to send. We retain them for 90 days after a job's terminal state (`sent` / `failed` / `cancelled`) so the audit trail is browsable, then auto-delete.

**Logs (`sms_logs`).** Append-only audit trail of dispatch attempts: attempt number, result, error code, device that handled it, timestamp. No message body, no recipient number — those are joined back from the parent job document. Retained for 30 days for support investigations.

**Device registry (`sms_devices`).** One row per registered SIM device — owner UID, device label, opted-in flag, health-score, last-heartbeat timestamp. Used for pool matchmaking. Soft-deletes (status `'deleted'`) are retained 7 days for accidental-deletion recovery, then purged.

**Drafts and templates (`sms_drafts`, `sms_templates`).** Your saved composition aids. Retained indefinitely while your account is active; deleted with your account.

**Settings and preferences (`sms_users.preferences`).** Theme, default SIM, default rate cap, pool participation flag. Retained for the life of your account.

**Achievement and usage counters (`sms_user_achievements`, `sms_user_usage`).** Per-user feature-limit usage and badge progress. Retained indefinitely while your account is active.

**Contact-form submissions (`sms_contact_submissions`).** Messages you send through the contact form. Carries the device info you submit (browser user agent, screen size). Resolved tickets retained 1 year for product analysis, then purged.

**Analytics events.** 272 event names instrumented across the app. Each event carries non-PII parameters (counts, durations, version numbers). Firebase Analytics retention follows the Firebase project's setting (14 months default). Amplitude retention is configured per Amplitude project plan. Microsoft Clarity retains session recordings for 90 days.

## How privacy is enforced at the rules layer

`firestore.rules` is the canonical enforcement. Every per-user collection (`sms_jobs`, `sms_templates`, `sms_drafts`, etc.) carries the same shape: `ownerUid == request.auth.uid` is required to read, create, update, or delete. The full per-collection matrix is in [Security rules](/reference/security-rules).

Two exceptions exist by design, and both are explicitly bounded.

**Multi-actor batch sends.** When you send a batch, the runner runs as the volunteer device's user — not as you. The `isAssignedDeviceOwner()` rule lets the runner write *only* progress fields (`status`, `sentByDeviceId`, `attemptCount`, etc.) on the specific recipient row. The runner cannot read the parent batch's recipient list except by the rule path that requires the runner's own device ID to be in the batch's `assignedDeviceIds`. The runner cannot escalate to read anything else of yours.

**Anonymous guest quota.** Pre-login `/send-message` writes to `sms_guest_quota/{guestId}` with no auth. The rule constrains the write to a strict shape (`count <= 10`, monotonic, no other fields settable). No PII is stored. On first login the guest record is linked to the user UID; from then on the user's authenticated path takes over.

These exceptions are documented in the rules file itself with the rationale next to the rule.

## Account deletion

Account deletion is one path: sign in, go to `/account-deletion`, follow the in-app guide. The flow:

1. We confirm your intent with a typed confirmation (your email).
2. We delete `sms_users/{uid}`, then all owned documents across every per-user collection (jobs, batches, devices, drafts, templates, contacts, groups, quick replies, achievements, usage, ad state, files).
3. The orphaned `sms_logs` rows are admin-deleted in the next purge cycle (within 24 hours).
4. The Firebase Auth user record is deleted via the admin SDK.
5. Aggregated analytics events are not user-identifiable and remain in the analytics platforms' retention windows; they cannot be back-traced to you because no PII was ever stored.

Within 24 hours of confirmation, every per-user record is gone. The product holds no copies, no soft-deletes, no recovery snapshots. The deletion is irreversible by design.

The [Account Deletion](https://smsapp.aoneahsan.com/account-deletion) page walks through the click path and is a Play Store policy requirement.

## Data export

The dashboard supports CSV export of your batches and per-recipient history. For a full export of all your data, contact support — the email from the [Contact](https://smsapp.aoneahsan.com/contact) page reaches the operator inbox and gets you a complete dump (JSON) of every row keyed to your UID. This is a manual process for now; an automated self-service export is on the roadmap.

## Why we can be aggressive about minimisation

The product's commercial model is built on minimisation. We are zero-cost; we do not monetise data. There is no ad targeting because there are no ads worth targeting (the in-app `sms_advertisements` collection serves house ads only — links to other Aoneahsan/Zaions products that the operator built and trusts). There is no data brokering because no broker would pay for the de-PII'd aggregate we hold. Minimisation is a free win.

It is also the only posture that survives Play Store policy review. The `SEND_SMS` permission category is a high-risk gate; apps with that permission have to demonstrate they collect only what is necessary for the user-visible function. Our minimum collection set maps cleanly onto our user-visible functions, which is what the **Permissions Declaration** in Play Console accepts.

## Reading further

The formal policy is at [/privacy](https://smsapp.aoneahsan.com/privacy). The Play Store summary is the [Data Safety](https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp) section on the listing. The deletion how-to is at [/account-deletion](https://smsapp.aoneahsan.com/account-deletion). The contact path for export and grievances is at [/contact](https://smsapp.aoneahsan.com/contact). The security-rules deep dive is at [Security rules](/reference/security-rules).
