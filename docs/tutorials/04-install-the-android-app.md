---
title: Install the Android app
description: Install SMSApp (its Google Play release is in preparation) or sideload a verified APK, and confirm its application identity before setup.
sidebar_position: 2
slug: /tutorials/install-the-android-app
---

# Install the Android app

The Android app `com.aoneahsan.smsapp` ("SMS Mobile App") is being prepared for its Google Play release ([Google Play listing](https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp)).

<a id="obtain-the-apk"></a>
## Obtain the APK&nbsp;[#](#obtain-the-apk)

Use only an APK supplied through the owner's verified release channel. This documentation does not publish a download URL yet. Confirm the expected version and checksum with the owner before installing; do not use an APK from an unrelated website or message.

The current executable application ID is `com.aoneahsan.smsapp`. A future package migration would require a separately signed installation and coordinated documentation update.

<a id="install"></a>
## Install&nbsp;[#](#install)

1. Open the verified APK on the Android phone.
2. If Android blocks the install, allow installs from the specific app you used to open the file.
3. Complete installation, then remove that temporary install permission if you do not need it.
4. Open SMSApp and confirm that it reaches the sign-in screen.

Android may refuse an update if the installed app was signed with a different key. Do not uninstall an existing copy until you understand what local state may be removed.

<a id="next-steps"></a>
## Next steps&nbsp;[#](#next-steps)

Continue with [Get started with SMSApp](./01-get-started-in-5-minutes.md). Registration, contact sync, and sender enrollment are separate steps; installation alone does not authorize SMS dispatch.
