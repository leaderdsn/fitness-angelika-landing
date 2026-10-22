import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTENT } from '#shared/defaultContent'

import { buildPersonJsonLd, toAbsoluteUrl } from './seo'

describe('seo helpers', () => {
  it('resolves media paths against the site url', () => {
    expect(toAbsoluteUrl('/api/media/a.jpg', 'https://example.com')).toBe('https://example.com/api/media/a.jpg')
    expect(toAbsoluteUrl('https://cdn.example.com/a.jpg', 'https://example.com')).toBe('https://cdn.example.com/a.jpg')
  })

  it('builds Person markup with only configured profiles', () => {
    const data = JSON.parse(buildPersonJsonLd(DEFAULT_CONTENT, 'https://example.com')) as { sameAs: string[] }
    expect(data.sameAs).toEqual([DEFAULT_CONTENT.contacts.instagramUrl])
  })

  it('escapes "<" so content cannot break out of the script tag', () => {
    const content = { ...DEFAULT_CONTENT, seo: { ...DEFAULT_CONTENT.seo, description: '</script><b>' } }
    expect(buildPersonJsonLd(content, 'https://example.com')).not.toContain('<')
  })
})
