---
title: How to use SMS templates
description: Save a message body once and reuse it across sends with personalisation tokens. Covers creating, editing, sharing, and applying templates from the composer.
sidebar_position: 3
sidebar_label: Use templates
slug: use-templates
keywords: [sms templates, reusable sms, sms mobile app templates, personalisation tokens, sms message library]
last_update:
  date: 2026-05-11
  author: Ahsan Mahmood
---

# Use SMS templates

A template is a saved message body — `"Hi {{name}}, your appointment is at {{time}} on {{date}}"` — that you write once and apply to many sends. Templates support the same `{{column_name}}` substitution tokens that batch CSVs use, so the saved body adapts to per-recipient data without manual re-typing.

## Prerequisites

A signed-in dashboard session. A few message patterns you find yourself retyping — appointment reminders, OTP-style notifications, payment confirmations, follow-up nudges — are the natural candidates. If you only send unique one-off messages, templates aren't worth the setup.

## Create a template

1. Open `smsapp.aoneahsan.com/templates` (or **Templates** in the navigation).
2. Click **New template**. The composer opens with a **Name** field, a **Body** field, and a **Tags** field for organisation.
3. Give the template a short, distinct name — `"Appointment reminder"`, `"Payment confirmed"`, `"Birthday wish"`. The name shows up in the template picker when composing future sends, so make it scannable.
4. Type the body. Include `{{column_name}}` tokens wherever you want per-recipient data. The composer shows a preview using sample values so you can verify the substitution renders correctly.
5. Optionally add tags — `"appointments"`, `"transactional"`, `"marketing"`. Tags filter the template list when you have many.
6. Click **Save**. The template is now in your library.

A template lives under your account in the `sms_templates` Firestore collection. It's not shared with anyone else by default.

## Apply a template to a single send

1. In the composer at `/send-message`, click **Use template** above the body field.
2. The template picker opens with your library, searchable by name and filterable by tag.
3. Click the template you want. Its body fills the composer.
4. If the template has tokens, they remain as `{{name}}` placeholders — fill them in manually for a single send, or use the template inside a batch where the CSV provides the values.
5. Send as usual.

## Apply a template to a batch

1. In the batch creator at `/batches/new`, click **Compose message → Use template**.
2. Pick the template from your library.
3. The batch's recipient CSV columns are matched against the template's tokens — every `{{name}}`, `{{date}}`, etc. checks for a corresponding column in your CSV.
4. The validator shows which tokens are matched and which (if any) are unmatched. Unmatched tokens render as the literal `{{token}}` text in the final SMS, which is almost certainly a bug — either add the column to your CSV or remove the token from the template.
5. Continue through the batch flow as usual.

## Edit and version

Templates are mutable — editing a template changes it for all future sends but does not retroactively modify already-sent SMS bodies. There is no versioning beyond the `updatedAt` timestamp visible on each template row.

To edit, click a template in the library, change the fields, click **Save**. The change is live immediately for any composer or batch creator that loads the picker afterwards.

If you need versioning (template A v1 for old batches, template A v2 for new ones), duplicate the template into `"Appointment reminder (v2)"` rather than editing the original. There is no built-in branch/version-history feature.

## Delete a template

Click the template in the library, click **Delete**, confirm. Deletion is soft — the template document is marked deleted in Firestore and disappears from the picker, but a copy remains in your account for 30 days in case you change your mind. After 30 days, the document is permanently removed.

Already-sent SMS that used a deleted template keep their actual sent body in the job history. Deleting the template doesn't rewrite history.

## Token reference

Tokens are `{{column_name}}` with no surrounding spaces. They match against:

- CSV columns when used in batches
- Single-send composer fields (the manual fill-in flow)
- Personalisation variables from third-party connectors if you've enabled any

Token names are case-sensitive. `{{Name}}` and `{{name}}` are different tokens. Column header `Name` will match `{{Name}}` only.

Tokens that don't have a matching column fall through to the literal `{{token_name}}` text in the final SMS. The validator surfaces these as warnings; fix them before firing.

## Common errors

If the template picker is empty even though you created templates, you may be signed in to the wrong Google account. Check the profile picture in the dashboard header matches the account where you created the templates.

If the body preview shows literal `{{name}}` text instead of the sample substitution, the template was saved without sample-data hints. Edit the template, add sample values in the **Preview data** section, and re-save.

If a batch fires with literal `{{token}}` text in the recipient SMS, you ignored a validator warning. The dashboard does warn before firing; check the **Compose message** step output in the batch creator more carefully next time.

## Where to go next

For multi-step or recurring sends using the same template body, see **Schedule a recurring SMS**. For saving an in-progress composition without sending it yet, see **Save and reuse drafts** — drafts are different from templates (a draft is a single in-progress send; a template is a reusable pattern).
