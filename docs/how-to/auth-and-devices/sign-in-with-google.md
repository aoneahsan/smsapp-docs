---
title: How to sign in with Google
description: Use Google OAuth to sign in to the SMS Mobile App dashboard or Android app. Resolves multi-account confusion, popup blockers, and unauthorised-domain errors.
sidebar_position: 1
sidebar_label: Sign in with Google
slug: sign-in-with-google
keywords: [sms mobile app sign in, google oauth, sign in with google, smsapp account, firebase google sign in]
last_update:
  date: 2026-05-10
  author: Ahsan Mahmood
---

# Sign in with Google

Google is the only sign-in method SMS Mobile App supports. There is no email-and-password flow, no phone-number sign-in, and no anonymous mode for production use. This recipe covers the dashboard sign-in, the Android app sign-in, and the most common edge cases.

## Prerequisites

A Google account you control. A modern browser (Chrome, Firefox, Edge, Safari, or any Chromium derivative) for the dashboard, or the SMS Mobile App for Android signed out and ready to sign in. Allow third-party cookies for `accounts.google.com` if your browser is configured strictly — Google's OAuth screen needs them to render the consent UI.

## Sign in to the web dashboard

1. Open [https://smsapp.aoneahsan.com](https://smsapp.aoneahsan.com) in your browser.
2. Click **Sign in with Google** in the header. A Google-hosted popup (or full-page redirect, on mobile browsers) opens.
3. Pick the Google account you want to use. If you're already signed in to Google in this browser, the picker shows every linked account; otherwise you'll go through Google's normal sign-in flow.
4. Approve the consent screen — the dashboard requests only the basic profile scopes (your name, email, and profile photo URL). It does **not** request access to your Gmail, Drive, contacts, or any other Google data.
5. Google redirects back to the dashboard. The header now shows your profile picture in the top-right; that's your visible cue that sign-in succeeded.

Behind the scenes, the dashboard exchanges Google's ID token for a Firebase Authentication session, then writes (or fetches) your `users/{uid}` document in Firestore. First-time sign-in creates the document; returning sessions reuse it.

## Sign in inside the Android app

1. Open the SMS Mobile App on your phone. The signed-out home screen shows a **Sign in with Google** button.
2. Tap it. Android opens its native account picker showing the Google accounts already configured on the device.
3. Tap the account you want to use — **the same account you signed in with on the web dashboard**, otherwise the dashboard will show "no devices" because the phone is registered against a different account.
4. The app talks to Firebase Auth via the Capacitor Google Auth plugin, exchanges the ID token for a session, and lands on the home screen with your profile picture visible.

Use the system **Add account** option in Android Settings if the account you want isn't on the phone yet.

## Verify the sign-in worked

On the web, navigate to `/devices` (or any signed-in route) — you should see your dashboard, not the marketing home page. On Android, the home screen should show your profile picture and the **Volunteering** badge (default state for newly linked devices). If both surfaces show your picture and the same email, the link is correct.

## Common errors

The most frequent failure mode is **multi-account confusion**: you have several Google accounts on the same browser or phone, and you signed in to the dashboard with one but the Android app with another. The dashboard then reports your phone as a separate user's device (which it correctly cannot see). Fix it by signing out of the Android app and back in with the matching account.

A second class of errors is **popup blockers** silently stopping the OAuth window. The fix is to allow popups from `smsapp.aoneahsan.com` once, refresh the dashboard, and click **Sign in with Google** again. Some privacy-focused browsers (Brave, Firefox with strict tracking protection) also need cookies allowed for `accounts.google.com`.

If you see `auth/unauthorized-domain` after the consent screen, you've opened a non-canonical URL such as a preview deployment or a self-hosted clone. The OAuth client is configured for the production domain only.

If you see `auth/popup-closed-by-user` it usually means you closed the popup before approving — try again, this time clicking through the consent screen.

On Android, a **Sign-in failed** with no further detail almost always means the installed APK has a different SHA-1 fingerprint than the one configured in the Firebase project — a sign you've installed an unofficial build. Reinstall from Google Play.

## Sign out

On the web, click your profile picture in the header and choose **Sign out**. On Android, open the home-screen menu and tap **Sign out**. Both surfaces clear local sessions and return to the signed-out home; nothing is deleted server-side.

## What happens to your data after sign-out

Sign-out removes the local session token; it does not delete your account. Your `users/{uid}` document, jobs, batches, drafts, and templates remain in Firestore exactly as they were. Sign back in with the same Google account and everything is restored. To delete the account permanently, follow the [Account Deletion](https://smsapp.aoneahsan.com/account-deletion) flow on the main site.

## Where to go next

For the Android app's permission prompts after sign-in, see [Grant SMS and Contacts permissions](./grant-sms-permissions). To register your phone as a sender device after first sign-in, see [Register your Android device](./register-your-android-device).
