import { createHash, timingSafeEqual } from 'node:crypto'

const digest = (value: string): Buffer => createHash('sha256').update(value).digest()

/** Constant-time comparison; an empty expected password never matches. */
export function isPasswordValid(input: string, expected: string): boolean {
  if (!expected) return false
  return timingSafeEqual(digest(input), digest(expected))
}
