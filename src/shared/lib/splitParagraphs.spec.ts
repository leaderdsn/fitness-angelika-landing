import { describe, expect, it } from 'vitest'

import { splitParagraphs } from './splitParagraphs'

describe('splitParagraphs', () => {
  it('splits text by blank lines and trims paragraphs', () => {
    expect(splitParagraphs('  Первый абзац \n\n Второй\nс переносом \n \n\nТретий')).toEqual([
      'Первый абзац',
      'Второй\nс переносом',
      'Третий',
    ])
  })

  it('returns an empty list for blank text', () => {
    expect(splitParagraphs(' \n\n ')).toEqual([])
  })
})
