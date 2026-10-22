import { describe, expect, it } from 'vitest'

import { formatDay } from './formatDay'

describe('formatDay', () => {
  it('formats a date key as a short Russian date', () => {
    expect(formatDay('2026-10-22')).toMatch(/^22 окт/)
    expect(formatDay('2026-01-01')).toMatch(/^1 янв/)
  })
})
