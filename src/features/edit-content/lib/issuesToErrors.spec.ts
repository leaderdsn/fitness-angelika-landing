import { describe, expect, it } from 'vitest'

import { issuesToErrors } from './issuesToErrors'

describe('issuesToErrors', () => {
  it('keys messages by dotted path and keeps the first message per field', () => {
    expect(
      issuesToErrors([
        { path: ['pricing', 'items', 0, 'title'], message: 'Заполните поле' },
        { path: ['pricing', 'items', 0, 'title'], message: 'Второе сообщение' },
        { path: ['contacts', 'telegramUrl'], message: 'Неверная ссылка' },
      ]),
    ).toEqual({
      'pricing.items.0.title': 'Заполните поле',
      'contacts.telegramUrl': 'Неверная ссылка',
    })
  })
})
