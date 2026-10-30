import React, { type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import SearchPage from '@theme-original/SearchPage';
import type SearchPageType from '@theme/SearchPage';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof SearchPageType>;

/**
 * The local-search results page, kept out of search engines. The search plugin writes `property="robots"`, which
 * engines ignore, so the real `name="robots"` tag is added here; `/search` is also left out of sitemap.xml.
 */
export default function SearchPageWrapper(props: Props): ReactNode {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <SearchPage {...props} />
    </>
  );
}
