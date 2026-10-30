import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// SMSApp — public documentation site, by the SMS App team
// Source: https://github.com/aoneahsan/smsapp-docs
// Deploys to: https://smsapp-docs.aoneahsan.com

const SITE_URL = 'https://smsapp-docs.aoneahsan.com';
const APP_URL = 'https://smsapp.aoneahsan.com';
const REPO_URL = 'https://github.com/aoneahsan/smsapp-docs';
const TEAM_NAME = 'the SMS App team';
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.aoneahsan.smsapp';

const config: Config = {
  title: 'SMSApp Documentation',
  tagline: 'Owner-operated SMS dispatch from a registered Android phone.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'aoneahsan',
  projectName: 'smsapp-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  markdown: {
    hooks: {
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // `docs/` is BOTH the published content dir and the home of the
          // fixed-path internal file docs/MANUAL-TASKS.md. Keep the path (the
          // global rule fixes it) but never publish it — this repo is public.
          // NOTE: `exclude` REPLACES the plugin defaults, so they are restated.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
            'PROJECT-CONTEXT.md',
          ],
          routeBasePath: '/',
          editUrl: `${REPO_URL}/edit/main/`,
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: false,
        // Gives src/pages/*.md a git date for sitemap.xml (src/plugins/site-pages.ts).
        pages: { showLastUpdateTime: true },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: null,
          priority: null,
          // The local-search results page is a utility page, never an indexable URL.
          ignorePatterns: ['/search', '/search/**'],
          filename: 'sitemap.xml',
          // One date source for every URL: each doc's git date; a listing page the newest it lists
          // (src/plugins/site-pages.ts).
          createSitemapItems: async ({ defaultCreateSitemapItems, ...params }) =>
            (require('./src/plugins/site-pages') as typeof import('./src/plugins/site-pages')).withLastmod(
              await defaultCreateSitemapItems(params),
            ),
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Readable /sitemap and /feed pages, the RSS /feed.xml, and sitemap lastmod dates.
    (require('./src/plugins/site-pages') as typeof import('./src/plugins/site-pages')).default,
  ],

  themes: [
    [
      // Free, self-hosted in-browser fuzzy search. No Algolia signup. Indexes
      // every doc + page during `yarn build`; ships a small client-side bundle
      // that fetches the JSON index lazily on first focus.
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: 'right',
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: '/',
      },
    ],
  ],

  // Site-wide <head> tags. Top-level config, not themeConfig (where Docusaurus ignores them).
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'alternate', type: 'application/rss+xml', title: 'SMSApp documentation updates', href: `${SITE_URL}/feed.xml` },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: 'SMSApp Documentation',
            description: 'Documentation for an owner-operated Android SMS dispatch system with a web administration panel.',
            inLanguage: 'en-US',
            publisher: { '@id': `${SITE_URL}/#org` },
          },
          {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#org`,
            name: 'SMSApp',
            url: APP_URL,
            logo: `${APP_URL}/icons/icon-512.png`,
            sameAs: [APP_URL, REPO_URL, PLAY_URL],
          },
        ],
      }),
    },
  ],
  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      { name: 'author', content: TEAM_NAME },
      { name: 'keywords', content: 'android sms dispatch, web sms admin, pakistan mobile sms, sim sms sender, smsapp documentation' },
      { name: 'theme-color', content: '#6e56cf' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'SMSApp Documentation' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'SMSApp',
      logo: {
        alt: 'SMSApp documentation',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'tutorialsSidebar', position: 'left', label: 'Tutorials' },
        { type: 'docSidebar', sidebarId: 'howtoSidebar', position: 'left', label: 'How-to' },
        { type: 'docSidebar', sidebarId: 'referenceSidebar', position: 'left', label: 'Reference' },
        { type: 'docSidebar', sidebarId: 'explanationSidebar', position: 'left', label: 'Explanation' },
        { href: APP_URL, label: 'Open the app', position: 'right' },
        { href: REPO_URL, 'aria-label': 'GitHub repository', className: 'header-github-link', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'Tutorials', to: '/tutorials' },
            { label: 'How-to guides', to: '/how-to' },
            { label: 'Reference', to: '/reference' },
            { label: 'Explanation', to: '/explanation' },
          ],
        },
        {
          title: 'The app',
          items: [
            { label: 'Open the app', href: APP_URL },
            { label: 'Get it on Google Play', href: PLAY_URL },
            { label: 'Installation', to: '/tutorials/install-the-android-app' },
            { label: 'Privacy policy', href: `${APP_URL}/privacy` },
            { label: 'Terms', href: `${APP_URL}/terms` },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Source on GitHub', href: REPO_URL },
            { label: 'Report an issue', href: `${REPO_URL}/issues` },
            { label: 'Contact', href: `${APP_URL}/contact` },
            { label: 'Sitemap', to: '/sitemap' },
            { label: 'Feed', to: '/feed' },
            // Emitted after MDX compilation, so the link checker cannot see them: absolute on purpose.
            { label: 'sitemap.xml', href: `${SITE_URL}/sitemap.xml` },
            { label: 'feed.xml', href: `${SITE_URL}/feed.xml` },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} The SMS App team. SMSApp documentation under MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'java', 'kotlin', 'diff', 'yaml', 'markup-templating'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
