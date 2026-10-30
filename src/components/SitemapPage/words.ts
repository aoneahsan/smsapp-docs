import { translate } from '@docusaurus/Translate';

/**
 * The sitemap page's words. Each goes through Docusaurus's `translate`, so a second locale needs a translation file
 * and no edit here. Count messages are one plural message each (`one|other`). A category group's heading is the
 * category's own sidebar label.
 *
 * @returns the page's words
 */
export function sitemapWords() {
  return {
    title: translate({ id: 'docs.sitemap.title', message: 'Sitemap' }),
    metaDescription: translate({
      id: 'docs.sitemap.meta.description',
      message:
        'Every page of the SMSApp docs in one place, grouped and searchable: tutorials, how-to guides, reference and explanation.',
    }),
    intro: translate({
      id: 'docs.sitemap.intro',
      message: 'Every page of the SMSApp docs, grouped as the sidebars group them, and searchable.',
    }),
    filesLabel: translate({ id: 'docs.sitemap.files.label', message: 'Files for machines' }),
    sitemapXml: {
      label: translate({ id: 'docs.sitemap.file.sitemap_xml.label', message: 'sitemap.xml' }),
      hint: translate({
        id: 'docs.sitemap.file.sitemap_xml.hint',
        message: 'The same list, in the format search engines read.',
      }),
    },
    feedXml: {
      label: translate({ id: 'docs.sitemap.file.feed_xml.label', message: 'feed.xml' }),
      hint: translate({
        id: 'docs.sitemap.file.feed_xml.hint',
        message: 'Changed docs pages, newest first, for your feed-reader app.',
      }),
    },
    llms: {
      label: translate({ id: 'docs.sitemap.file.llms.label', message: 'llms.txt' }),
      hint: translate({
        id: 'docs.sitemap.file.llms.hint',
        message: 'A plain-text summary of the docs for AI assistants, with a link to every page.',
      }),
    },
    llmsFull: {
      label: translate({ id: 'docs.sitemap.file.llms_full.label', message: 'llms-full.txt' }),
      hint: translate({
        id: 'docs.sitemap.file.llms_full.hint',
        message: 'The release scope in one plain-text file, for AI assistants.',
      }),
    },
    searchLabel: translate({ id: 'docs.sitemap.search.label', message: 'Search pages' }),
    searchPlaceholder: translate({ id: 'docs.sitemap.search.placeholder', message: 'Try “contacts” or “permission”' }),
    count: translate({ id: 'docs.sitemap.search.count', message: '1 page|{count} pages' }),
    countQuery: translate({
      id: 'docs.sitemap.search.count_query',
      message: '1 page matches “{query}”|{count} pages match “{query}”',
    }),
    groupDocs: translate({ id: 'docs.sitemap.group.docs', message: 'Start here' }),
    groupSite: translate({ id: 'docs.sitemap.group.site', message: 'This site' }),
    emptyTitle: translate({ id: 'docs.sitemap.empty.title', message: 'No pages match “{query}”' }),
    emptyBody: translate({
      id: 'docs.sitemap.empty.body',
      message: 'Try a shorter word, or clear the search to see every page.',
    }),
    emptyAction: translate({ id: 'docs.sitemap.empty.action', message: 'Clear search' }),
  };
}
