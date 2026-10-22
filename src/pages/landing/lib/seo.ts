import { isTelegramUrl } from '#shared/links'

import type { SiteContent } from '#shared/content'

// JSON escape sequence for "<" (backslash + u003c), safe inside <script>.
const ESCAPED_LT = String.fromCharCode(92) + 'u003c'

export function toAbsoluteUrl(path: string, siteUrl: string): string {
  return new URL(path, siteUrl).toString()
}

/** schema.org Person markup; "<" is escaped so content can never close the script tag. */
export function buildPersonJsonLd(content: SiteContent, siteUrl: string): string {
  const photo = content.about.photo || content.hero.photo
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Анжелика Александрова',
    jobTitle: 'Фитнес-терапевт, хореограф',
    description: content.seo.description,
    url: siteUrl,
    image: photo ? toAbsoluteUrl(photo, siteUrl) : undefined,
    sameAs: [
      content.contacts.instagramUrl,
      ...(isTelegramUrl(content.contacts.telegramUrl) ? [content.contacts.telegramUrl] : []),
    ],
  }
  return JSON.stringify(data).replace(/</g, ESCAPED_LT)
}
