---
title: Android permissions
description: Android permissions used by the SMSApp owner-managed sender and permissions deliberately absent.
sidebar_position: 2
---

# Android permissions

| Permission | Purpose |
|---|---|
| `INTERNET`, `ACCESS_NETWORK_STATE` | Authenticate and synchronize phone, contact, job and result state with the Supabase database. |
| `SEND_SMS` | Send owner-authorized SMS through Android `SmsManager`. Granted at runtime. |
| `READ_CONTACTS` | Read names and phone values for an explicit device-scoped sync. Granted at runtime. |
| `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC` | Run the visible Android sender while work is active. |
| `POST_NOTIFICATIONS` | Show foreground/local notifications where Android requires runtime approval. |
| `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK` | Restore scheduling support and let bounded native work complete. |
| `VIBRATE` | Haptic feedback and notification behavior. |

SMSApp does not request inbox/read-SMS, receive-SMS, call-log, location, legacy external-storage, or advertising-ID access. It is not a default SMS handler.

SMS permission and contact permission are independent. Granting contact access does not enable sending or upload contacts; granting SMS access does not start a job. Sender enrollment and cloud contact sync each require a separate owner action.
