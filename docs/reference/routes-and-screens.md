---
title: Routes and screens
description: Web and Android screens used by the first owner-managed SMSApp workflow.
sidebar_position: 4
---

# Routes and screens

| Route or surface | First-release role |
|---|---|
| `/login` | Google authentication |
| `/settings` | Android sender enrollment, readiness, and local runtime settings |
| `/admin/devices` | Registered-phone visibility and readiness |
| `/admin/batches` | Batch list and status |
| `/admin/batches/import` | Select phone, choose synced contacts or CSV, compose, and preview |
| `/admin/batches/:id` | Assign the selected phone, start, pause, cancel, and monitor |
| `/admin/jobs` | Administrative job visibility |

The browser prepares and coordinates jobs but cannot call Android `SmsManager`. Native permissions and actual dispatch occur on the registered Android phone.

Other application routes may exist, but they are not part of this first-release manual unless the corresponding release evidence is added.
