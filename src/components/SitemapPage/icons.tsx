import React, { type ReactNode } from 'react';

/** Which picture sits beside a group's heading. */
export type GroupIconName = 'docs' | 'tutorials' | 'howto' | 'reference' | 'explanation' | 'site';

/** Each icon's shapes, on a 24-unit grid with a round 1.75 stroke in the text's own colour. */
const SHAPES: Record<GroupIconName, ReactNode> = {
  docs: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M9 8h6M9 12h6M9 16h3.5" />
    </>
  ),
  // A path of numbered steps: a guided walk-through.
  tutorials: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.5 6.5 15.5 11M15.5 13 8.5 17.5" />
    </>
  ),
  // A checklist: one task, done step by step.
  howto: (
    <>
      <path d="m4 6.5 1.75 1.75L9 5M4 12.5l1.75 1.75L9 11M4 18.5l1.75 1.75L9 17" />
      <path d="M12 7h8M12 13h8M12 19h8" />
    </>
  ),
  reference: (
    <>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z" />
      <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3" />
      <path d="M9 7.5h6M9 11h4" />
    </>
  ),
  // A light bulb: the why behind a choice.
  explanation: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
    </>
  ),
  site: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-1.8 4.2L9 15l1.8-4.2z" />
    </>
  ),
};

/**
 * A group's icon. It is decoration: the heading beside it says the same thing, so assistive tech skips it.
 *
 * @param props.name - which icon
 * @param props.className - sizing and colour from the page's styles
 * @returns the inline SVG
 */
export function GroupIcon({ name, className }: { readonly name: GroupIconName; readonly className?: string }): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES[name]}
    </svg>
  );
}
