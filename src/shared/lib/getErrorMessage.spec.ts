import { describe, expect, it } from 'vitest'

import { getErrorMessage } from './getErrorMessage'

describe('getErrorMessage', () => {
  it('prefers the server status message', () => {
    expect(getErrorMessage({ statusMessage: 'Unauthorized', data: { statusMessage: 'Неверный пароль' } })).toBe(
      'Неверный пароль',
    )
    expect(getErrorMessage({ statusMessage: 'Слишком много попыток' })).toBe('Слишком много попыток')
  })

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(new Error(''), 'Ошибка')).toBe('Ошибка')
    expect(getErrorMessage(null)).toBe('Что-то пошло не так')
  })
})
