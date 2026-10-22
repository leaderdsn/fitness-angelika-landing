import { describe, expect, it } from 'vitest'

import { isPasswordValid } from './password'

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
