import { backupSchema, restoreBackup } from '../../utils/backup'

export default defineEventHandler(async (event) => {
  const result = backupSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 422, statusMessage: 'Это не файл резервной копии сайта или он повреждён' })
  }

  await restoreBackup(useStorage('data'), result.data)
  return { restored: true }
})
