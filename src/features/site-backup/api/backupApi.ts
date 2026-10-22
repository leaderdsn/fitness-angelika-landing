export const BACKUP_DOWNLOAD_URL = '/api/admin/backup'

/** Replaces the site content and click stats with a backup file's data. */
export async function restoreBackup(file: File): Promise<void> {
  let backup: unknown
  try {
    backup = JSON.parse(await file.text())
  } catch {
    throw new Error('Это не файл резервной копии сайта')
  }
  await $fetch('/api/admin/backup', { method: 'POST', body: backup as Record<string, unknown> })
}
