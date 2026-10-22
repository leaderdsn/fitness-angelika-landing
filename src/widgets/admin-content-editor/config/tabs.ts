import type { SiteContent } from '@/entities/site-content'

export type EditorTab = {
  id: string
  label: string
  /** Top-level content keys edited on the tab; used to flag tabs with validation errors. */
  sections: readonly (keyof SiteContent)[]
}

export const EDITOR_TABS = [
  { id: 'contacts', label: 'Контакты и SEO', sections: ['contacts', 'seo', 'finalCta'] },
  { id: 'hero', label: 'Главный экран', sections: ['hero'] },
  { id: 'problems', label: 'Узнаёте себя', sections: ['problems'] },
  { id: 'directions', label: 'Направления', sections: ['directions'] },
  { id: 'steps', label: 'Как проходит', sections: ['steps'] },
  { id: 'pricing', label: 'Форматы и цены', sections: ['pricing'] },
  { id: 'about', label: 'Обо мне', sections: ['about'] },
  { id: 'reviews', label: 'Отзывы', sections: ['reviews'] },
  { id: 'faq', label: 'Вопросы', sections: ['faq'] },
] as const satisfies readonly EditorTab[]

export type EditorTabId = (typeof EDITOR_TABS)[number]['id']
