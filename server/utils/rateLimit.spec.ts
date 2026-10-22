import { describe, expect, it } from 'vitest'

import { createRateLimiter } from './rateLimit'

describe('createRateLimiter', () => {
  it('blocks a key after the limit until the window passes', () => {
    const limiter = createRateLimiter(2, 1000)

    expect(limiter.hit('ip', 0)).toBe(true)
    expect(limiter.hit('ip', 10)).toBe(true)
    expect(limiter.hit('ip', 20)).toBe(false)
    expect(limiter.hit('other', 20)).toBe(true)
    expect(limiter.hit('ip', 1000)).toBe(true)
  })

  it('resets a key', () => {
    const limiter = createRateLimiter(1, 1000)
    limiter.hit('ip', 0)
    limiter.reset('ip')
    expect(limiter.hit('ip', 1)).toBe(true)
  })
})
