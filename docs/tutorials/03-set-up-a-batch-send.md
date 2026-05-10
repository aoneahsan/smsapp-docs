---
title: Set up a small batch SMS send with a CSV
description: Upload a 10-row CSV, fire a batch from one device, and watch per-recipient delivery roll in. Verified workflow for first-time admin batch sends.
sidebar_position: 3
sidebar_label: Set up a batch send
slug: set-up-a-batch-send
keywords: [bulk sms android, batch sms csv, sms mobile app batch, csv import sms, fire sms batch]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Set up a small batch SMS send

A batch send dispatches the same SMS body to many recipients in sequence, paced and tracked by your Android phone, with delivery status reported back to the dashboard per recipient. This tutorial sets up a 10-row batch — small enough to verify your workflow without burning through your carrier's daily SMS allowance.

By the end you will have prepared a CSV of recipients, uploaded it to the dashboard, assigned the batch to a single linked device, fired it, and watched each recipient row tick from pending to sent in the live progress view. The same flow scales to hundreds or thousands of recipients with the difference being how many devices you assign.

## Prerequisites

A signed-in account with at least one linked Android device and the [Send your first scheduled SMS](/tutorials/send-your-first-scheduled-sms) tutorial completed. A spreadsheet editor (LibreOffice Calc, Google Sheets, Excel) or a plain text editor for preparing the CSV. A short list of recipient phone numbers in international format with the leading `+`; for the practice run, ten of your own contacts is enough.

Carrier rate awareness: a 10-row batch will result in 10 SMS at your carrier's per-message rate, multiplied by message segments if your text exceeds 160 Latin / 70 Unicode characters.

## Step 1 — Prepare the CSV

The dashboard expects a CSV with at minimum a `phone` column. Headers are case-insensitive and the order doesn't matter. A sample CSV ships at [`/sample-import.csv`](https://smsapp.aoneahsan.com/sample-import.csv) on the main site — open it in your spreadsheet editor as a starting point.

Minimum format:

```csv
phone
+15551234567
+15551234568
+923001234567
```

Richer format with personalisation tokens (the dashboard substitutes `{{name}}` and any other column name into the body at send time):

```csv
phone,name,city
+15551234567,Alice,Karachi
+15551234568,Bob,New York
+923001234567,Carol,Lahore
```

Save as `recipients.csv`. Keep the file under 1 MB for the smoothest upload — larger files work but the parser reports progress less frequently.

## Step 2 — Open the admin batch UI

Sign in and navigate to the admin batch creator. The route depends on your role: regular accounts see **Batches** in the navigation; admin-marked accounts can also reach a richer **Admin → Batch Manager** screen with cross-user controls. For this tutorial the regular **Batches** screen is enough.

Click **Create batch**. You see a stepped form: **Upload recipients**, **Compose message**, **Assign devices**, **Review**.

## Step 3 — Upload your CSV

Drag `recipients.csv` onto the upload area or click **Browse**. The parser reads the file in the browser (no upload to a third-party service), validates each row, and reports the result inline:

- Total rows parsed
- Valid phone numbers
- Rows skipped, with the reason (invalid format, missing phone column, duplicate)
- A preview of the first few rows so you can confirm your column mapping is right

Fix any flagged rows in your spreadsheet and re-upload, or accept the skips and move on. The dashboard never silently sends to a bad row — it either routes the row or skips it explicitly.

## Step 4 — Compose the message

Type the body. If your CSV has personalisation columns, reference them with `{{column_name}}` — for example `Hi {{name}}, your appointment in {{city}} is tomorrow at 10am.` The composer shows a live preview rendering your first row's data so you can sanity-check the substitution.

Stay within 160 Latin / 70 Unicode characters for a single-segment SMS. The composer flags multi-segment messages and shows the segment count, since each segment is billed separately by your carrier.

## Step 5 — Assign devices and rate limits

In the **Assign devices** step, pick the linked Android phone you want to dispatch from. With a single device, all 10 messages fan out from that phone in sequence. With multiple devices, the dashboard splits the recipient list across them — useful for larger batches once you've moved beyond the practice run.

Set the **rate limit**: messages-per-minute per device. The default of 6/min (one every 10 seconds) is conservative and stays well below most carriers' anti-spam thresholds. Many home-broadband-style numbers can sustain 10–15/min; some carriers and SIM types throttle anything faster. For your first batch, leave the default.

The system also enforces a 10-device cap per batch — a fair-use boundary that keeps single accounts from monopolising the volunteer pool. For a 10-row batch this is irrelevant; it matters for larger jobs where you'd otherwise be tempted to fan out across dozens of phones.

## Step 6 — Review and fire

The **Review** step shows a summary: 10 recipients, your composed body, your assigned device, and the rate limit. Click **Fire batch**.

The dashboard creates a parent `sms_batches` document and 10 child `sms_jobs` documents, all linked. Your assigned phone picks up the batch, starts the foreground service, and dispatches the first message. Every 10 seconds (your configured rate) the next message goes out.

## Step 7 — Watch the live progress

The post-fire screen is a per-recipient progress table that updates in real time:

| Recipient | Status | Sent at | Delivered at |
| --- | --- | --- | --- |
| +1555…4567 | Sent | 14:32:01 | 14:32:03 |
| +1555…4568 | Sending | — | — |
| +9230…4567 | Pending | — | — |
| … | … | … | … |

Rows tick from Pending → Sending → Sent → Delivered as the phone dispatches each message. Failed rows show the carrier error inline. A summary bar at the top counts successes, failures, and remaining.

Walking away is fine — the phone keeps dispatching. You can return to the same screen any time to see live progress, or check the parent `Batches` list for the rolled-up summary.

## Troubleshooting

If the batch starts but stalls partway, the most common cause is the Android app being killed by manufacturer battery optimisation. Reopen the app, confirm battery optimisation is disabled, and the foreground service resumes the queue.

If the rate limit feels too aggressive (you want messages out faster), lift it gradually — 10/min is usually safe, but pushing past 20/min on a consumer SIM tends to draw carrier-side throttling that turns your batch into a slog. The dashboard automatically backs off when it sees consecutive carrier-side rate-limit errors.

## What you've learned

You've prepared a CSV, validated it through the dashboard's parser, composed a personalised message, assigned a single device with a sane rate limit, and watched 10 recipients tick through to delivered status in real time. The same workflow works at 100, 1,000, or 10,000 recipients — the only adjustments are how many devices you fan out across and how patient you can be with rate limits.

## Where to go next

For multi-device batches and the volunteer pool that makes them possible, continue to [Become a volunteer device](/tutorials/become-a-volunteer-device). For per-recipient retry logic when carriers return transient failures, see the upcoming How-to [Retry failed messages](/how-to). For the parent/child schema linking batches to jobs in Firestore, the [Firestore data model](/reference) page in Reference covers it in detail.
