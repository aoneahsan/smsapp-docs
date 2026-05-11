---
title: Reference
description: Information-oriented technical lookup for SMS Mobile App. Routes, permissions, Firestore collections, configuration, quotas, and security rules — all in dense tables for quick scanning.
sidebar_position: 1
sidebar_label: Overview
keywords: [sms mobile app reference, sms api reference, smsapp permissions, smsapp firestore schema, smsapp env vars]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Reference

Reference is the **manual page**. Terse, accurate, exhaustive. Reach for it when you already know what you are looking for and want the precise details. The sections below cover the surface area that operators, integrators, and curious users need to look up.

Each page is the **authoritative answer** for its slice of the app. Every value cited here can be traced back to a single source file in the main repository (route definitions, env keys, Firestore rules, runner constants), and the source-of-truth file is named in each page's closing section.

## Sections

| # | Section | What you'll find |
|---|---|---|
| 1 | [Routes & screens](/reference/routes-and-screens) | Every public, protected, admin, error, and redirect route on the web dashboard. Layouts, auth gates, the URL-state contract. |
| 2 | [Permissions](/reference/permissions) | Every Android permission we declare, what it unlocks, when the runtime prompt fires, what happens if you decline. Plus the explicit list of permissions we deliberately do **not** request. |
| 3 | [Firestore data model](/reference/firestore-data-model) | Every `sms_*` collection — fields, types, indexes, relationships. Primary collections (jobs, batches, devices, drafts, templates) and auxiliary ones (ads, blog, achievements). |
| 4 | [Services & events](/reference/services-and-events) | The front-end service-module map (`src/lib/`) and the 270+ analytics event catalog, grouped by feature area. |
| 5 | [Configuration & env](/reference/configuration-and-env) | Every `VITE_*` and CLI environment variable. Required vs optional, where to obtain each value, what each one unlocks. |
| 6 | [Quotas & limits](/reference/quotas-and-limits) | The complete quantitative ceiling list: guest quota, 10-device cap, batch sizes, per-device rates, retry budget, fair-use thresholds. |
| 7 | [Security rules](/reference/security-rules) | Plain-English summary of `firestore.rules`. Per-collection access table, helper functions, multi-actor paths. |

## When to use Reference vs the other quadrants

If the question is **"how do I do X?"** — start in [How-to](/how-to). The recipes there walk through one task end-to-end.

If the question is **"what is X, and why?"** — start in Explanation (lands in Batch 7). The discussion pages cover design rationale and the why-behind-the-what.

If the question is **"what does the field `X` mean?" or "is rate cap configurable?"** — you are in the right place. Use the table of contents on the right of each page to jump to the exact row.

If you are new to the app, start in [Tutorials](/tutorials) first; this section assumes you already know what a job, a batch, and a device are.

## Conventions used throughout

- **Code identifiers** — `sms_jobs`, `VITE_SMS_SENDER_MODE`, `isAssignedDeviceOwner()` — match the names in the source verbatim.
- **Limits** quoted as numbers are exact values enforced in code; soft thresholds (fair-use) are flagged as such.
- **"Auth user"** means **any signed-in Google user**. SMS Mobile App accepts no other provider. Every privileged path enforces this server-side via the `isGoogleAuth()` rule helper.
- **"Admin"** means the single email `aoneahsan@gmail.com`. Adding more admins is a code change, not a config change.
- **Where it lives in code** — every Reference page ends with the source-of-truth file paths. Edits to behaviour must touch the source first, and this docs site is updated in the same release cycle.

## Last-updated dates

Each page carries a `last_update` date in its frontmatter. When code changes a documented value, the page must be updated and the date bumped in the same commit. The release cycle assumes the documentation is true on the day stamped — if the date is more than 30 days old, treat the page as advisory and check the cited source file before relying on it.
