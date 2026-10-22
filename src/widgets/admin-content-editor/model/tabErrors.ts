import type { EditorTab } from '../config/tabs'

/** Whether any validation error belongs to one of the tab's content sections. */
export function tabHasErrors(tab: EditorTab, errors: Record<string, string>): boolean {
  return Object.keys(errors).some((path) => tab.sections.some((section) => path === section || path.startsWith(`${section}.`)))
}
