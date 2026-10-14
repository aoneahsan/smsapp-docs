---
title: Why SMSApp is not a default SMS handler
description: Why SMSApp sends approved messages without reading or managing the Android inbox.
sidebar_position: 5
---

# Why SMSApp is not a default SMS handler

SMSApp has a narrow send-only role. It sends owner-approved outbound SMS through `SmsManager`, but it does not replace the phone's messaging app, read conversations, receive incoming SMS, or manage MMS/RCS threads.

That boundary reduces data access and keeps the product's privacy model understandable. It also means SMSApp cannot inspect a recipient reply, verify inbox delivery, or provide conversation management. Those are unsupported rather than hidden features.

The Android build requests `SEND_SMS` for dispatch. It does not request `READ_SMS` or `RECEIVE_SMS` and is not registered as the default SMS handler.
