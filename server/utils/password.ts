import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const digest = (value: string): Buffer => createHash('sha256').update(value).digest()

const SCRYPT_KEY_LENGTH = 64

/** Constant-time comparison; an empty expected password never matches. */
export function isPasswordValid(input: string, expected: string): boolean {
  if (!expected) return false
  return timingSafeEqual(digest(input), digest(expected))
}

/** Salted scrypt hash in the form `scrypt$<salt>$<hash>` (hex). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex')
  return `scrypt$${salt}$${hash}`
}

export function isPasswordHashValid(input: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split('$')
  if (scheme !== 'scrypt' || !salt || !hash) return false

  const expected = Buffer.from(hash, 'hex')
  const actual = scryptSync(input, salt, expected.length)
  return expected.length === SCRYPT_KEY_LENGTH && timingSafeEqual(actual, expected)
}
