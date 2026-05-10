---
title: How to import contacts from a CSV file
description: Upload a recipient list to the dashboard for batch sending. Covers required columns, personalisation tokens, validator output, and the most common parse failures.
sidebar_position: 4
sidebar_label: Import contacts from CSV
slug: import-contacts-from-csv
keywords: [csv import sms, batch recipients csv, sms mobile app csv format, personalisation tokens sms, bulk recipient upload]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Import contacts from a CSV file

A CSV import populates a batch's recipient list from a spreadsheet you've prepared elsewhere. The dashboard parses the file in your browser (no upload to a third-party service), validates each row, and rejects malformed numbers explicitly rather than letting bad data slip through.

## Prerequisites

Recipient phone numbers in international format with the leading `+`. A spreadsheet editor (Google Sheets, LibreOffice Calc, Excel) or a plain text editor for preparing the CSV. A signed-in dashboard session with at least one linked Android device. The [Tutorials → Set up a small batch send](/tutorials/set-up-a-batch-send) tutorial completed if this is your first time.

## CSV format

The minimum acceptable file has a single column named `phone`:

```csv
phone
+15551234567
+15551234568
+923001234567
```

The column header is case-insensitive — `Phone`, `PHONE`, and `phone_number` are all accepted. The order of columns doesn't matter as long as the `phone` column exists.

For personalised messages, add additional columns. Any column you reference in your message body as `{{column_name}}` will be substituted at send time:

```csv
phone,name,city,appointment_time
+15551234567,Alice,Karachi,10am
+15551234568,Bob,New York,2pm
+923001234567,Carol,Lahore,9am
```

A message body of `Hi {{name}}, your appointment in {{city}} is at {{appointment_time}}` produces three distinct personalised SMS at send time.

A sample CSV ships at [`/sample-import.csv`](https://smsapp.aoneahsan.com/sample-import.csv) — open it in your spreadsheet editor as a starting point and replace its rows with your own.

## Phone number rules

Numbers must include the country code with a leading `+`. Local-format numbers like `5551234567` (US) or `03001234567` (Pakistan) without the `+countrycode` prefix are rejected. The validator uses libphonenumber semantics: a 10-digit US number written as `+15551234567` is valid; a 7-digit number is not.

Spaces, hyphens, and parentheses are stripped before validation, so `+1 (555) 123-4567` and `+15551234567` are equivalent. The dashboard normalises all numbers to E.164 (digits-only with `+`) before storing them.

Duplicate numbers within a single CSV are de-duplicated automatically — the validator counts the duplicate and surfaces it in the import report so you can decide whether the duplicate was intentional.

## Upload the CSV

Open the batch creator on the dashboard. The first step is **Upload recipients**. Drag your CSV file onto the upload area or click **Browse** and select it from your file system.

The parser runs immediately. For files under 1 MB the result appears in under a second; for larger files (tens of thousands of rows) the parser shows progress and reports the result when it finishes.

## Read the validator output

The post-upload screen shows:

- **Total rows parsed** — every row including invalid and duplicate ones.
- **Valid recipients** — rows that will be sent.
- **Skipped: invalid format** — rows where the phone number didn't pass libphonenumber validation. Each skip lists the row number and the offending value.
- **Skipped: duplicate** — rows with phone numbers already present earlier in the file.
- **Skipped: missing phone** — rows where the phone column was empty.
- **Preview** — the first few valid rows rendered against your message body, so you can sanity-check personalisation tokens.

You can fix flagged rows in your spreadsheet and re-upload, or accept the skips and move on. The dashboard never sends to a flagged row — it either routes the row or skips it explicitly.

## Common errors

**No `phone` column detected.** The validator couldn't find a column header matching `phone`, `Phone`, `phone_number`, or any case variant. Open the CSV and confirm the first row contains the header — a common slip is a CSV exported from a system that uses semicolons (`;`) instead of commas as separators. The parser auto-detects the separator but requires it to be consistent.

**All rows rejected as "invalid format".** Almost always means missing country codes — your numbers are in local format. Add the country-code prefix in your spreadsheet (Google Sheets has a `=CONCAT("+1", A2)` recipe for US numbers; LibreOffice has `="+1"&A2`).

**Personalisation tokens render as the literal `{{name}}`** in the preview. The CSV has no column named `name`. Either rename the column in your spreadsheet or change the message body's token to match a column you do have.

**Upload fails with "file too large".** The browser-side parser handles up to about 50 MB comfortably. Beyond that, split your CSV into chunks and run separate batches. Files in the millions of rows are an indicator that you should also be raising your batch sizes and rate caps via the admin batch UI.

## After import

The validated recipient list is now attached to your batch draft. Continue through the **Compose message**, **Assign devices**, and **Review** steps as covered in [Tutorial: Set up a small batch send](/tutorials/set-up-a-batch-send). You can re-upload a different CSV at any point before firing — the new file replaces the old recipient list rather than merging.

## Where to go next

For the actual batch dispatch and per-recipient progress monitoring, see the upcoming admin how-tos in **Batch 5** of the [docs build plan](https://github.com/aoneahsan/smsapp-docs). For the data shape behind a batch (the `sms_batches` and `sms_jobs` collections), see the upcoming [Firestore data model](/reference) reference page.
