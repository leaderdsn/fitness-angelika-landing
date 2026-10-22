import { describe, expect, it } from 'vitest'

import { siteContentSchema } from './content'
import { DEFAULT_CONTENT } from './defaultContent'

describe('siteContentSchema', () => {
  it('accepts the default content', () => {
    expect(siteContentSchema.safeParse(DEFAULT_CONTENT).success).toBe(true)
  })

  it('trims text fields', () => {
    const parsed = siteContentSchema.parse({ ...DEFAULT_CONTENT, finalCta: { title: '  Пишите  ', text: '' } })
    expect(parsed.finalCta.title).toBe('Пишите')
  })

  it('stores contact links in canonical form', () => {
    const parsed = siteContentSchema.parse({
      ...DEFAULT_CONTENT,
      contacts: { ...DEFAULT_CONTENT.contacts, telegramUrl: 'https:/t.me/fitness_angelika' },
    })
    expect(parsed.contacts.telegramUrl).toBe('https://t.me/fitness_angelika')
  })

  it('rejects foreign links and images', () => {
    const result = siteContentSchema.safeParse({
      ...DEFAULT_CONTENT,
      contacts: { ...DEFAULT_CONTENT.contacts, telegramUrl: 'https://example.com/x' },
      hero: { ...DEFAULT_CONTENT.hero, photo: 'javascript:alert(1)' },
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual(['contacts.telegramUrl', 'hero.photo'])
  })

  it('requires titles', () => {
    const result = siteContentSchema.safeParse({ ...DEFAULT_CONTENT, seo: { ...DEFAULT_CONTENT.seo, title: ' ' } })
    expect(result.success).toBe(false)
  })
})
