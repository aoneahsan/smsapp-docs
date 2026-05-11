---
title: How-to guides
description: Problem-oriented recipes that solve one specific task at a time. Each guide assumes you already know the product and need a precise answer.
sidebar_position: 1
sidebar_label: Overview
keywords: [sms how-to, sms mobile app guide, send sms android, schedule sms recipe]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# How-to guides

A how-to is a **recipe**. You arrive with a specific problem (`How do I import contacts from a CSV?`), you find the page, you do the steps, you leave. Each guide is short, numbered, and assumes you've already used the product at least once.

If you're new, start with [Tutorials](/tutorials) instead.

## Authentication, devices, and contacts ✅ shipped (Batch 3)

Recipes for getting your account set up, linking phones, and getting recipient data into the system.

1. [Sign in with Google](/how-to/auth-and-devices/sign-in-with-google) — OAuth flow, multi-account pitfall, popup blockers, unauthorised-domain error
2. [Register your Android device](/how-to/auth-and-devices/register-your-android-device) — install, sign-in matching, confirm on dashboard, re-register
3. [Manage volunteer pool participation](/how-to/auth-and-devices/manage-volunteer-pool-participation) — opt in/out, rate cap, authorised accounts list, sync between dashboard and app
4. [Import contacts from a CSV file](/how-to/auth-and-devices/import-contacts-from-csv) — column requirements, personalisation tokens, validator output
5. [Grant SMS and Contacts permissions](/how-to/auth-and-devices/grant-sms-permissions) — runtime prompt, recovery from decline, manual Settings path, battery optimisation
6. [Switch SIM on a dual-SIM phone](/how-to/auth-and-devices/switch-sim-on-dual-sim) — per-device default, per-job override, OS-level fallback

## Sending SMS ✅ shipped (Batch 4)

Single sends, silent batch sends, templates, drafts, scheduling, retries.

1. [Send a single UI-prompted SMS](/how-to/sending-sms/send-a-single-ui-prompted-sms) — when to use UI-prompted vs silent, the system-composer flow, lock-screen behaviour
2. [Send a silent batch SMS](/how-to/sending-sms/send-a-silent-batch-sms) — the Android foreground service, why it's mandatory, rate caps, offline queueing, pause/resume/cancel
3. [Use templates](/how-to/sending-sms/use-templates) — save reusable bodies with `{{token}}` substitution, apply to single sends or batches, edit/version/delete
4. [Save and reuse drafts](/how-to/sending-sms/save-and-reuse-drafts) — auto-save, manual save with names, cross-device sync, draft-vs-template distinction
5. [Schedule a recurring SMS](/how-to/sending-sms/schedule-a-recurring-sms) — Daily/Weekly/Monthly/Custom cron, end-conditions, timezone behaviour, DST handling
6. [Retry failed messages](/how-to/sending-sms/retry-failed-messages) — transient-vs-permanent classification, exponential backoff, manual retry, when retry is the wrong fix

## Admin (jobs, batches, rate control) — Batch 5

Create jobs, assign batches to volunteer devices, configure rate limits, handle failures, enforce the 10-device cap. Pages land in Batch 5.

## Voice and tone

How-to guides on this site follow three rules consistently:

- **Numbered steps for the doing.** Every recipe has a numbered procedure you can follow without reading the surrounding prose.
- **Honest framing on limits.** Each page is candid about what doesn't work — Google Play SMS-permission policy, iOS API limits, ROM-specific battery management, carrier anti-spam thresholds.
- **No fabricated UI.** When a label or path is uncertain, the recipe says so explicitly rather than inventing a confident-sounding name.
