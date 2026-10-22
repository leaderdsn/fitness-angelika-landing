import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTENT } from '#shared/defaultContent'

import { createMemoryStore } from '../testing/memoryStore'
import { backupSchema, createBackup, restoreBackup } from './backup'
import { readContent, writeContent } from './content'
import { collectAllStats, recordClick } from './stats'

const now = new Date('2026-10-22T12:00:00Z')

describe('backup', () => {
  it('round-trips content and stats into another store', async () => {
    const source = createMemoryStore()
    const content = { ...DEFAULT_CONTENT, finalCta: { title: 'Пишите', text: '' } }
    await writeContent(content, source)
    await recordClick(source, 'telegram', new Date('2026-10-20T08:00:00Z'))

    const backup = backupSchema.parse(JSON.parse(JSON.stringify(await createBackup(source, now))))
    expect(backup.stats).toEqual([{ date: '2026-10-20', telegram: 1, instagram: 0 }])

    const target = createMemoryStore()
    await recordClick(target, 'instagram', new Date('2026-10-01T08:00:00Z'))
    await restoreBackup(target, backup)

    expect(await readContent(target)).toEqual(content)
    expect((await collectAllStats(target, now)).totals).toEqual({ telegram: 1, instagram: 0 })
  })

  it('rejects foreign files', () => {
    expect(backupSchema.safeParse({ app: 'other', version: 1 }).success).toBe(false)
  })
})
