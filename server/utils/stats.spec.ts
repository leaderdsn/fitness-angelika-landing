import { describe, expect, it } from 'vitest'

import { createMemoryStore } from '../testing/memoryStore'
import { collectAllStats, collectStats, recordClick, replaceStats, toDateKey } from './stats'

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

describe('full stats history', () => {
  const today = new Date('2026-10-22T12:00:00Z')

  it('spans from the first recorded day to today', async () => {
    const store = createMemoryStore()
    await recordClick(store, 'telegram', new Date('2026-10-20T08:00:00Z'))

    const stats = await collectAllStats(store, today)

    expect(stats.daily.map((day) => day.date)).toEqual(['2026-10-20', '2026-10-21', '2026-10-22'])
    expect(stats.totals).toEqual({ telegram: 1, instagram: 0 })
  })

  it('is empty without clicks', async () => {
    expect((await collectAllStats(createMemoryStore(), today)).daily).toEqual([])
  })

  it('replaces stored days', async () => {
    const store = createMemoryStore()
    await recordClick(store, 'telegram', new Date('2026-10-01T08:00:00Z'))

    await replaceStats(store, [{ date: '2026-10-21', telegram: 3, instagram: 4 }])

    const stats = await collectAllStats(store, today)
    expect(stats.daily[0]).toEqual({ date: '2026-10-21', telegram: 3, instagram: 4 })
    expect(stats.totals).toEqual({ telegram: 3, instagram: 4 })
  })
})
