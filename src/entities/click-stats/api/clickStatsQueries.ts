import { useFetch } from '#app'

import type { ClickStats } from '#shared/stats'

export function useClickStats() {
  return useFetch<ClickStats>('/api/admin/stats', { key: 'click-stats', server: false })
}
