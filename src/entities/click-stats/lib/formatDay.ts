const formatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' })

/** 2026-10-22 → "22 окт." */
export function formatDay(dateKey: string): string {
  return formatter.format(new Date(`${dateKey}T00:00:00Z`))
}
