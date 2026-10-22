import { describe, expect, it } from 'vitest'

import { tabHasErrors } from './tabErrors'

describe('tabHasErrors', () => {
  const tab = { id: 'contacts', label: 'Контакты', sections: ['contacts', 'seo'] } as const

  it('detects errors in any of the tab sections', () => {
    expect(tabHasErrors(tab, { 'seo.title': 'Заполните поле' })).toBe(true)
    expect(tabHasErrors(tab, { 'contacts.telegramUrl': 'Ошибка' })).toBe(true)
  })

  it('ignores errors of other sections with a similar prefix', () => {
    expect(tabHasErrors(tab, { 'hero.title': 'Ошибка', 'seoExtra.title': 'Ошибка' })).toBe(false)
  })
})
