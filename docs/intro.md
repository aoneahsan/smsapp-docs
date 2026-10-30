---
title: SMSApp documentation
description: Install and operate SMSApp with an owner-managed Android sender and web administration panel.
slug: /
sidebar_position: 1
---

# SMSApp documentation

SMSApp prepares SMS jobs in a web dashboard and dispatches them from your own Android phone through that phone's configured SIM. Anyone can sign in with Google and use the Free plan; Pro and Family raise the limits ([plans](https://smsapp.aoneahsan.com/pricing)). Supabase stores accounts, registered phones, synced contacts, jobs, recipients and results; it is not the SMS transport.

:::caution[First-release status]
The Android app `com.aoneahsan.smsapp` ("SMS Mobile App") is being prepared for its Google Play release ([Google Play listing](https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp)). The web dashboard prepares and monitors jobs. The Play release runs on Supabase, the same backend as the web dashboard.
:::

<a id="first-release-workflow"></a>
## First-release workflow&nbsp;[#](#first-release-workflow)

1. Install the Android app and sign in.
2. Register the phone and explicitly enable it as a sender.
3. Grant SMS permission and choose a default SMS subscription in Android.
4. Grant contact access, then separately start cloud contact sync if contacts will be used.
5. In the web admin, select that phone and choose synced contacts or a CSV file.
6. Compose one message and review eligible, excluded, and duplicate numbers.
7. Create the draft, assign it to the selected phone, and explicitly start dispatch.
8. Keep the phone available and monitor per-recipient outcomes.

<a id="recipient-policy"></a>
## Recipient policy&nbsp;[#](#recipient-policy)

The first release accepts ordinary Pakistani mobile numbers in the `030`–`036` ranges. Local `03…`, `923…`, `00923…`, and `+923…` forms may be normalized when their structure is unambiguous. The app excludes foreign numbers, landlines, short codes, service or premium destinations, malformed values, and unrecognized ranges. There is no override for excluded destinations.

This filter reduces destination risk; it does not prove consent, current ownership, reachability, tariff, balance, or delivery. Send only to recipients who have agreed to receive the message. Carrier charges and limits still apply.

<a id="limits-and-boundaries"></a>
## Limits and boundaries&nbsp;[#](#limits-and-boundaries)

| Item | First-release behavior |
|---|---|
| Sender | One selected, owner-managed Android phone per job |
| SIM | One configured default SMS subscription |
| Recipient sources | Completed device contact sync or CSV |
| Job size | Up to 5,000 unique eligible numbers |
| CSV size | Up to 5 MiB |
| Enrollment | Explicit and off by default |
| Incoming SMS | Never read or uploaded |
| Cloud gateway | None |
| Public device pool | Not supported |
| Dual-SIM selection | Not supported in this milestone |
| Delivery guarantee | Not available; the app records the strongest Android result it can verify |

Long jobs can take many hours and may need owner attention after Android stops a foreground task, the app closes, the SIM changes, or connectivity is lost.

<a id="where-to-start"></a>
## Where to start&nbsp;[#](#where-to-start)

- Follow [Get started with SMSApp](./tutorials/01-get-started-in-5-minutes.md) for the complete first workflow.
- Use the [how-to guides](./how-to/index.md) for individual tasks.
- Check the [reference](./reference/index.md) for permissions, limits, routes, and state.
- Read the [explanations](./explanation/index.md) for architecture, privacy, and Android constraints.
