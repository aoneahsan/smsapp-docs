---
title: Privacy and data handling
description: What SMSApp reads, stores, sends, and deliberately excludes in the owner-managed workflow.
sidebar_position: 6
---

# Privacy and data handling

<a id="data-used"></a>
## Data used&nbsp;[#](#data-used)

SMSApp uses the authenticated owner identity, registered-phone state, selected contact names and phone values, batch message, normalized recipients, claim/result state, and operational timestamps needed to run the job.

Contact sync is both permission-gated and owner-initiated. It stores the minimum name and phone fields required for recipient selection, scoped to the owner and source phone. A completed-generation marker prevents an interrupted replacement sync from appearing current.

<a id="data-not-used"></a>
## Data not used&nbsp;[#](#data-not-used)

SMSApp does not read or upload received SMS, call logs, location, advertising IDs, or legacy external-storage contents. It is not a default SMS handler. A public sender pool is not part of the first release.

<a id="operational-responsibility"></a>
## Operational responsibility&nbsp;[#](#operational-responsibility)

Address-book presence does not prove consent. The owner must have an appropriate basis to send each message, honor opt-outs, protect account/device access, and follow carrier and legal requirements. Logs and analytics must not include message bodies, contact lists, or full phone numbers.

The public app privacy policy governs the deployed service. This explanation must not be used as a substitute for that policy.
