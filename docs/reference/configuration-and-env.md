---
title: Release configuration
description: Public release identity and configuration boundaries for SMSApp without credential values.
sidebar_position: 8
---

# Release configuration

| Item | Current first-release value |
|---|---|
| Android application ID | `com.aoneahsan.smsapp` |
| Distribution | Google Play, "SMS Mobile App", version 1.7.0 ([listing](https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp)) |
| Web application | `https://smsapp.aoneahsan.com` |
| Documentation | `https://smsapp-docs.aoneahsan.com` |
| Coordination | Firebase Authentication and Firestore |
| SMS transport | Android `SmsManager` through the configured default SMS subscription |
| Queue protocol | Current release protocol only; legacy jobs are not automatically replayed |

The Android app `com.aoneahsan.smsapp` version 1.7.0 is live on Google Play as "SMS Mobile App" ([Google Play listing](https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp)). References to `com.zaions.smsapp` are stale or a future migration decision until the application build, signing, Firebase configuration, links, and release documentation change together.

The public Firebase client configuration identifies the Firebase project but does not authorize privileged access by itself. Server credentials, signing material, and privileged API keys must never be committed, published in this site, or included in a frontend environment variable. Operators should obtain all configuration through the project's approved secret store and release process.
