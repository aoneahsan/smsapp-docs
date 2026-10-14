---
title: Assign a batch to the selected phone
description: Assign one prepared batch to its one owner-managed Android sender.
sidebar_position: 2
---

# Assign a batch to the selected phone

Open the draft's detail screen and select one phone. For contact-based jobs, it must match the source phone. The phone must belong to the owner, be active, be explicitly opted in, have SMS permission, have a configured default SMS subscription, and support the current queue protocol.

Confirm the assignment once. SMSApp creates a deterministic job for the batch and phone so repeated browser actions resolve to the same logical release rather than a second job.

One job cannot fan out across multiple phones in the first release. Do not split a single authorized recipient snapshot across other devices.
