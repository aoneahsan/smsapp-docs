/**
 * Every place SMS App is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the dashboard answered 200 and the release record's APK (v1.13.0) downloads. Play-excluded (owner, 2026-11-02):
 * never a Google Play link.
 */
export type PlatformId = 'web' | 'apk' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in SMS App's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'web', name: 'SMS App web dashboard', href: 'https://smsapp.aoneahsan.com', title: 'In your browser', text: 'Prepare SMS jobs, pick contacts and watch every send from the dashboard.', cta: 'Open the dashboard', primary: true, verified: '2026-11-20'},
  {id: 'apk', name: 'Android app (signed APK)', href: 'https://smsapp.aoneahsan.com/apps#download', title: 'On your Android phone', text: 'The phone that sends your SMS through its own SIM. Installed as a signed APK from the Apps page, not from Google Play.', cta: 'Download the APK', verified: '2026-11-20'},
  {id: 'docs', name: 'Documentation', href: 'https://smsapp-docs.aoneahsan.com', title: 'These docs', text: 'Tutorials, how-to guides and the reference for the dashboard and the sender phone.', cta: 'Read the docs', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get SMS App',
  description: 'Every place SMS App is released: the web dashboard, the Android app as a signed APK, and these docs.',
  lead: 'Prepare jobs in the dashboard, send them from your own Android phone, and keep these docs a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
export const PRIMARY_PLATFORM: Platform = PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string = PLATFORMS.map((platform) => platform.verified).sort().at(-1) ?? '2026-11-20';
