import { useFetch } from '#app'

import type { SiteContent } from '#shared/content'

export const SITE_CONTENT_KEY = 'site-content'

/** Public site content; rendered on the server and reused on hydration. */
export function useSiteContent() {
  return useFetch<SiteContent>('/api/content', { key: SITE_CONTENT_KEY })
}

export function fetchSiteContent(): Promise<SiteContent> {
  return $fetch<SiteContent>('/api/content')
}
