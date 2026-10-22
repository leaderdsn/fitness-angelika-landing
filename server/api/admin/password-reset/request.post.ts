import { RESET_TOKEN_TTL_MS, createResetToken } from '../../../utils/adminCredentials'
import { createRateLimiter } from '../../../utils/rateLimit'
import { sendTelegramMessage } from '../../../utils/telegram'

// 3 requests per 15 minutes per IP: every request messages the admin.
const limiter = createRateLimiter(3, 15 * 60 * 1000)

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!limiter.hit(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много запросов, попробуйте позже' })
  }

  const { telegramBotToken, telegramChatId, public: publicConfig } = useRuntimeConfig(event)
  if (!telegramBotToken || !telegramChatId) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Восстановление не настроено (NUXT_TELEGRAM_BOT_TOKEN, NUXT_TELEGRAM_CHAT_ID)',
    })
  }

  const token = await createResetToken(useStorage('data'))
  // The link is built from the configured site URL, never from the request Host header.
  const link = new URL(`/admin/reset-password?token=${token}`, publicConfig.siteUrl).toString()
  const minutes = RESET_TOKEN_TTL_MS / 60_000

  try {
    await sendTelegramMessage(
      telegramBotToken,
      telegramChatId,
      `Восстановление пароля админки.\n\nЧтобы задать новый пароль, откройте ссылку (действует ${minutes} минут):\n${link}\n\nЕсли вы не запрашивали сброс, просто проигнорируйте это сообщение.`,
    )
  } catch (cause) {
    console.error('[password-reset] failed to send Telegram message', cause)
    throw createError({ statusCode: 502, statusMessage: 'Не удалось отправить сообщение в Telegram' })
  }

  return { sent: true }
})
