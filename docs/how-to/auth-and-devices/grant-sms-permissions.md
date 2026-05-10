---
title: How to grant SEND_SMS and READ_CONTACTS permissions
description: Grant the Android permissions SMS Mobile App requests, recover from accidental decline, and use the manual Settings path when the runtime prompt won't reappear.
sidebar_position: 5
sidebar_label: Grant SMS permissions
slug: grant-sms-permissions
keywords: [send_sms permission android, grant sms permission, sms mobile app permissions, read_contacts android, runtime permission android]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Grant SMS and Contacts permissions

SMS Mobile App declares two Android permissions: `SEND_SMS` (required for any send to work) and `READ_CONTACTS` (optional, used by the recipient picker). Both are runtime permissions on Android 8+, meaning the app must explicitly prompt you and you must explicitly approve before they take effect. This recipe covers the prompt flow, the recovery path if you decline by mistake, and the manual Settings path for cases where the runtime prompt won't reappear.

## What the app does NOT request

The app does not request `READ_SMS`, `RECEIVE_SMS`, `READ_CALL_LOG`, `READ_PHONE_STATE`, or any "default SMS handler" privilege. It cannot read your inbox, intercept incoming messages, or access your call history. Android wouldn't grant those permissions to a non-default-SMS app even if the app asked. The app's Play Store listing reflects this — the only SMS permission declared is `SEND_SMS`.

## Grant SEND_SMS via the runtime prompt

The first time you trigger any send action — composing on the home screen, tapping **Send test SMS**, or processing a queued job — Android shows the system permission dialog: **"Allow SMS Mobile App to send SMS messages?"** with **Allow** and **Don't allow** buttons.

Tap **Allow**. The permission is granted immediately and persists across app updates and reboots. The app stores no record of the grant locally; Android tracks it.

If you tap **Don't allow**, Android remembers the decision and won't prompt again automatically the next time you trigger a send. The app's send button greys out with a brief explanation. Recover with the **Manual Settings path** below.

## Optionally grant READ_CONTACTS

When you tap **Pick from contacts** in any composer, Android shows a similar dialog for `READ_CONTACTS`. Tap **Allow** if you want the convenience of selecting recipients from your contact list. Decline if you'd rather type numbers manually or upload CSVs — there's no functional difference for sending, only for the picker.

If you decline `READ_CONTACTS`, the **Pick from contacts** button stays disabled and the composer still works for direct entry and CSV imports.

## Manual Settings path (after a decline)

When Android has remembered a previous **Don't allow**, the runtime prompt won't reappear and you'll need to grant the permission via system settings.

1. Open **Settings** on your phone.
2. Tap **Apps** (or **Apps & notifications** on older Android versions).
3. Find **SMS Mobile App** in the list and tap it.
4. Tap **Permissions**.
5. Tap the relevant permission: **SMS** for `SEND_SMS`, or **Contacts** for `READ_CONTACTS`.
6. Choose **Allow** (or **Allow only while using the app** — both work for this app's use case).

The change takes effect immediately. Return to the SMS Mobile App and your next send will succeed.

Some manufacturer ROMs label the path differently — Xiaomi MIUI has it under **Manage apps**, Samsung One UI under **Permissions** directly on the app's info screen, OPPO ColorOS under **Permission management**. The destination is the same: a per-app permission toggle.

## Battery-optimisation exemption

Battery optimisation isn't a runtime permission, but it has the same practical effect on long-running batches: an aggressively-optimised app gets killed mid-flight, leaving jobs stranded.

The app prompts the appropriate disable-battery-optimisation flow when it detects an aggressive ROM. Following the prompt opens the right Settings page; tap **Don't optimise** for SMS Mobile App and return to the app.

For a manual approach, navigate to **Settings → Apps → SMS Mobile App → Battery → Allow background activity** (or the equivalent on your ROM). Phones running newer Android versions also expose **Settings → Battery → Battery optimisation** with a per-app override list.

## Verify a permission is granted

Open **Settings → Apps → SMS Mobile App → Permissions**. The active list shows which permissions are currently allowed. SMS should be **Allowed**; Contacts should be **Allowed** if you've granted it (otherwise it appears under **Not allowed**).

You can also test from inside the app: tap **Send test SMS** on the home screen. A permission-granted device shows a brief composer; a denied device shows a disabled button with the recovery hint.

## Common errors

If sends still fail after a successful Allow, the most likely cause is that you're running on an emulator or a device with no working SIM. The permission is granted, but `SmsManager` has nothing to dispatch through. Test on a real Android phone with a working SIM.

If the runtime prompt never appears even on first send, you may have set Android's per-app **Auto revoke unused permissions** policy aggressively, or the app's previous permission state is being restored from a backup. Open Settings, manually revoke the SMS permission, then trigger the send — the prompt reappears.

If `READ_CONTACTS` is granted but the picker shows an empty list, your contacts may live entirely in cloud accounts (e.g. Google Contacts not synced to-device). Open the **Contacts** app on Android and confirm contacts are visible there; if they're not, the SMS Mobile App picker won't see them either.

## Where to go next

For per-SIM dispatch on dual-SIM phones, see [Switch SIM on a dual-SIM phone](./switch-sim-on-dual-sim). For the underlying compliance reasoning — why `SEND_SMS` only, why no inbox access, why we're not a default SMS handler — see the upcoming **Compliance: Google Play SMS-permission policy** page in the [Explanation](/explanation) section.
