import type { ContactChannel } from '#shared/links'

/** Fire-and-forget click tracking that survives the page being left for the messenger. */
export function trackClick(channel: ContactChannel): void {
  const payload = JSON.stringify({ channel })
  try {
    if (navigator.sendBeacon?.('/api/track', payload)) return
  } catch {
    // Falls through to fetch below.
  }
  void fetch('/api/track', { method: 'POST', body: payload, keepalive: true }).catch(() => undefined)
}
