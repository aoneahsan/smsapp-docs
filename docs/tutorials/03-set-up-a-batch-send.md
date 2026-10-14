---
title: Set up a contacts or CSV batch
description: Prepare, review, assign, and start a bounded SMS job on one selected Android phone.
sidebar_position: 3
slug: /tutorials/set-up-a-batch-send
---

# Set up a contacts or CSV batch

<a id="choose-the-sender"></a>
## Choose the sender&nbsp;[#](#choose-the-sender)

Open the admin batch import screen and select one phone owned by the signed-in account. The phone must be active, explicitly enabled, on the current sender protocol, granted SMS permission, and configured with a default SMS subscription.

For contact-based jobs, the selected phone is also the contact source. SMSApp does not mix another phone's address book into this milestone.

<a id="choose-recipients"></a>
## Choose recipients&nbsp;[#](#choose-recipients)

- **Synced contacts:** choose the latest completed sync from the selected phone.
- **CSV:** upload a UTF-8 CSV up to 5 MiB with a recognized phone column.

The recipient policy normalizes eligible ordinary Pakistani mobile values and deduplicates the normalized results. It excludes all destinations outside `030`–`036`, including foreign, landline, short, service, premium, malformed, and unrecognized values.

<a id="compose-and-review"></a>
## Compose and review&nbsp;[#](#compose-and-review)

Enter one message for the batch. Review the message, SMS segment estimate, accepted recipients, duplicate count, and exclusion reasons. A batch may contain at most 5,000 unique eligible recipients; SMSApp rejects an oversized input instead of silently truncating it.

<a id="create-and-start"></a>
## Create and start&nbsp;[#](#create-and-start)

Create the draft, open its detail screen, and confirm the selected phone. Starting dispatch is a separate explicit action. Do not repeat the action while the browser is waiting; refresh the detail screen and verify whether the job already exists.

Keep the Android sender enabled. Pause or cancel before changing SIM, permission, account, or phone configuration. An SMS already handed to Android cannot be recalled.
