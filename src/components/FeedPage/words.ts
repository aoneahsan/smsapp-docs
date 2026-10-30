import { translate } from '@docusaurus/Translate';

/**
 * The feed page's words. Each goes through Docusaurus's `translate`, so a second locale needs a translation file and
 * no edit here. "Updated {updated_date}" lives in the page itself, because its date is a `<time>` element. The
 * sitemap page reads the title and meta description for the feed's own card.
 *
 * @returns the page's words
 */
export function feedWords() {
  return {
    title: translate({ id: 'docs.feed.title', message: 'Feed' }),
    metaDescription: translate({
      id: 'docs.feed.meta.description',
      message: 'Every SMSApp docs page, newest change first, with the RSS link for your feed-reader app.',
    }),
    intro: translate({
      id: 'docs.feed.intro',
      message: 'Every SMSApp docs page, with the day its words last changed, newest first.',
    }),
    rssHeading: translate({ id: 'docs.feed.rss.heading', message: 'Follow by RSS' }),
    rssBody: translate({
      id: 'docs.feed.rss.body',
      message:
        'RSS is a plain list that feed-reader apps check for you. Copy the link below into yours, and a changed docs page shows up there on its own. It lists the same pages as this one.',
    }),
    rssLinkLabel: translate({ id: 'docs.feed.rss.link_label', message: 'RSS link' }),
    copy: translate({ id: 'docs.feed.copy', message: 'Copy link' }),
    copied: translate({ id: 'docs.feed.copied', message: 'Copied' }),
    copyFailed: translate({
      id: 'docs.feed.copy_failed',
      message: 'Couldn’t copy. The link is selected, so copy it yourself.',
    }),
    read: translate({ id: 'docs.feed.item.read', message: 'Read the page' }),
    emptyTitle: translate({ id: 'docs.feed.empty.title', message: 'No pages yet' }),
    emptyBody: translate({
      id: 'docs.feed.empty.body',
      message: 'The first one shows up here, and in your feed reader, when it is published.',
    }),
  };
}
