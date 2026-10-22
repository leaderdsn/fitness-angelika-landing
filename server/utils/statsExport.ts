import fontkit from '@pdf-lib/fontkit'
import { PageSizes, PDFDocument, rgb } from 'pdf-lib'
import writeExcelFile from 'write-excel-file/node'

import type { ClickStats, DailyClicks } from '#shared/stats'
import type { PDFFont, PDFPage } from 'pdf-lib'

export const STATS_EXPORT_FORMATS = ['csv', 'xlsx', 'pdf'] as const

export type StatsExportFormat = (typeof STATS_EXPORT_FORMATS)[number]

/** Cyrillic-capable TrueType fonts; the standard PDF fonts cover Latin only. */
export type PdfFonts = { regular: Uint8Array; bold: Uint8Array }

// Byte order mark: tells Excel the file is UTF-8.
const BOM = String.fromCharCode(0xfeff)

const HEADERS = ['Дата', 'Telegram', 'Instagram', 'Всего']

/** 2026-10-22 → 22.10.2026 */
export function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-')
  return `${day}.${month}.${year}`
}

const dayTotal = (day: DailyClicks): number => day.telegram + day.instagram

/** Semicolon-separated with a BOM, so Excel with Russian locale opens it correctly. */
export function statsToCsv(stats: ClickStats): string {
  const { telegram, instagram } = stats.totals
  const rows = [
    HEADERS,
    ...stats.daily.map((day) => [formatDateKey(day.date), day.telegram, day.instagram, dayTotal(day)]),
    ['Итого', telegram, instagram, telegram + instagram],
  ]
  return `${BOM}${rows.map((row) => row.join(';')).join('\r\n')}\r\n`
}

export function statsToXlsx(stats: ClickStats): Promise<Buffer> {
  const { telegram, instagram } = stats.totals
  const bold = (value: string | number) => ({ value, fontWeight: 'bold' as const })

  return writeExcelFile(
    [
      HEADERS.map(bold),
      ...stats.daily.map((day) => [
        { value: new Date(`${day.date}T00:00:00Z`), type: Date, format: 'dd.mm.yyyy' },
        day.telegram,
        day.instagram,
        dayTotal(day),
      ]),
      [bold('Итого'), bold(telegram), bold(instagram), bold(telegram + instagram)],
    ],
    { sheet: 'Переходы', columns: [{ width: 14 }, { width: 12 }, { width: 12 }, { width: 10 }], stickyRowsCount: 1 },
  ).toBuffer()
}

const PDF_COLORS = {
  ink: rgb(0.176, 0.122, 0.141),
  muted: rgb(0.42, 0.353, 0.369),
  accent: rgb(0.596, 0.235, 0.333),
  border: rgb(0.898, 0.835, 0.784),
}

export async function statsToPdf(stats: ClickStats, fonts: PdfFonts, now = new Date()): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  doc.setTitle('Переходы на сайте')
  const regular = await doc.embedFont(fonts.regular, { subset: true })
  const bold = await doc.embedFont(fonts.bold, { subset: true })

  const [width, height] = PageSizes.A4
  const margin = 50
  const rowHeight = 20
  // Right edges of the numeric columns; the date column is left-aligned at the margin.
  const numberColumns = [margin + 240, margin + 360, width - margin]

  let page: PDFPage = doc.addPage(PageSizes.A4)
  let y = height - margin

  const text = (value: string, x: number, font: PDFFont, size: number, color = PDF_COLORS.ink) =>
    page.drawText(value, { x, y, font, size, color })
  const textRight = (value: string, right: number, font: PDFFont, size: number) =>
    text(value, right - font.widthOfTextAtSize(value, size), font, size)
  const rule = () =>
    page.drawLine({
      start: { x: margin, y: y - 6 },
      end: { x: width - margin, y: y - 6 },
      thickness: 0.5,
      color: PDF_COLORS.border,
    })

  const drawRow = (cells: (string | number)[], font: PDFFont) => {
    const [first, ...numbers] = cells.map(String)
    text(first ?? '', margin, font, 10)
    numbers.forEach((value, index) => textRight(value, numberColumns[index] ?? width - margin, font, 10))
    rule()
    y -= rowHeight
  }

  text('Переходы на сайте', margin, bold, 20, PDF_COLORS.accent)
  y -= 22
  const first = stats.daily[0]
  const last = stats.daily.at(-1)
  const period =
    first && last ? `с ${formatDateKey(first.date)} по ${formatDateKey(last.date)}` : 'переходов пока не было'
  text(`Нажатия на кнопки Telegram и Instagram, ${period}`, margin, regular, 10, PDF_COLORS.muted)
  y -= 14
  text(`Сформировано ${now.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`, margin, regular, 9, PDF_COLORS.muted)
  y -= 30

  // Data rows continue on a new page with the header repeated.
  const drawBodyRow = (cells: (string | number)[], font: PDFFont) => {
    if (y < margin + rowHeight) {
      page = doc.addPage(PageSizes.A4)
      y = height - margin
      drawRow(HEADERS, bold)
    }
    drawRow(cells, font)
  }

  drawRow(HEADERS, bold)
  for (const day of stats.daily) {
    drawBodyRow([formatDateKey(day.date), day.telegram, day.instagram, dayTotal(day)], regular)
  }
  const { telegram, instagram } = stats.totals
  drawBodyRow(['Итого', telegram, instagram, telegram + instagram], bold)

  return doc.save()
}
