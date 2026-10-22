import { describe, expect, it } from 'vitest'

import { detectImageType, mimeFromMediaId } from './imageType'

const bytes = (...values: number[]) => new Uint8Array(values)

describe('detectImageType', () => {
  it('recognises jpeg, png and webp by signature', () => {
    expect(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0))?.extension).toBe('jpg')
    expect(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))?.extension).toBe('png')
    expect(
      detectImageType(bytes(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50))?.extension,
    ).toBe('webp')
  })

  it('rejects other files', () => {
    expect(detectImageType(new TextEncoder().encode('<svg></svg>'))).toBeNull()
    expect(detectImageType(bytes(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x41, 0x56, 0x49, 0x20))).toBeNull()
  })
})

describe('mimeFromMediaId', () => {
  it('maps known extensions only', () => {
    expect(mimeFromMediaId('a.webp')).toBe('image/webp')
    expect(mimeFromMediaId('a.svg')).toBeNull()
  })
})
