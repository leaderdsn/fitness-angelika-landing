export const CONTACT_CHANNELS = ['telegram', 'instagram'] as const

export type ContactChannel = (typeof CONTACT_CHANNELS)[number]

const TELEGRAM_HOSTS = new Set(['t.me', 'telegram.me'])
const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com', 'ig.me'])

function parseHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export function isTelegramUrl(value: string): boolean {
  const url = parseHttpsUrl(value)
  return url !== null && TELEGRAM_HOSTS.has(url.hostname) && url.pathname.length > 1
}

export function isInstagramUrl(value: string): boolean {
  const url = parseHttpsUrl(value)
  return url !== null && INSTAGRAM_HOSTS.has(url.hostname) && url.pathname.length > 1
}

export function isContactChannel(value: unknown): value is ContactChannel {
  return typeof value === 'string' && (CONTACT_CHANNELS as readonly string[]).includes(value)
}

/** Extracts the account name from an Instagram profile link: https://www.instagram.com/name/ → name. */
export function getInstagramUsername(profileUrl: string): string | null {
  const url = parseHttpsUrl(profileUrl)
  if (!url || !INSTAGRAM_HOSTS.has(url.hostname)) return null
  const [first, second] = url.pathname.split('/').filter(Boolean)
  // ig.me/m/<name> is a direct-message link
  const name = first === 'm' ? second : first
  return name && /^[\w.]+$/.test(name) ? name : null
}

/**
 * Link for the primary call to action: Telegram when it is set up,
 * otherwise Instagram Direct for the same account.
 */
export function resolvePrimaryContact(contacts: { telegramUrl: string; instagramUrl: string }): {
  channel: ContactChannel
  href: string
} {
  if (isTelegramUrl(contacts.telegramUrl)) {
    return { channel: 'telegram', href: contacts.telegramUrl }
  }
  const username = getInstagramUsername(contacts.instagramUrl)
  return {
    channel: 'instagram',
    href: username ? `https://ig.me/m/${username}` : contacts.instagramUrl,
  }
}
