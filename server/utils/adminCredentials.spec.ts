import { describe, expect, it } from 'vitest'

import {
  RESET_TOKEN_TTL_MS,
  checkAdminPassword,
  consumeResetToken,
  createResetToken,
  getPasswordStamp,
  setAdminPassword,
} from './adminCredentials'

import type { KeyValueStore } from './keyValueStore'

function createMemoryStore(): KeyValueStore {
  const items = new Map<string, unknown>()
  return {
    getItem: <T>(key: string) => Promise.resolve((items.get(key) as T | undefined) ?? null),
    setItem: (key, value) => {
      items.set(key, value)
      return Promise.resolve()
    },
    removeItem: (key) => {
      items.delete(key)
      return Promise.resolve()
    },
  }
}

describe('admin password', () => {
  it('falls back to the env password until a new one is set', async () => {
    const store = createMemoryStore()
    expect(await checkAdminPassword(store, 'env-pass', 'env-pass')).toBe(true)
    expect(await getPasswordStamp(store)).toBe(0)

    await setAdminPassword(store, 'new-password', 1000)

    expect(await checkAdminPassword(store, 'new-password', 'env-pass')).toBe(true)
    expect(await checkAdminPassword(store, 'env-pass', 'env-pass')).toBe(false)
    expect(await getPasswordStamp(store)).toBe(1000)
  })
})

describe('reset token', () => {
  it('works once', async () => {
    const store = createMemoryStore()
    const token = await createResetToken(store, 0)

    expect(await consumeResetToken(store, 'f'.repeat(64), 1)).toBe(false)
    expect(await consumeResetToken(store, token, 1)).toBe(true)
    expect(await consumeResetToken(store, token, 2)).toBe(false)
  })

  it('expires', async () => {
    const store = createMemoryStore()
    const token = await createResetToken(store, 0)
    expect(await consumeResetToken(store, token, RESET_TOKEN_TTL_MS)).toBe(false)
  })

  it('is replaced by a newer token', async () => {
    const store = createMemoryStore()
    const first = await createResetToken(store, 0)
    const second = await createResetToken(store, 1)

    expect(await consumeResetToken(store, first, 2)).toBe(false)
    expect(await consumeResetToken(store, second, 2)).toBe(true)
  })
})
