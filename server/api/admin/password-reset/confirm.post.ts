import { z } from 'zod'

import { consumeResetToken, setAdminPassword } from '../../../utils/adminCredentials'
import { createRateLimiter } from '../../../utils/rateLimit'
import { signIn } from '../../../utils/session'

const confirmSchema = z.object({
  token: z.string().regex(/^[0-9a-f]{64}$/),
  password: z.string().min(8).max(200),
})

const INVALID_LINK = 'Ссылка недействительна или устарела, запросите новую'

// 10 attempts per 15 minutes per IP.
const limiter = createRateLimiter(10, 15 * 60 * 1000)

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!limiter.hit(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много попыток, попробуйте позже' })
  }

  const parsed = confirmSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    const badToken = parsed.error.issues.some((issue) => issue.path[0] === 'token')
    throw createError({ statusCode: 400, statusMessage: badToken ? INVALID_LINK : 'Пароль должен быть не короче 8 символов' })
  }

  const store = useStorage('data')
  if (!(await consumeResetToken(store, parsed.data.token))) {
    throw createError({ statusCode: 400, statusMessage: INVALID_LINK })
  }

  const stamp = await setAdminPassword(store, parsed.data.password)
  await signIn(event, stamp)
  return { authenticated: true }
})
