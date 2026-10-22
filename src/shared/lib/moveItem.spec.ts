import { describe, expect, it } from 'vitest'

import { moveItem } from './moveItem'

describe('moveItem', () => {
  it('moves an item up and down', () => {
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c'])
  })

  it('ignores out-of-range moves and never mutates the source', () => {
    const source = ['a', 'b']
    expect(moveItem(source, 1, 2)).toEqual(['a', 'b'])
    expect(moveItem(source, -1, 0)).toEqual(['a', 'b'])
    expect(source).toEqual(['a', 'b'])
  })
})
