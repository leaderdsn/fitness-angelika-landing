type FetchErrorLike = { statusMessage?: unknown; data?: { statusMessage?: unknown; message?: unknown } }

/** Human-readable message from a $fetch error or anything else thrown. */
export function getErrorMessage(error: unknown, fallback = 'Что-то пошло не так'): string {
  if (typeof error === 'object' && error !== null) {
    const { statusMessage, data } = error as FetchErrorLike
    for (const candidate of [data?.statusMessage, statusMessage, data?.message]) {
      if (typeof candidate === 'string' && candidate) return candidate
    }
  }
  return fallback
}
