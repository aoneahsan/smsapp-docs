import React, { type ReactNode } from 'react';

/** The docs site's link to someone else's site: new tab, never followed. It exists so a reader can check us. */
export default function RivalLink({ href, children }: { readonly href: string; readonly children: ReactNode }): ReactNode {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  );
}
