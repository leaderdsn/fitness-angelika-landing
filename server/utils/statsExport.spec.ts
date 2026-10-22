import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { formatDateKey, statsToCsv, statsToPdf, statsToXlsx } from './statsExport'

import type { ClickStats } from '#shared/stats'

const stats: ClickStats = {
  days: 2,
  daily: [
    { date: '2026-10-21', telegram: 2, instagram: 1 },
    { date: '2026-10-22', telegram: 0, instagram: 3 },
  ],
  totals: { telegram: 2, instagram: 4 },
}

const font = (name: string) => readFileSync(new URL(`../assets/fonts/${name}`, import.meta.url))

describe('stats export', () => {
  it('formats date keys', () => {
    expect(formatDateKey('2026-10-22')).toBe('22.10.2026')
  })

  it('writes CSV for Excel with totals', () => {
    expect(statsToCsv(stats)).toBe(
      String.fromCharCode(0xfeff) +
        'Дата;Telegram;Instagram;Всего\r\n21.10.2026;2;1;3\r\n22.10.2026;0;3;3\r\nИтого;2;4;6\r\n',
    )
  })

  it('writes an xlsx (zip) file', async () => {
    const file = await statsToXlsx(stats)
    expect(file.subarray(0, 2).toString()).toBe('PK')
  })

  it('writes a PDF with Cyrillic fonts, paginating long periods', async () => {
    const long: ClickStats = {
      ...stats,
      daily: Array.from({ length: 90 }, (_, index) => ({ date: '2026-07-01', telegram: index, instagram: 0 })),
    }
    const fonts = { regular: font('DejaVuSans.ttf'), bold: font('DejaVuSans-Bold.ttf') }

    const file = await statsToPdf(long, fonts, new Date('2026-10-22T12:00:00Z'))

    expect(Buffer.from(file.subarray(0, 5)).toString()).toBe('%PDF-')
    const { PDFDocument } = await import('pdf-lib')
    expect((await PDFDocument.load(file)).getPageCount()).toBeGreaterThan(1)
  })
})
