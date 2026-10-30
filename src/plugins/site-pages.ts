/**
 * The site-pages plugin: the readable `/sitemap` and `/feed` pages, the RSS 2.0 `/feed.xml`, and a truthful
 * `<lastmod>` on every `sitemap.xml` URL.
 *
 * The site has no blog, so the feed lists the docs pages themselves, each dated by the day its file last changed in
 * git (`showLastUpdateTime`; the deploy checkout uses `fetch-depth: 0`). A page with no git date fails the build:
 * a date is never invented. The pages and the XML read one list, so they cannot disagree.
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { LoadedContent as DocsContent } from '@docusaurus/plugin-content-docs';
import type { AllContent, LoadContext, Plugin } from '@docusaurus/types';

/** One page as its `/sitemap` card shows it. */
export interface SitePage {
  readonly permalink: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

/** One `/feed` entry: a doc and the day its file last changed (`YYYY-MM-DD`, UTC). */
export interface SiteEntry extends SitePage {
  readonly date: string;
}

/** A `/sitemap` group: the top-level pages together, or one sidebar's pages under its own label. */
export interface SiteGroup {
  readonly key: string;
  readonly label: string;
  readonly pages: readonly SitePage[];
}

/** What `/sitemap` and `/feed` draw, written once per build. */
export interface SitePagesData {
  readonly home: SitePage;
  readonly groups: readonly SiteGroup[];
  /** Every listed doc, newest change first: also the `/feed.xml` list. */
  readonly entries: readonly SiteEntry[];
}

type DocsVersion = DocsContent['loadedVersions'][number];
type DocMetadata = DocsVersion['docs'][number];

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';
const PAGES_PLUGIN = 'docusaurus-plugin-content-pages';

/** A Markdown page (`src/pages/*.md`) as the pages plugin loads it, with its git date. */
interface MarkdownPage {
  readonly type: string;
  readonly permalink: string;
  readonly title?: string;
  readonly description?: string;
  readonly lastUpdatedAt?: number;
}

/** The navbar label of each sidebar, by sidebar id (docusaurus.config.ts navbar). */
const SIDEBAR_LABELS: Readonly<Record<string, string>> = {
  tutorialsSidebar: 'Tutorials',
  howtoSidebar: 'How-to guides',
  referenceSidebar: 'Reference',
  explanationSidebar: 'Explanation',
};

/** Each doc's date by served path, read by {@link withLastmod}. */
const datedPages = new Map<string, string>();

/**
 * The address a doc is really served at: `trailingSlash: false` serves `/tutorials`, not `/tutorials/`.
 *
 * @param permalink - the docs plugin's permalink
 * @returns the served path
 */
function served(permalink: string): string {
  return permalink.length > 1 ? permalink.replace(/\/+$/, '') : permalink;
}

/**
 * A doc as its card shows it.
 *
 * @param doc - the docs plugin's metadata for one page
 * @returns the card data
 */
function docPage(doc: DocMetadata): SitePage {
  return {
    permalink: served(doc.permalink),
    title: doc.title,
    description: doc.description,
    tags: doc.tags.map((tag) => tag.label),
  };
}

/**
 * The docs grouped by sidebar, in sidebar order, each doc once. A doc no sidebar shows joins the top-level group.
 *
 * @param version - the docs version the site shows
 * @returns the non-empty groups
 */
function docsGroups(version: DocsVersion): SiteGroup[] {
  const listed = version.docs.filter((doc) => !doc.unlisted && !doc.draft);
  const seen = new Set<string>();
  const groups: SiteGroup[] = [];
  for (const [sidebarId, label] of Object.entries(SIDEBAR_LABELS)) {
    const pages = listed
      .filter((doc) => doc.sidebar === sidebarId)
      .sort((a, b) => (a.sidebarPosition ?? 0) - (b.sidebarPosition ?? 0) || a.permalink.localeCompare(b.permalink))
      .map(docPage);
    pages.forEach((page) => seen.add(page.permalink));
    if (pages.length > 0) groups.push({ key: sidebarId, label, pages });
  }
  const rest = listed.map(docPage).filter((page) => !seen.has(page.permalink));
  if (rest.length > 0) groups.unshift({ key: 'start', label: 'Start here', pages: rest });
  return groups;
}

/**
 * Every listed doc as a feed entry, newest change first.
 *
 * @param version - the docs version the site shows
 * @returns the entries
 * @throws when a doc has no git date, title or description
 */
function docsEntries(version: DocsVersion): SiteEntry[] {
  return version.docs
    .filter((doc) => !doc.unlisted && !doc.draft)
    .map((doc) => {
      if (typeof doc.lastUpdatedAt !== 'number') {
        throw new Error(`site-pages: ${doc.permalink} has no git date; refusing to invent a feed date.`);
      }
      if (!doc.title.trim() || !doc.description.trim()) {
        throw new Error(`site-pages: ${doc.permalink} needs a title and description for the feed.`);
      }
      return { ...docPage(doc), date: new Date(doc.lastUpdatedAt).toISOString().slice(0, 10) };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.permalink.localeCompare(b.permalink));
}

/**
 * Escapes text for XML.
 *
 * @param value - raw text
 * @returns escaped text
 */
function xml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/**
 * The RSS 2.0 document for the entries.
 *
 * @param entries - newest first
 * @param site - channel title, description and absolute site URL (with trailing slash)
 * @returns the XML
 */
function renderFeed(entries: readonly SiteEntry[], site: { title: string; description: string; url: string }): string {
  const newest = entries[0];
  if (newest === undefined) throw new Error('site-pages: refusing to write an empty feed.');
  const rfc822 = (date: string): string => new Date(`${date}T00:00:00Z`).toUTCString();
  const items = entries
    .map((entry) => {
      const link = new URL(entry.permalink.replace(/^\//, ''), site.url).toString();
      const categories = entry.tags.map((tag) => `\n      <category>${xml(tag)}</category>`).join('');
      return `    <item>
      <title>${xml(entry.title)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="true">${xml(link)}</guid>
      <pubDate>${rfc822(entry.date)}</pubDate>
      <description>${xml(entry.description)}</description>${categories}
    </item>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.title)}</title>
    <link>${xml(site.url)}</link>
    <description>${xml(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(newest.date)}</lastBuildDate>
    <atom:link href="${xml(new URL('feed.xml', site.url).toString())}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

/**
 * Dates every sitemap URL. A doc takes its own git date; a page that lists others (home, `/sitemap`, `/feed`, a
 * category index) takes the newest date of the docs it lists.
 *
 * @param items - the sitemap plugin's entries
 * @returns the same entries with a lastmod and no changefreq or priority
 * @throws when the plugin has not run, or naming a URL still undated
 */
export function withLastmod<Item extends { readonly url: string }>(items: readonly Item[]): Item[] {
  if (datedPages.size === 0) {
    throw new Error('site-pages: no doc dates were collected, so sitemap.xml cannot be dated.');
  }
  const newest = (inside: (pathname: string) => boolean): string | undefined =>
    [...datedPages]
      .filter(([pathname]) => inside(pathname))
      .reduce<string | undefined>((max, [, date]) => (max === undefined || date > max ? date : max), undefined);
  const listsEverything = new Set(['/', '/sitemap', '/feed']);
  return items.map((item) => {
    const pathname = new URL(item.url).pathname;
    const lastmod =
      datedPages.get(pathname) ??
      (listsEverything.has(pathname) ? newest(() => true) : newest((doc) => doc.startsWith(`${pathname}/`)));
    if (lastmod === undefined) throw new Error(`site-pages: ${item.url} has no date and lists no dated doc.`);
    return { ...item, lastmod, changefreq: null, priority: null };
  });
}

/**
 * The plugin: adds `/sitemap` and `/feed`, writes `/feed.xml`, and records each doc's date.
 *
 * @param context - the site's load context
 * @returns the plugin
 */
export default function sitePages(context: LoadContext): Plugin {
  let data: SitePagesData | undefined;
  return {
    name: 'site-pages',
    async allContentLoaded({ allContent, actions }) {
      const docs = (allContent as AllContent)[DOCS_PLUGIN]?.['default'] as DocsContent | undefined;
      const version = docs?.loadedVersions.find((loaded) => loaded.isLast) ?? docs?.loadedVersions[0];
      if (version === undefined) throw new Error('site-pages: the docs plugin (id "default") must be on.');
      // Markdown pages (About) join the "Start here" cards and carry their own git date into sitemap.xml.
      const mdPages = (((allContent as AllContent)[PAGES_PLUGIN]?.['default'] ?? []) as MarkdownPage[]).filter(
        (page) => page.type === 'mdx',
      );
      const groups = docsGroups(version);
      const extra: SitePage[] = mdPages.map((page) => ({
        permalink: served(page.permalink),
        title: page.title ?? page.permalink,
        description: page.description ?? '',
        tags: [],
      }));
      if (extra.length > 0) {
        const start = groups.find((group) => group.key === 'start');
        if (start === undefined) groups.unshift({ key: 'start', label: 'Start here', pages: extra });
        else groups[groups.indexOf(start)] = { ...start, pages: [...start.pages, ...extra] };
      }
      data = {
        home: { permalink: '/', title: context.siteConfig.title, description: context.siteConfig.tagline, tags: [] },
        groups,
        entries: docsEntries(version),
      };
      datedPages.clear();
      for (const entry of data.entries) datedPages.set(entry.permalink, entry.date);
      for (const page of mdPages) {
        if (typeof page.lastUpdatedAt !== 'number') {
          throw new Error(`site-pages: ${page.permalink} has no git date; enable pages.showLastUpdateTime.`);
        }
        datedPages.set(served(page.permalink), new Date(page.lastUpdatedAt).toISOString().slice(0, 10));
      }
      const site = await actions.createData('site-pages.json', JSON.stringify(data));
      actions.addRoute({ path: '/sitemap', component: '@site/src/components/SitemapPage', exact: true, modules: { site } });
      actions.addRoute({ path: '/feed', component: '@site/src/components/FeedPage', exact: true, modules: { site } });
    },
    async postBuild({ outDir, siteConfig }) {
      if (data === undefined) throw new Error('site-pages: postBuild ran before the content loaded.');
      const url = new URL(siteConfig.baseUrl, siteConfig.url).toString();
      await writeFile(
        join(outDir, 'feed.xml'),
        renderFeed(data.entries, { title: siteConfig.title, description: siteConfig.tagline ?? '', url }),
        'utf8',
      );
    },
  };
}
