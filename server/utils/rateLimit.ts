type Bucket = { count: number; resetAt: number }

export type RateLimiter = {
  /** Registers an attempt; returns false when the limit for this key is exhausted. */
  hit: (key: string, now?: number) => boolean
  reset: (key: string) => void
}

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const buckets = new Map<string, Bucket>()

  return {
    hit(key, now = Date.now()) {
      const bucket = buckets.get(key)
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs })
        return true
      }
      bucket.count += 1
      return bucket.count <= limit
    },
    reset(key) {
      buckets.delete(key)
    },
  }
}
