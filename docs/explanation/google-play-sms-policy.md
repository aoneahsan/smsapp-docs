---
title: Compliance — Google Play SMS-permission policy
description: How we comply with Google Play's SMS-permission policy — the Permissions Declaration we submit, the rejection patterns we mitigate, and the runbook for staying on the store.
sidebar_position: 7
sidebar_label: Google Play SMS policy
slug: google-play-sms-policy
keywords: [google play sms permission policy, send_sms play store, permissions declaration sms, play store sms rejection]
last_update:
  date: 2026-06-22
  author: Ahsan Mahmood
---

import V1Status from '@site/docs/_partials/_v1-release-status.mdx';

# Compliance — Google Play SMS-permission policy

<V1Status />

`SEND_SMS` is a Google Play **high-risk permission**. Apps that request it must pass an extra review gate called the **Permissions Declaration** form. The form has rejected many SMS apps and continues to reject them on every policy update. This page explains how SMS Mobile App passes the gate, the trade-offs in the declaration, and the runbook for surviving policy revisions.

This is not a "we are safe forever" page. The policy is moving ground; the most we can claim is a clear-eyed view of how the policy reads today and what the app does to align.

## What the policy actually says

The current Google Play **Permissions Declaration** for `SEND_SMS` (and the closely-related `READ_SMS`, `RECEIVE_SMS`, `READ_CALL_LOG`) requires the app to declare a single **core use case** from a fixed list. The list includes things like "default SMS handler", "Wear OS app that runs on a watch", "two-factor authentication app that auto-fills codes", "device backup app", and so on. There is no "automation" entry on the list, and there is no "bulk send" entry.

Apps that request `SEND_SMS` without matching one of the listed use cases are usually rejected. The official guidance is to either (a) become the default SMS handler (which means RECEIVE_SMS, READ_SMS, MMS, RCS, basically a fully-featured SMS replacement — see [Why we are not a default SMS handler](/explanation/not-a-default-sms-handler)), or (b) eliminate the permission and pivot to a SIP-trunk model. Neither is a fit for our product.

The third path — which is the path we walked — is a careful Permissions Declaration that argues the use case **fits a valid pattern not explicitly listed**, supported by a thorough demonstration that the app is not a spam vehicle. The declaration is reviewed by a human; the human grants or rejects.

## What we declare

The Permissions Declaration form we submit reads (paraphrased — the actual form has fields we fill in):

> **App name:** SMS Mobile App
> **Use case selected:** "Other use case not listed"
> **Use case description:** SMS Mobile App is an end-user productivity tool for sending SMS from the user's own SIM. The user composes the message in the app, selects recipients from their device contacts or a CSV they own, and sends through their own carrier. The product is free; there is no per-send markup. SMS Mobile App is not a default SMS handler — we explicitly do not declare RECEIVE_SMS, READ_SMS, or any other inbox/MMS/RCS permission. Send-only by design.
> **Core feature delivered by `SEND_SMS`:** The user-composed batch send — for example, appointment reminders that a clinic owner sends from their own SIM at a configurable rate. Without `SEND_SMS` the user has to tap **Send** in the system composer for every message, which makes batches impractical.
> **Why no less-invasive alternative works:** `MFMessageComposeViewController`-equivalent intents (`ACTION_SENDTO`) are available, but they require a user tap per message. For a batch of 100 reminders that is 100 taps, which defeats the purpose of the product. SIP-trunk alternatives are paid services that violate our zero-cost commitment to users.
> **Anti-abuse posture:** Per-account daily volume cap (2,000/day default); per-device rate cap (6/min default, 30/min hard ceiling); 10-device fan-out cap enforced server-side; fair-use review for higher caps; auto-flag for devices with consistent failures; opt-in volunteer pool with reciprocity tracking; account-deletion path that purges all user data within 24 hours.

This is what the human reviewer sees. The form has been submitted across multiple releases; the declaration's contents are stable.

## What makes the declaration believable

Three things keep the declaration credible.

**The permission set is minimal.** We declare `SEND_SMS`, `READ_CONTACTS` (optional, for recipient autocomplete), `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC`, `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`, `INTERNET`, `ACCESS_NETWORK_STATE`, `POST_NOTIFICATIONS`, `VIBRATE`. Nothing else. The complete list — and the deliberate **list of permissions we do NOT request** — is in [Permissions reference](/reference/permissions).

The merged manifest is what Play Store actually sees. Capacitor/Cordova plugins inject permissions during the build merge that are not in our source manifest. The pre-flight script in `tools/audit-merged-manifest.ts` (referenced from `android/CLAUDE.md`) compares the merged manifest against an allow-list every release. Any drift blocks the AAB build until the offending plugin is removed, swapped, or formally declared.

