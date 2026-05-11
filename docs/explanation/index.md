---
title: Explanation
description: Understanding-oriented discussion of why SMS Mobile App is designed the way it is — Android-only, send-only, distributed pool, Firebase-backed. Trade-offs, compliance posture, and reasoning.
sidebar_position: 1
sidebar_label: Overview
keywords: [why android sms, sms compliance google play, foreground service sms, default sms handler, sms architecture]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Explanation

Explanation is **the conversation**. Discussion-style essays that clarify design rationale, trade-offs, and the reasoning behind decisions you might otherwise find surprising. Where Reference answers "what is X?" and How-to answers "how do I do X?", Explanation answers "why is X the way it is?".

These are the pages to read if you are trying to understand whether the product's posture matches your needs, if you are reviewing the architecture for adoption, or if you are about to fork the codebase and want to know which decisions are load-bearing.

## Topics

| # | Topic | What you'll learn |
|---|---|---|
| 1 | [Why Android-only](/explanation/why-android-only) | The iOS-platform constraints that make Android-only the honest label, what iOS users can do today, and the conditions that would change the answer. |
| 2 | [How silent SMS works](/explanation/how-silent-sms-works) | The Android primitives behind the silent-send path: `SmsManager`, the foreground service, `FOREGROUND_SERVICE_DATA_SYNC`, the claim cycle, and why each piece exists. |
| 3 | [Volunteer device pool](/explanation/volunteer-device-pool) | The opt-in default-on volunteer model — what your phone is actually doing, the fair-use rules, and how opt-out is designed to be one tap away. |
| 4 | [Privacy and data handling](/explanation/privacy-and-data-handling) | What we store, what stays on-device, what we never collect, and how account deletion works end-to-end. |
| 5 | [Architecture overview](/explanation/architecture-overview) | The end-to-end stack — Capacitor + Vite front end, Firebase data plane, the in-tree `NativeSms` Android plugin, Cloudflare Workers, and the docs site. |
| 6 | [Google Play SMS policy](/explanation/google-play-sms-policy) | How we comply with Google Play's high-risk-permission gate, what we declare in the Permissions Declaration form, and the runbook for surviving policy revisions. |
| 7 | [Not a default SMS handler](/explanation/not-a-default-sms-handler) | Why we deliberately do not request the inbox/MMS/RCS permissions — what becoming the default would unlock, what it would cost, and why send-only is the right scope. |

## How to read this section

Start with [Why Android-only](/explanation/why-android-only) — it grounds the rest of the section by explaining the single platform decision that everything else builds on. Then [How silent SMS works](/explanation/how-silent-sms-works) for the technical mechanics that make the Android-side product real. From there, the four remaining pages are independently readable: dip into [Privacy](/explanation/privacy-and-data-handling) if you want the data-flow story, [Architecture](/explanation/architecture-overview) if you want the stack map, and the [compliance](/explanation/google-play-sms-policy) + [not-default-handler](/explanation/not-a-default-sms-handler) pages if you are thinking about Play Store strategy.

[Volunteer device pool](/explanation/volunteer-device-pool) is the bridge between the technical and the policy posture — it covers the mechanism that lets the product be both free and useful at scale, and how the fair-use rules keep it sustainable.

## What you will not find here

This section does not document **how to do** anything. For that go to [How-to](/how-to). It does not enumerate **what each field means**. For that go to [Reference](/reference). It does not walk you through **first-time setup**. For that go to [Tutorials](/tutorials).

It does describe trade-offs candidly. Where the product gives something up, the page says what was given up and why. Where the product takes on risk, the page names the risk. Where the product disagrees with conventional wisdom, the page argues the case.

## Honest framing

A few things to flag up front, so the rest of the section reads cleanly.

The product is **Android-only**. Not "Android-first." iOS support is not a near-term concern. If iOS is your primary device, the dashboard works on Mobile Safari but no SMS dispatching happens on iOS.

The product is **send-only**. We do not read incoming SMS. We are not a default SMS handler and have no plans to become one.

The product is **free at zero ongoing cost to us and to you**, but you still pay your carrier's per-SMS rate from your own SIM. The product is not magical — it dispatches through your existing carrier plan, and your plan's SMS pricing applies. For most users on modern plans this is effectively free (1,000+ SMS/month included); for users on legacy pay-per-SMS plans, the per-message cost is yours.

The product is **distributed via a volunteer pool**. When you opt in, your device contributes a small share of its SIM's daily capacity to other users' batches. When you opt out, your device only sends your own messages. Opt-in is default-on and opt-out is one tap away. The full mechanics are in [Volunteer device pool](/explanation/volunteer-device-pool).

The product is **subject to Google Play policy review**. We pass the gate today; we are aware the policy moves. The [Google Play SMS policy](/explanation/google-play-sms-policy) page describes the runbook.

These constraints shape every design decision in the product. The Explanation pages document the resulting decisions.
