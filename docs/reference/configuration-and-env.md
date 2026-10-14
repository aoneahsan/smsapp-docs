---
title: Release configuration
description: Public release identity and configuration boundaries for SMSApp without credential values.
sidebar_position: 8
---

# Release configuration

| Item | Current first-release value |
|---|---|
| Android application ID | `com.aoneahsan.smsapp` |
| Distribution target | Owner-provided sideload APK |
| Web application | `https://smsapp.aoneahsan.com` |
| Documentation | `https://smsapp-docs.aoneahsan.com` |
| Coordination | Firebase Authentication and Firestore |
| SMS transport | Android `SmsManager` through the configured default SMS subscription |
| Queue protocol | Current release protocol only; legacy jobs are not automatically replayed |

Google Play publication is not confirmed for this milestone. References to `com.zaions.smsapp` are stale or a future migration decision until the application build, signing, Firebase configuration, links, and release documentation change together.

The public Firebase client configuration identifies the Firebase project but does not authorize privileged access by itself. Server credentials, signing material, and privileged API keys must never be committed, published in this site, or included in a frontend environment variable. Operators should obtain all configuration through the project's approved secret store and release process.
