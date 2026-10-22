import { describe, expect, it } from 'vitest'

import { hashPassword, isPasswordHashValid, isPasswordValid } from './password'

describe('isPasswordValid', () => {
  it('accepts only the exact password', () => {
    expect(isPasswordValid('s3cret', 's3cret')).toBe(true)
    expect(isPasswordValid('s3cret ', 's3cret')).toBe(false)
    expect(isPasswordValid('S3cret', 's3cret')).toBe(false)
  })

  it('rejects everything when no password is configured', () => {
    expect(isPasswordValid('', '')).toBe(false)
    expect(isPasswordValid('anything', '')).toBe(false)
  })
})

describe('hashPassword / isPasswordHashValid', () => {
  it('verifies only the hashed password', () => {
    const hash = hashPassword('new-s3cret')
    expect(hash).not.toContain('new-s3cret')
    expect(isPasswordHashValid('new-s3cret', hash)).toBe(true)
    expect(isPasswordHashValid('new-s3cret ', hash)).toBe(false)
  })

  it('salts every hash', () => {
    expect(hashPassword('same')).not.toBe(hashPassword('same'))
  })

  it('rejects malformed hashes', () => {
    expect(isPasswordHashValid('x', '')).toBe(false)
    expect(isPasswordHashValid('x', 'plain$aa$bb')).toBe(false)
    expect(isPasswordHashValid('x', 'scrypt$aa$bb')).toBe(false)
  })
})
