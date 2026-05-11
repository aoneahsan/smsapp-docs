---
title: How to save and reuse SMS drafts
description: Save an in-progress send for later, edit it across devices, and dispatch it when ready. Covers auto-save, manual save, and the draft-vs-template distinction.
sidebar_position: 4
sidebar_label: Save and reuse drafts
slug: save-and-reuse-drafts
keywords: [sms drafts, save sms for later, sms mobile app draft, in-progress sms, cross-device drafts]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Save and reuse SMS drafts

A draft is a partially-composed send saved for later — recipient(s), body, schedule, assigned device, all preserved exactly as you left them. Drafts sync across your dashboard, Android app, and browser extension because they live in Firestore under your account, not in browser-local storage.

This is different from a template: a draft is one specific in-progress send (one recipient list, one specific message); a template is a reusable pattern (`"Hi {{name}}, ..."`) you apply to many sends. Templates are covered in **Use templates**; this recipe is about drafts.

## Prerequisites

A signed-in account. No additional permissions needed — drafts are server-side state, not a device-level feature.

## Auto-save

The composer auto-saves your work every few seconds. The save indicator under the body field shows the current state: **Editing**, **Saved a moment ago**, or **Save failed** (on network errors). You don't need to do anything to keep your work; closing the browser tab and reopening it later restores the draft exactly as you left it.

Auto-save creates a `sms_drafts` document in Firestore with `status: 'draft'` and writes back on every meaningful change — debounced to once every two seconds to avoid hammering Firestore on every keystroke. The document is owned by your account and visible only to you.

## Manual save with a name

Auto-save uses a system-generated title (`"Untitled draft 2026-05-11"`). For drafts you want to find later by name, give the draft an explicit title:

1. In the composer, click the **Save with name** button (or the pencil icon next to the auto-generated title).
2. Type a name — `"Q3 customer reminder"`, `"Birthday wish for Mom"`, `"Onboarding sequence step 2"`.
3. Click **Save**. The named draft replaces the auto-saved entry in your drafts list.

Named drafts appear at the top of the **Drafts** list, sorted by `updatedAt` descending. Auto-saved untitled drafts appear below, also sorted by date. Untitled drafts older than 30 days are garbage-collected automatically; named drafts persist indefinitely.

## Open a saved draft

1. Open `smsapp.aoneahsan.com/drafts` (or **Drafts** in the navigation).
2. The list shows every saved draft with title, last-updated timestamp, recipient count, and a body preview.
3. Click a row. The composer opens with everything restored — recipient(s), body, send mode, schedule, assigned device.
4. Continue editing or click **Send** / **Fire batch** to dispatch.

Sending a draft converts it from `status: 'draft'` to `status: 'sent'` (or `status: 'scheduled'` for scheduled sends) and the draft disappears from the Drafts list — it now lives in the Jobs list instead.

## Cross-device drafts

Because drafts live in Firestore, the same draft is available wherever you sign in:

- Web dashboard on your laptop → start composing
- Android app on your phone → open Drafts, the partial send is there
- Browser extension at your desk → same draft, same state

The live Firestore subscription means changes you make on one device propagate to the others within seconds. There's no "sync now" button — it's continuous.

If two devices edit the same draft simultaneously (rare but possible), last-write-wins. The draft's `updatedAt` timestamp arbitrates: whichever device's latest edit had the higher timestamp wins, the other device's pending change is overwritten. There's no merge UI, no conflict resolution — drafts are simple enough that the cost of conflict-handling outweighs the rare benefit.

## Delete a draft

Click a draft in the list, click **Delete**, confirm. Deletion is hard — the draft document is removed from Firestore immediately. If you delete a draft you didn't mean to, there's no built-in undo; you'll need to re-compose.

To clear all auto-saved untitled drafts at once, click **Drafts → Clean up untitled** in the header. This removes every draft with the system-generated title; named drafts are kept.

## Promote a draft to a template

Sometimes a draft you've been polishing turns out to be a pattern you'll reuse. From the open draft:

1. Click the menu icon next to the title (three vertical dots).
2. Choose **Save as template**.
3. Give the template a name and optional tags.
4. Click **Save**. The original draft remains in your Drafts list; the new template appears in your template library.

The reverse — converting a template to a draft — is automatic when you click **Use template** in the composer: the template body fills the draft and auto-save kicks in.

## Common errors

If a draft "disappears" after you closed the browser, you may have been signed in to a different Google account when you composed it. Drafts are per-account; sign in to the account you used and check Drafts again.

If auto-save shows **Save failed** repeatedly, the most common cause is a Firestore rules violation — for example, if your account is suspended for fair-use violations. Check the dashboard for any account-level notices; if you see none, sign out and back in to refresh the session.

If a cross-device draft shows different content on two devices, the live subscription may be stalled on one device. Pull-to-refresh the Android app, or refresh the browser tab on the web. The subscription will reattach and resync within seconds.

## Where to go next

For ad-hoc one-off drafts that you'll send manually, the composer's built-in flow is enough. For drafts that are part of a recurring pattern (the same `"weekly reminder"` template body), promote to a template and use **Use templates**. For drafts that should fire at a future time without manual intervention, **Schedule a recurring SMS** is the right place to look.
