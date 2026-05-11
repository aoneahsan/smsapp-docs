import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// SMS Mobile App — public documentation site
// Author: Ahsan Mahmood <aoneahsan@gmail.com>
// Source: https://github.com/aoneahsan/smsapp-docs
// Deploys to: https://smsapp-docs.aoneahsan.com

const SITE_URL = 'https://smsapp-docs.aoneahsan.com';
const APP_URL = 'https://smsapp.aoneahsan.com';
const REPO_URL = 'https://github.com/aoneahsan/smsapp-docs';
const AUTHOR_NAME = 'Ahsan Mahmood';
const AUTHOR_PORTFOLIO = 'https://aoneahsan.com';
const AUTHOR_LINKEDIN = 'https://linkedin.com/in/aoneahsan';
const AUTHOR_GITHUB = 'https://github.com/aoneahsan';

const config: Config = {
  title: 'SMS Mobile App Documentation',
  tagline: 'Android-first SMS automation that uses your phone’s SIM card.',
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
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'warn',

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
          routeBasePath: '/',
          editUrl: `${REPO_URL}/edit/main/`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
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

  themeConfig: {
    // SVG fallback until Batch 10 generates a 1200x630 PNG social card.
    // Most platforms render SVG; Twitter falls back to no image gracefully.
    image: 'img/logo.svg',
    metadata: [
      { name: 'author', content: AUTHOR_NAME },
      { name: 'keywords', content: 'sms automation, android sms, capacitor sms, firebase sms, sim sms sender, scheduled sms android, batch sms android, smsapp documentation' },
      { name: 'theme-color', content: '#6e56cf' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'SMS Mobile App Documentation' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
    ],
    headTags: [
      {
        tagName: 'link',
        attributes: { rel: 'canonical', href: SITE_URL },
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
              name: 'SMS Mobile App Documentation',
              description: 'Official public documentation for SMS Mobile App — an Android-first SMS automation app that sends from your phone’s own SIM card, with Firebase-backed scheduling.',
              inLanguage: 'en-US',
              publisher: { '@id': `${SITE_URL}/#person-author` },
            },
            {
              '@type': 'Organization',
              '@id': `${SITE_URL}/#org`,
              name: 'SMS Mobile App',
              url: APP_URL,
              logo: `${APP_URL}/icons/icon-512.png`,
              sameAs: [APP_URL, REPO_URL, AUTHOR_PORTFOLIO],
            },
            {
              '@type': 'Person',
              '@id': `${SITE_URL}/#person-author`,
              name: AUTHOR_NAME,
              url: AUTHOR_PORTFOLIO,
              email: 'aoneahsan@gmail.com',
              jobTitle: 'Senior Software Engineer',
              sameAs: [AUTHOR_PORTFOLIO, AUTHOR_LINKEDIN, AUTHOR_GITHUB, 'https://npmjs.com/~aoneahsan'],
            },
          ],
        }),
      },
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
      title: 'SMS Mobile App',
      logo: {
        alt: 'SMS Mobile App documentation',
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
            { label: 'Apps & download', href: `${APP_URL}/apps` },
            { label: 'Pricing', href: `${APP_URL}/pricing` },
            { label: 'Privacy policy', href: `${APP_URL}/privacy` },
            { label: 'Terms', href: `${APP_URL}/terms` },
          ],
        },
        {
          title: 'About the developer',
          items: [
            { label: AUTHOR_NAME, href: AUTHOR_PORTFOLIO },
            { label: 'LinkedIn', href: AUTHOR_LINKEDIN },
            { label: 'GitHub', href: AUTHOR_GITHUB },
            { label: 'NPM', href: 'https://npmjs.com/~aoneahsan' },
            { label: 'Email', href: 'mailto:aoneahsan@gmail.com' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Source on GitHub', href: REPO_URL },
            { label: 'Report an issue', href: `${REPO_URL}/issues` },
            { label: 'Contact', href: `${APP_URL}/contact` },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} ${AUTHOR_NAME}. SMS Mobile App is built and maintained by Ahsan Mahmood. Documentation under MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'java', 'kotlin', 'diff', 'yaml', 'markup-templating'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
