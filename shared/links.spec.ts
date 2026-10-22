import { describe, expect, it } from 'vitest'

import { getInstagramUsername, isContactChannel, isInstagramUrl, isTelegramUrl, resolvePrimaryContact } from './links'

describe('contact links', () => {
  it('validates Telegram links', () => {
    expect(isTelegramUrl('https://t.me/angelika')).toBe(true)
    expect(isTelegramUrl('http://t.me/angelika')).toBe(false)
    expect(isTelegramUrl('https://t.me/')).toBe(false)
    expect(isTelegramUrl('https://evil.com/t.me/angelika')).toBe(false)
  })

  it('validates Instagram links and extracts the username', () => {
    expect(isInstagramUrl('https://www.instagram.com/fitness.angelika/')).toBe(true)
    expect(isInstagramUrl('javascript:alert(1)')).toBe(false)
    expect(getInstagramUsername('https://www.instagram.com/fitness.angelika/')).toBe('fitness.angelika')
    expect(getInstagramUsername('https://ig.me/m/fitness.angelika')).toBe('fitness.angelika')
  })

  it('falls back to Instagram Direct when Telegram is not set', () => {
    const instagramUrl = 'https://www.instagram.com/fitness.angelika/'
    expect(resolvePrimaryContact({ telegramUrl: '', instagramUrl })).toEqual({
      channel: 'instagram',
      href: 'https://ig.me/m/fitness.angelika',
    })
    expect(resolvePrimaryContact({ telegramUrl: 'https://t.me/angelika', instagramUrl })).toEqual({
      channel: 'telegram',
      href: 'https://t.me/angelika',
    })
  })

  it('narrows contact channels', () => {
    expect(isContactChannel('telegram')).toBe(true)
    expect(isContactChannel('vk')).toBe(false)
  })
})
