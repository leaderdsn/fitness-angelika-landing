import { z } from 'zod'

import { checkAdminPassword, getStoredPassword } from '../../utils/adminCredentials'
import { createRateLimiter } from '../../utils/rateLimit'
import { signIn } from '../../utils/session'

const loginSchema = z.object({ password: z.string().min(1).max(200) })

// 10 attempts per 15 minutes per IP.
const limiter = createRateLimiter(10, 15 * 60 * 1000)

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!limiter.hit(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много попыток, попробуйте позже' })
  }

  const { password } = await readValidatedBody(event, (body) => loginSchema.parse(body))
  const { adminPassword } = useRuntimeConfig(event)
  const store = useStorage('data')
  const stored = await getStoredPassword(store)

  if (!stored && !adminPassword) {
    throw createError({ statusCode: 503, statusMessage: 'Пароль администратора не задан (NUXT_ADMIN_PASSWORD)' })
  }
  if (!(await checkAdminPassword(store, password, adminPassword))) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }

  limiter.reset(ip)
  await signIn(event, stored?.changedAt ?? 0)
  return { authenticated: true }
})
