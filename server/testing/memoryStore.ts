import type { KeyValueStore } from '../utils/keyValueStore'

/** In-memory KeyValueStore for unit tests. */
export function createMemoryStore(): KeyValueStore {
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
    getKeys: (base = '') => Promise.resolve([...items.keys()].filter((key) => key.startsWith(base))),
  }
}
