---
title: Prepare a CSV recipient file
description: Format and validate a bounded CSV for the first-release SMSApp batch importer.
sidebar_position: 4
---

# Prepare a CSV recipient file

Create a UTF-8 CSV no larger than 5 MiB. Include one recognized phone-number column. A header such as `phone`, `mobile`, `phone_number`, or `phone number` is accepted by the current importer. Duplicate or missing phone headers cause the import to fail.

```csv
phone,name
03001234567,Example recipient
+923061234567,Second example
```

The message is composed in the admin and applies to the whole batch. A message column in the CSV is ignored.

SMSApp normalizes unambiguous `03…`, `923…`, `00923…`, and `+923…` forms, then keeps only ordinary Pakistani mobile ranges `030`–`036`. It reports duplicates and rejects foreign numbers, landlines, short codes, service or premium numbers, malformed values, and unrecognized ranges. It never silently truncates more than 5,000 unique eligible recipients.

Phone numbers must remain strings. Avoid spreadsheet scientific notation and formula cells. Review the accepted and excluded preview before creating the draft.
