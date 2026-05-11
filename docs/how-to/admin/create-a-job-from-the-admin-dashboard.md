---
title: How to create a job from the admin dashboard
description: Compose a one-off, scheduled, recurring, or batch SMS job from the admin dashboard. Covers job types, cross-user creation as admin, and the audit trail.
sidebar_position: 1
sidebar_label: Create a job
slug: create-a-job-from-the-admin-dashboard
keywords: [sms admin dashboard, create sms job, sms mobile app admin, job types, cross-account admin]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Create a job from the admin dashboard

The admin dashboard is the create-and-monitor centre for everything the product dispatches — single sends, scheduled sends, recurring schedules, and batches. This recipe walks through the unified **New job** flow that covers all four, the admin-only **Create on behalf of** option for accounts you have authority over, and the audit trail every created job leaves behind.

## Prerequisites

A signed-in dashboard session. Most of this flow works for any account; the **Create on behalf of** option is gated to accounts with the `admin` role in their Firestore `users/{uid}` document. Awareness of the [Send a silent batch SMS](/how-to/sending-sms/send-a-silent-batch-sms) and [Schedule a recurring SMS](/how-to/sending-sms/schedule-a-recurring-sms) recipes, which the admin flow extends rather than replaces.

## Open the New Job creator

Click **Jobs → New job** in the navigation, or use the `+` button visible on every Jobs-related screen. The composer opens with five tabs running across the top: **One-off**, **Scheduled**, **Recurring**, **Batch**, and **Template-based**. Each tab shapes the rest of the form to the inputs that job type needs.

The five job types differ as follows:

- **One-off** — single recipient, immediate dispatch on save. Equivalent to the basic Send Message flow.
- **Scheduled** — single recipient, fires at a chosen date/time. Equivalent to the [Send your first scheduled SMS](/tutorials/send-your-first-scheduled-sms) flow.
- **Recurring** — single or multiple recipients, fires on Daily/Weekly/Monthly/Custom cron. Covered in [Schedule a recurring SMS](/how-to/sending-sms/schedule-a-recurring-sms).
- **Batch** — many recipients (CSV or contact picker), one body per recipient with `{{token}}` personalisation. Covered in [Send a silent batch SMS](/how-to/sending-sms/send-a-silent-batch-sms).
- **Template-based** — any of the above types, but the body is preloaded from a saved template. Covered in [Use templates](/how-to/sending-sms/use-templates).

Picking a tab is reversible — your in-progress draft persists across tabs, so switching from **One-off** to **Batch** doesn't lose the recipient or body.

## Fill in the common fields

Every job, regardless of type, has these fields:

1. **Recipient(s)** — one number for One-off/Scheduled, optionally many for Recurring, always many for Batch.
2. **Body** — the SMS text, with character counter and segment counter.
3. **Send mode** — UI-prompted or Silent. Defaults to UI-prompted for One-off/Scheduled with single recipient, Silent for Batch (the only way that scales).
4. **Send via (device)** — picker showing your linked devices. Single-device pick for One-off/Scheduled/Recurring; multi-device for Batch.
5. **Rate cap (Batch only)** — messages/min per device for the batch. Default 6/min.

The type-specific fields (schedule timestamp, recurrence pattern, CSV upload, template picker) appear in the section below the common fields, depending on which tab you're on.

## Admin-only: Create on behalf of

If your account has `admin: true` in the Firestore `users/{uid}` document, an extra field appears at the top of the composer: **Create on behalf of**. The default is your own account; the dropdown lists every account you have authority over (organisation members, sub-accounts, accounts that explicitly invited you to act on their behalf).

When you create a job on behalf of another account:

- The job document is owned by that account, not yours — it appears in their Jobs list, their batches list, their analytics.
- The audit trail records `createdBy: <your-uid>` and `ownedBy: <their-uid>` so the action is fully attributable.
- The dispatching device is constrained to devices linked to the owning account, not yours — admin status does not grant access to other accounts' SIMs.
- The owning account receives an in-dashboard notification (and an email if they've opted in) that "Admin `[your name]` created a job on your behalf".

This is the right mechanism for support staff resolving a tier-2 ticket ("please send the missed reminder for me"), for organisation admins running multi-team batches, and for legal/compliance staff testing the same flow a customer is testing. It is not a god-mode override of fair-use boundaries — every cap that applies to the owning account still applies.

## Verify and fire

Click **Review** to see the full job summary: type, owning account (if different), recipients, body, send mode, schedule, assigned device(s), rate cap. The review screen is the last place to catch typos and wrong-account mistakes before firing.

Click **Fire** (or **Save** for scheduled/recurring jobs that don't fire immediately). The dashboard creates the job document(s) in Firestore — one parent `sms_jobs` for single/scheduled/recurring, or one parent `sms_batches` plus N child `sms_jobs` for batches — and the appropriate dispatching device(s) pick them up through the live subscription within seconds.

The post-fire screen redirects to the job's detail view, which shows live status as the message(s) dispatch.

## Audit trail

Every created job records an immutable audit entry in the `sms_audit` collection:

- `eventType: 'job.create'`
- `jobId: <new doc id>`
- `createdBy: <uid>` (the user who clicked Fire)
- `ownedBy: <uid>` (the owning account, may differ if admin-created)
- `payload: { type, recipientCount, body length, sendMode, scheduledAt?, recurrence?, deviceIds }`
- `timestamp: <server time>`

The audit log is visible on the dashboard's **Admin → Audit log** screen (admin role required) and is included in any compliance export. It cannot be edited or deleted from the UI; audit-trail integrity is a server-side guarantee.

## Common errors

If **Fire** is greyed out, one or more required fields is empty or invalid. The Review screen marks each issue inline; usually it's an unparseable recipient number or a body that exceeds the segment limit at your account's tier.

If the **Create on behalf of** dropdown shows only your own account when you expected to see others, you may have lost the admin authorisation on those accounts (org membership ended, sub-account access revoked). Confirm with the owning account that the authorisation still stands.

If the job document is created but never dispatches, the assigned device is offline or the owning account has been suspended for fair-use violations. The job's detail view surfaces the underlying state.

## Where to go next

For fanning a batch across multiple devices instead of one, continue to **Assign a batch to volunteer devices**. For watching the live per-recipient progress of a fired batch, **Monitor job + batch progress** is the next recipe.
