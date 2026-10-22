import type { ObjectDirective } from 'vue'

const HIDDEN_CLASS = 'reveal--hidden'

const hidden = new Set<HTMLElement>()
let observer: IntersectionObserver | null = null

function show(el: HTMLElement): void {
  el.classList.remove(HIDDEN_CLASS)
  hidden.delete(el)
  observer?.unobserve(el)
}

/**
 * Fast scrolling and anchor jumps can skip an element without it ever intersecting,
 * so every element above the bottom edge of the viewport is shown together with the one that appeared.
 */
function onIntersect(entries: IntersectionObserverEntry[]): void {
  const visible = entries.filter((entry) => entry.isIntersecting)
  if (visible.length === 0) return
  for (const entry of visible) show(entry.target as HTMLElement)
  for (const el of hidden) {
    if (el.getBoundingClientRect().top < window.innerHeight) show(el)
  }
}

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(onIntersect, { rootMargin: '0px 0px -10% 0px' })
  return observer
}

/**
 * Fades an element in when it scrolls into view.
 * Elements already visible on mount (and all of them under reduced motion) are left untouched,
 * so server-rendered content never flashes.
 */
export const vReveal: ObjectDirective<HTMLElement> = {
  mounted(el) {
    el.classList.add('reveal')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.classList.add(HIDDEN_CLASS)
    hidden.add(el)
    getObserver().observe(el)
  },
  unmounted(el) {
    hidden.delete(el)
    observer?.unobserve(el)
  },
}
