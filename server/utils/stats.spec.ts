import { describe, expect, it } from 'vitest'

import { collectStats, recordClick, toDateKey } from './stats'

import type { KeyValueStore } from './keyValueStore'

function createMemoryStore(): KeyValueStore {
  const items = new Map<string, unknown>()
  return {
    getItem: <T>(key: string) => Promise.resolve((items.get(key) as T | undefined) ?? null),
    setItem: (key, value) => {
      items.set(key, value)
      return Promise.resolve()
    },
  }
}

describe('click stats', () => {
  const today = new Date('2026-10-22T12:00:00Z')

  it('counts clicks per channel and day', async () => {
    const store = createMemoryStore()
    await recordClick(store, 'telegram', today)
    await recordClick(store, 'telegram', today)
    await recordClick(store, 'instagram', new Date('2026-10-20T08:00:00Z'))

    const stats = await collectStats(store, 3, today)

    expect(stats.daily).toEqual([
      { date: '2026-10-20', telegram: 0, instagram: 1 },
      { date: '2026-10-21', telegram: 0, instagram: 0 },
      { date: '2026-10-22', telegram: 2, instagram: 0 },
    ])
    expect(stats.totals).toEqual({ telegram: 2, instagram: 1 })
  })

  it('ignores clicks outside the period', async () => {
    const store = createMemoryStore()
    await recordClick(store, 'instagram', new Date('2026-09-01T00:00:00Z'))

    const stats = await collectStats(store, 30, today)

    expect(stats.daily).toHaveLength(30)
    expect(stats.totals).toEqual({ telegram: 0, instagram: 0 })
  })

  it('uses UTC date keys', () => {
    expect(toDateKey(new Date('2026-10-22T23:59:59Z'))).toBe('2026-10-22')
  })
})
