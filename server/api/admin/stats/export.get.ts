import { z } from 'zod'

import { collectAllStats, toDateKey } from '../../../utils/stats'
import { STATS_EXPORT_FORMATS, statsToCsv, statsToPdf, statsToXlsx } from '../../../utils/statsExport'

const querySchema = z.object({ format: z.enum(STATS_EXPORT_FORMATS) })

const CONTENT_TYPES = {
  csv: 'text/csv; charset=utf-8',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
} as const

async function readFont(name: string): Promise<Uint8Array> {
  const font = await useStorage('assets:server').getItemRaw<Uint8Array>(`fonts:${name}`)
  if (!font) throw createError({ statusCode: 500, statusMessage: `Font ${name} is missing` })
  return font
}

export default defineEventHandler(async (event) => {
  const { format } = await getValidatedQuery(event, (query) => querySchema.parse(query))
  const stats = await collectAllStats(useStorage('data'))

  let body: string | Buffer | Uint8Array
  if (format === 'csv') {
    body = statsToCsv(stats)
  } else if (format === 'xlsx') {
    body = await statsToXlsx(stats)
  } else {
    body = await statsToPdf(stats, { regular: await readFont('DejaVuSans.ttf'), bold: await readFont('DejaVuSans-Bold.ttf') })
  }

  setHeader(event, 'Content-Type', CONTENT_TYPES[format])
  setHeader(event, 'Content-Disposition', `attachment; filename="stats-${toDateKey(new Date())}.${format}"`)
  setHeader(event, 'Cache-Control', 'no-store')
  return body
})
