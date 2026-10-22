/** The subset of unstorage used by the domain helpers; lets tests pass an in-memory map. */
export type KeyValueStore = {
  getItem: <T>(key: string) => Promise<T | null>
  setItem: (key: string, value: unknown) => Promise<void>
}
