---
title: Get started with SMSApp
description: Register one Android phone, sync its contacts, and prepare a reviewed SMS job in the web admin.
sidebar_position: 1
slug: /tutorials/get-started
---

# Get started with SMSApp

This walkthrough connects one owner-managed Android phone to the web admin. It does not send a real message until you explicitly start a reviewed job.

<a id="before-you-start"></a>
## Before you start&nbsp;[#](#before-you-start)

You need an Android phone with an active SMS-capable SIM, an APK from the owner's verified release channel, access to the SMSApp web admin, and a Google account authorized for the project. If you plan to run a real test, use a number you own and confirm your carrier tariff first.

<a id="connect-the-phone"></a>
## Connect the phone&nbsp;[#](#connect-the-phone)

1. [Install the APK](./04-install-the-android-app.md).
2. Open SMSApp and sign in.
3. Register the current Android phone.
4. In Android settings, choose a default SMS subscription.
5. In SMSApp settings, grant `SEND_SMS` and explicitly enable the sender. Enrollment starts off.
6. Keep the app open while the first readiness update reaches the server.

The admin should show the same phone and report whether SMS permission, default-SIM selection, protocol version, and sender service are ready. A recent sign-in alone does not mean the phone is ready to send.

<a id="sync-contacts"></a>
## Sync contacts&nbsp;[#](#sync-contacts)

1. Grant contact access on the phone.
2. Separately choose **Sync Contacts Now**.
3. Wait for the completed-sync timestamp.

Contact permission does not start a cloud upload on its own. The completed generation contains the minimum name and phone fields needed for this workflow and remains scoped to the signed-in owner and source phone.

<a id="prepare-a-job"></a>
## Prepare a job&nbsp;[#](#prepare-a-job)

1. Open the web admin batch import screen.
2. Select the registered phone.
3. Select **Synced contacts from phone** or **CSV file**.
4. Enter one SMS message.
5. Review eligible, excluded, and duplicate totals.
6. Create the draft and open its detail screen.
7. Confirm the same phone as the only sender.

Only ordinary Pakistani mobile destinations in the `030`–`036` ranges remain eligible. Excluded rows cannot be overridden.

<a id="send-a-controlled-test"></a>
## Send a controlled test&nbsp;[#](#send-a-controlled-test)

Before a larger job, create a one-recipient batch using a safe number you own. Start dispatch once, keep the phone available, and check the recipient outcome in the batch detail. A sent callback means Android accepted the send attempt; it is not a guarantee that the carrier delivered the message.

If the outcome is uncertain, stop. Reconcile the handset and carrier state before deciding whether another attempt is safe.
