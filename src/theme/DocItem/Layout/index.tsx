import React from 'react'
import OriginalLayout from '@theme-original/DocItem/Layout'
import Head from '@docusaurus/Head'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const SITE_URL = 'https://smsapp-docs.aoneahsan.com'
const APP_URL = 'https://smsapp.aoneahsan.com'
const AUTHOR_NAME = 'Ahsan Mahmood'
const AUTHOR_URL = 'https://aoneahsan.com'
const AUTHOR_LINKEDIN = 'https://linkedin.com/in/aoneahsan'
const AUTHOR_GITHUB = 'https://github.com/aoneahsan'

type Faq = { question: string; answer: string }

type LooseRecord = Record<string, unknown>

function isFaqArray(value: unknown): value is Faq[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        typeof v === 'object' &&
        v !== null &&
        typeof (v as LooseRecord).question === 'string' &&
        typeof (v as LooseRecord).answer === 'string',
    )
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

function readKeywords(fm: LooseRecord): string | undefined {
  const k = fm.keywords
  if (typeof k === 'string') return k
  if (isStringArray(k)) return k.join(', ')
  return undefined
}

export default function DocItemLayoutWrapper(props: Record<string, unknown>) {
  const { metadata, frontMatter } = useDoc()
  const { siteConfig } = useDocusaurusContext()

  const fm = frontMatter as LooseRecord
  const url = `${SITE_URL}${metadata.permalink}`
  const title = (fm.title as string | undefined) ?? metadata.title
  const description =
    (fm.description as string | undefined) ?? (metadata as LooseRecord).description as string | undefined
  const keywords = readKeywords(fm)

  // Frontmatter `last_update.date` can serialise as either a string
  // (when quoted in YAML) or a JS Date object (when unquoted). Accept
  // both. Fall back to Docusaurus' `metadata.lastUpdatedAt` (seconds)
  // when frontmatter is silent.
  function readDate(v: unknown): string | undefined {
    if (typeof v === 'string') return v
    if (v instanceof Date) return v.toISOString().slice(0, 10)
    return undefined
  }
  const fmLast = fm.last_update as LooseRecord | undefined
  const fmDate = fmLast ? readDate(fmLast.date) : undefined
  const tsLast = (metadata as LooseRecord).lastUpdatedAt
  const tsDate =
    typeof tsLast === 'number' ? new Date(tsLast * 1000).toISOString().slice(0, 10) : undefined
  const lastUpdateDate = fmDate ?? tsDate
  const lastUpdateAuthor =
    fmLast && typeof fmLast.author === 'string' ? (fmLast.author as string) : AUTHOR_NAME
  const datePublished = lastUpdateDate ? `${lastUpdateDate}T00:00:00.000Z` : undefined

  // Path-based schema selection. /how-to/* pages emit HowTo by default,
  // any page with a `faq` frontmatter array also emits FAQPage, every
  // page falls back to TechArticle for the document body.
  const isHowTo = metadata.permalink.startsWith('/how-to/')
  const faq = isFaqArray(fm.faq) ? fm.faq : undefined

  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    name: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#org` },
    author: {
      '@type': 'Person',
      name: lastUpdateAuthor,
      url: AUTHOR_URL,
      sameAs: [AUTHOR_URL, AUTHOR_LINKEDIN, AUTHOR_GITHUB],
    },
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    ...(keywords ? { keywords } : {}),
  }

  const howTo = isHowTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: title,
        description,
        url,
        author: { '@type': 'Person', name: lastUpdateAuthor, url: AUTHOR_URL },
        inLanguage: 'en-US',
      }
    : undefined

  const faqPage = faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : undefined

  // SoftwareApplication schema is emitted on the docs homepage so AI
  // engines can answer "what is SMS Mobile App?" with a structured
  // entity. Subsequent pages reference the same entity via @id linking
  // back through the WebSite graph in docusaurus.config.ts.
  const isHome = metadata.permalink === '/' || metadata.permalink === ''
  const softwareApp = isHome
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SMS Mobile App',
        url: APP_URL,
        applicationCategory: 'CommunicationApplication',
        operatingSystem: 'Android',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': `${SITE_URL}/#org` },
        author: { '@id': `${SITE_URL}/#person-author` },
      }
    : undefined

  const ogImage =
    (fm.image as string | undefined) ??
    (siteConfig.themeConfig as LooseRecord | undefined)?.image as string | undefined

  return (
    <>
      <Head>
        {/* Canonical + per-page OG/Twitter overrides */}
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        <meta property="og:type" content="article" />
        {ogImage && (
          <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${SITE_URL}/${ogImage}`} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        {ogImage && (
          <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${SITE_URL}/${ogImage}`} />
        )}
        {datePublished && <meta property="article:published_time" content={datePublished} />}
        {datePublished && <meta property="article:modified_time" content={datePublished} />}
        <meta property="article:author" content={lastUpdateAuthor} />

        {/* Per-page JSON-LD: TechArticle (always) + HowTo (when applicable)
            + FAQPage (when frontmatter `faq` present) + SoftwareApplication (home only). */}
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        {howTo && <script type="application/ld+json">{JSON.stringify(howTo)}</script>}
        {faqPage && <script type="application/ld+json">{JSON.stringify(faqPage)}</script>}
        {softwareApp && <script type="application/ld+json">{JSON.stringify(softwareApp)}</script>}
      </Head>
      <OriginalLayout {...props} />
    </>
  )
}
