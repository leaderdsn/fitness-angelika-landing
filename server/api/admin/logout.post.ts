import { useAdminSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)
  await session.clear()
  return { authenticated: false }
})
