import type { ContactChannel } from './links'

export type DailyClicks = { date: string } & Record<ContactChannel, number>

export type ClickStats = {
  days: number
  daily: DailyClicks[]
  totals: Record<ContactChannel, number>
}
