---
title: How Android SMS dispatch works
description: Native SMSApp dispatch, default-SIM selection, sent callbacks, pacing, and uncertain results.
sidebar_position: 4
---

# How Android SMS dispatch works

After the owner explicitly starts a reviewed job, the Android foreground sender requests one eligible recipient at a time. It confirms assignment, job state, sender enrollment, SMS permission, and the configured default SMS subscription before calling Android's subscription-aware `SmsManager`.

Android splits long messages into native SMS parts. SMSApp waits for sent callbacks and records success only when every part reports success. A known callback error becomes a failure. A timeout or interruption after modem handoff becomes uncertain because an automatic retry could duplicate the message.

The sender spaces attempts according to configured pacing. Pacing does not guarantee carrier acceptance or make bulk traffic exempt from carrier or legal restrictions. Android may stop a long-running foreground task; the owner may need to reopen the app and resume safely pending work.
