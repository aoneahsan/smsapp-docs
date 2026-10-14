---
title: Grant Android permissions
description: Grant only the SMS and contacts permissions needed for an owner-managed sending phone.
sidebar_position: 3
---

# Grant Android permissions

<a id="sms-permission"></a>
## SMS permission&nbsp;[#](#sms-permission)

Open SMSApp settings and enable the sender. Android prompts for `SEND_SMS` when needed. Approve it only on a phone you control and intend to use for dispatch. If denied or later removed, the phone must remain unavailable for jobs.

SMSApp is send-only. It does not request permission to read or receive SMS and is not a default SMS handler.

<a id="contacts-permission"></a>
## Contacts permission&nbsp;[#](#contacts-permission)

Grant `READ_CONTACTS` only if you will create jobs from this phone's address book. Permission allows the app to read the address book locally; cloud sync still requires a separate **Sync Contacts Now** action.

The sync sends only the name and phone fields required for recipient selection. Address-book presence does not establish consent to message a person.

<a id="default-sim"></a>
## Default SIM&nbsp;[#](#default-sim)

Choose one default SMS subscription in Android settings. The first release blocks dispatch when no unambiguous default is configured. Per-job dual-SIM selection is not supported in this milestone.
