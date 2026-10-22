import { createBackup } from '../../utils/backup'
import { toDateKey } from '../../utils/stats'

export default defineEventHandler(async (event) => {
  const backup = await createBackup(useStorage('data'))
  setHeader(event, 'Content-Disposition', `attachment; filename="backup-${toDateKey(new Date())}.json"`)
  setHeader(event, 'Cache-Control', 'no-store')
  return backup
})
