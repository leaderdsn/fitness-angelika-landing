import { z } from 'zod'

import { isPasswordValid } from '../../utils/password'
import { createRateLimiter } from '../../utils/rateLimit'
import { useAdminSession } from '../../utils/session'

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

  if (!adminPassword) {
    throw createError({ statusCode: 503, statusMessage: 'Пароль администратора не задан (NUXT_ADMIN_PASSWORD)' })
  }
  if (!isPasswordValid(password, adminPassword)) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }

  limiter.reset(ip)
  const session = await useAdminSession(event)
  await session.update({ authenticated: true })
  return { authenticated: true }
})
