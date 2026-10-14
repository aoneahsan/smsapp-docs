---
title: Monitor job progress
description: Read recipient state without overstating carrier delivery.
sidebar_position: 3
---

# Monitor job progress

Use the batch detail screen to review the selected phone, parent job state, recipient counts, and per-recipient outcomes. Refresh when needed; Firestore remains the durable coordination record.

| Outcome | Meaning |
|---|---|
| Pending | Eligible and not yet claimed for dispatch |
| Sending/claimed | The selected phone holds the current lease |
| Sent | Android returned a successful sent callback |
| Failed | A confirmed failure was recorded |
| Uncertain | Dispatch may have occurred but the result cannot be proved |
| Cancelled | The job stopped before remaining recipients were dispatched |

“Sent” is not the same as carrier delivery. SMSApp does not read the inbox and does not promise a delivery receipt.

Pause or cancel before changing device configuration. A pause prevents new modem calls after the phone observes it; it cannot recall a message already handed to Android.
