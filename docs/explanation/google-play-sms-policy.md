---
title: Google Play SMS permission status
description: Current sideload distribution and the separate review required before a Google Play release.
sidebar_position: 7
---

# Google Play SMS permission status

The first release target is a sideloaded APK. Google Play availability is not confirmed, and this documentation does not claim that the current build has passed Play's restricted SMS-permission review.

The Android app uses `SEND_SMS` for its core owner-operated device-automation function and does not request inbox or receive-SMS access. Before any Play publication, the owner must verify the current Play policy, complete the required declarations, make the store listing and Data Safety answers match the shipped manifest and behavior, provide review evidence, and confirm the published package and signing identity.

A successful sideload test or local build does not satisfy Play review. If Play rejects the restricted permission, the release plan must change transparently; documentation must not describe silent/background sending as available through Play until the approved build is actually published.
