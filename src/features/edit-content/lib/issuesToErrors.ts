type Issue = { path: readonly PropertyKey[]; message: string }

/** Flattens validation issues into a map keyed by dotted path: "pricing.items.0.title". */
export function issuesToErrors(issues: readonly Issue[]): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const { path, message } of issues) {
    const key = path.map(String).join('.')
    errors[key] ??= message
  }
  return errors
}
