import { z } from 'zod'

import { siteContentSchema } from '#shared/content'

import { readContent, writeContent } from './content'
import { collectAllStats, replaceStats } from './stats'

import type { KeyValueStore } from './keyValueStore'

const BACKUP_APP = 'fitness-angelika-landing'

const count = z.number().int().min(0)

/** Content and click stats. Photos and the admin password are not included. */
export const backupSchema = z.object({
  app: z.literal(BACKUP_APP),
  version: z.literal(1),
  createdAt: z.string(),
  content: siteContentSchema,
  stats: z
    .array(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), telegram: count, instagram: count }))
    .max(20_000),
})

export type Backup = z.infer<typeof backupSchema>

export async function createBackup(store: KeyValueStore, now = new Date()): Promise<Backup> {
  return {
    app: BACKUP_APP,
    version: 1,
    createdAt: now.toISOString(),
    content: await readContent(store),
    // Days without clicks carry no information.
    stats: (await collectAllStats(store, now)).daily.filter((day) => day.telegram + day.instagram > 0),
  }
}

export async function restoreBackup(store: KeyValueStore, backup: Backup): Promise<void> {
  await writeContent(backup.content, store)
  await replaceStats(store, backup.stats)
}