**The privacy policy backs every permission.** Every sensitive permission has a matching section in the privacy policy explaining what we read, why, and what we do not collect. The privacy URL is publicly accessible (verified in incognito each release), in HTML (not PDF), and dated. The Play Console Data Safety form mirrors the same rows.

**The product UX matches the declared use case.** A reviewer who installs and runs the app sees: a clean compose flow with a system-permission prompt before any send, a visible foreground notification during automation, a clear pause/stop control, no inbox view, no incoming message handling. If we shipped a UI that looked like a default SMS handler — even a partial one — the declaration would fail the manual review.

## What review risk looks like in practice

Three things have historically caused SMS apps to be rejected.

**Permission drift via plugins.** A Capacitor plugin upgrade adds `READ_SMS` to the merged manifest. The reviewer notices. Rejected. Fix: the merged-manifest audit catches it before submission.

**Marketing copy that overclaims.** The Play listing description claims "manage your inbox" or "AI auto-reply." Both imply `READ_SMS` / `RECEIVE_SMS`. Even if the manifest is clean, the listing copy lies. Fix: the listing copy is reviewed against the actual permission set on every release. The [App Store Listing Compliance](/explanation/google-play-sms-policy#listing-compliance) checklist below is run pre-submission.

**Bulk-send appearance without anti-abuse evidence.** The reviewer sees a high-recipient batch import and concludes "this is a spam tool." Fix: the in-app fair-use thresholds and the rate caps are visible in the dashboard, the listing screenshots show them, the privacy policy describes them, and the Permissions Declaration enumerates them.

We have a non-zero chance of rejection on any given release. The Permissions Declaration is reviewed by humans, and humans apply judgment. Our pre-flight checklist is the best mitigation, not a guarantee.

## Listing compliance

The Play Store listing itself has its own policy layer separate from permissions. The full rule set lives in a global workspace reference (`~/.claude/play-console-rejection-rules.json`) mirrored across all our apps. The SMS Mobile App listing follows the workspace-wide rules:

**No keyword stuffing.** The description is natural prose, not a keyword list. No comma-separated "sms, send, bulk, automation, schedule, reminder, customer, marketing, business…" walls.

**No ranking claims.** No "best", "top", "#1", or "leading". No fabricated user counts. No fake testimonials.

**No content that overclaims permissions.** As covered above — no "inbox", "AI reply", "MMS support" copy.

**Description matches functionality.** Every feature listed in the description is actually implemented and demonstrable in screenshots. The screenshots are real captures, not Photoshop mockups.

**Privacy and account-deletion URLs work in incognito.** Both are tested before every submission.

**Data Safety form mirrors the privacy policy.** Every declared permission and every collected field is in both places, with identical wording.

## What happens if we get rejected

A rejection is a setback, not a death sentence. The product stays installed on existing devices; the listing pulls; the developer console explains the reason; we have 14 days to reply with a corrected build or a clarification.

The runbook for a rejection:

1. Read the rejection message carefully. The reviewer's exact words tell us which rule was triggered.
2. If the trigger was permission drift, re-run the merged-manifest audit. Identify the offending plugin. Either remove it, swap it for one without the permission, or formally declare it in the next submission's privacy + Data Safety.
3. If the trigger was listing copy, edit the listing and resubmit. No code change needed.
4. If the trigger was anti-abuse evidence, expand the in-app rate caps and fair-use screens. Include screenshots in the next submission.
5. If the trigger was the Permissions Declaration itself, refine the use-case description. The reviewer is asking for specifics; provide them. The most common refinement is adding concrete user scenarios ("clinic appointment reminders, school parent notifications, small-business order updates").

The rejection log is tracked at `docs/play-store-app-rejection-reasons/` in the main repo. We have not faced a rejection on this app yet; the log exists to capture future patterns.

## Why we accept the risk

The risk of rejection is real, and we accept it because the alternatives are worse.

**Pivoting to default-SMS-handler** would require RECEIVE_SMS, MMS, RCS, and the responsibility of replacing the system Messages app. That is a different product. See [Why we are not a default SMS handler](/explanation/not-a-default-sms-handler) for the deeper trade.

**Pivoting to SIP-trunk** would make the product paid. The whole positioning collapses.

**Distributing outside the Play Store** (sideload-only, F-Droid, alternative stores) would shrink reach to a single-digit-percentage of the addressable market. Maintained as a parallel option (the GitHub releases page hosts signed APKs for non-Play installs), but not the primary distribution.

The Permissions Declaration path is the right path for this product. We work hard to honour it. So far, the gate has held.

## Reading further

The full [Permissions reference](/reference/permissions) lists every Android permission we declare and explicitly do not declare. The [Privacy and data handling](/explanation/privacy-and-data-handling) page covers the privacy policy that backs the declaration. The [Volunteer device pool](/explanation/volunteer-device-pool) and [Quotas & limits](/reference/quotas-and-limits) pages cover the anti-abuse posture that makes the use case defensible.
