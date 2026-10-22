/** Returns a copy of the list with the item at `from` moved to `to`; out-of-range moves return the list unchanged. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) return [...list]
  const result = [...list]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item as T)
  return result
}
