import { isAdmin } from '../utils/session'

const PUBLIC_ADMIN_ROUTES = new Set([
  '/api/admin/login',
  '/api/admin/session',
  '/api/admin/password-reset/request',
  '/api/admin/password-reset/confirm',
])

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0] ?? ''
  if (!path.startsWith('/api/admin/') || PUBLIC_ADMIN_ROUTES.has(path)) return

  if (!(await isAdmin(event))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
