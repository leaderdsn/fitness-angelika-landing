import type { DirectionIcon } from '#shared/content'

// Shapes are drawn on a 24×24 grid to match shared/ui icons.
export const DIRECTION_ICON_MARKUP: Record<DirectionIcon, string> = {
  diastasis: '<path d="M9 3v18"/><path d="M15 3v18"/><path d="m4.5 9.5 2.5 2.5-2.5 2.5"/><path d="m19.5 9.5-2.5 2.5 2.5 2.5"/>',
  posture: '<circle cx="12" cy="4" r="2"/><path d="M12 7v14"/><path d="M8.5 10h7"/><path d="M9 14h6"/><path d="M9.5 18h5"/>',
  stretch: '<circle cx="12" cy="5" r="2"/><path d="M12 8v5"/><path d="m2.5 20 9.5-7 9.5 7"/><path d="m7.5 10.5 4.5-1.5 4.5 1.5"/>',
  dance: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  kids: '<circle cx="12" cy="6" r="3"/><path d="M8 21v-5l-3-3 3-2.5h8l3 2.5-3 3v5"/>',
  gym: '<path d="M6 6v12"/><path d="M18 6v12"/><path d="M3 9v6"/><path d="M21 9v6"/><path d="M6 12h12"/>',
}

export const DIRECTION_ICON_OPTIONS: readonly { value: DirectionIcon; label: string }[] = [
  { value: 'diastasis', label: 'Диастаз' },
  { value: 'posture', label: 'Осанка' },
  { value: 'stretch', label: 'Растяжка' },
  { value: 'dance', label: 'Танец' },
  { value: 'kids', label: 'Дети' },
  { value: 'gym', label: 'Зал' },
]
