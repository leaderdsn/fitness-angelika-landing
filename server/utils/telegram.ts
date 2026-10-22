/** Sends a plain-text message through the Telegram Bot API; retries because api.telegram.org is sometimes unreachable. */
export async function sendTelegramMessage(botToken: string, chatId: string, text: string): Promise<void> {
  await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    body: { chat_id: chatId, text, link_preview_options: { is_disabled: true } },
    timeout: 10_000,
    retry: 2,
    retryDelay: 1000,
  })
}
