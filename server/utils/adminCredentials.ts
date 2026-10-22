import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

import { hashPassword, isPasswordHashValid, isPasswordValid } from './password'

import type { KeyValueStore } from './keyValueStore'

/** Password set through recovery; once present it replaces NUXT_ADMIN_PASSWORD. */
type StoredPassword = { hash: string; changedAt: number }
type StoredResetToken = { tokenHash: string; expiresAt: number }

const PASSWORD_KEY = 'admin-password'
const RESET_TOKEN_KEY = 'admin-password-reset'

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000

const sha256 = (value: string): Buffer => createHash('sha256').update(value).digest()

export function getStoredPassword(store: KeyValueStore): Promise<StoredPassword | null> {
  return store.getItem<StoredPassword>(PASSWORD_KEY)
}

/** Sessions remember this stamp, so changing the password signs out every other session. */
export async function getPasswordStamp(store: KeyValueStore): Promise<number> {
  return (await getStoredPassword(store))?.changedAt ?? 0
}

export async function checkAdminPassword(store: KeyValueStore, input: string, envPassword: string): Promise<boolean> {
  const stored = await getStoredPassword(store)
  return stored ? isPasswordHashValid(input, stored.hash) : isPasswordValid(input, envPassword)
}

/** Saves a new password and returns its stamp. */
export async function setAdminPassword(store: KeyValueStore, password: string, now = Date.now()): Promise<number> {
  await store.setItem(PASSWORD_KEY, { hash: hashPassword(password), changedAt: now } satisfies StoredPassword)
  return now
}

/** Issues a one-time token; a new token invalidates the previous one. Only its hash is stored. */
export async function createResetToken(store: KeyValueStore, now = Date.now()): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await store.setItem(RESET_TOKEN_KEY, {
    tokenHash: sha256(token).toString('hex'),
    expiresAt: now + RESET_TOKEN_TTL_MS,
  } satisfies StoredResetToken)
  return token
}

/** Returns true and burns the token when it matches and has not expired. */
export async function consumeResetToken(store: KeyValueStore, token: string, now = Date.now()): Promise<boolean> {
  const stored = await store.getItem<StoredResetToken>(RESET_TOKEN_KEY)
  if (!stored) return false

  const valid = stored.expiresAt > now && timingSafeEqual(sha256(token), Buffer.from(stored.tokenHash, 'hex'))
  if (valid || stored.expiresAt <= now) await store.removeItem(RESET_TOKEN_KEY)
  return valid
}
