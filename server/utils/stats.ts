import { CONTACT_CHANNELS } from '#shared/links'

import type { ContactChannel } from '#shared/links'
import type { ClickStats, DailyClicks } from '#shared/stats'
import type { KeyValueStore } from './keyValueStore'

type StoredDay = Partial<Record<ContactChannel, number>>

const DAY_MS = 24 * 60 * 60 * 1000

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function statsKey(dateKey: string): string {
  return `stats:${dateKey}`
}

export async function recordClick(store: KeyValueStore, channel: ContactChannel, now = new Date()): Promise<void> {
  const key = statsKey(toDateKey(now))
  const day = (await store.getItem<StoredDay>(key)) ?? {}
  await store.setItem(key, { ...day, [channel]: (day[channel] ?? 0) + 1 })
}

/** Clicks per day for the last `days` days (oldest first), including today. */
export async function collectStats(store: KeyValueStore, days: number, now = new Date()): Promise<ClickStats> {
  const dateKeys = Array.from({ length: days }, (_, index) =>
    toDateKey(new Date(now.getTime() - (days - 1 - index) * DAY_MS)),
  )

  const daily: DailyClicks[] = await Promise.all(
    dateKeys.map(async (date) => {
      const day = (await store.getItem<StoredDay>(statsKey(date))) ?? {}
      return { date, telegram: day.telegram ?? 0, instagram: day.instagram ?? 0 }
    }),
  )

  const totals = Object.fromEntries(
    CONTACT_CHANNELS.map((channel) => [channel, daily.reduce((sum, day) => sum + day[channel], 0)]),
  ) as Record<ContactChannel, number>

  return { days, daily, totals }
}

const STATS_PREFIX = 'stats:'
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

async function storedDates(store: KeyValueStore): Promise<string[]> {
  const keys = await store.getKeys(STATS_PREFIX)
  return keys
    .map((key) => key.slice(STATS_PREFIX.length))
    .filter((date) => DATE_KEY_PATTERN.test(date))
    .sort()
}

/** Every day from the first recorded click up to today; empty when nothing was recorded. */
export async function collectAllStats(store: KeyValueStore, now = new Date()): Promise<ClickStats> {
  const [first] = await storedDates(store)
  const days = first ? Math.floor((Date.parse(toDateKey(now)) - Date.parse(first)) / DAY_MS) + 1 : 0
  return collectStats(store, Math.max(days, 0), now)
}

/** Replaces all stored stats with the given days (used to restore a backup). */
export async function replaceStats(store: KeyValueStore, daily: DailyClicks[]): Promise<void> {
  await Promise.all((await storedDates(store)).map((date) => store.removeItem(statsKey(date))))
  await Promise.all(
    daily.map(({ date, telegram, instagram }) => store.setItem(statsKey(date), { telegram, instagram })),
  )
}
