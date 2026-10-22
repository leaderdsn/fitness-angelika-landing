import { siteContentSchema } from '#shared/content'
import { DEFAULT_CONTENT } from '#shared/defaultContent'

import type { SiteContent } from '#shared/content'
import type { KeyValueStore } from './keyValueStore'

const CONTENT_KEY = 'content'

export async function readContent(store: KeyValueStore = useStorage('data')): Promise<SiteContent> {
  const stored = await store.getItem(CONTENT_KEY)
  if (stored === null) return DEFAULT_CONTENT

  const parsed = siteContentSchema.safeParse(stored)
  if (parsed.success) return parsed.data

  console.error('[content] stored content does not match the schema, serving defaults', parsed.error.issues)
  return DEFAULT_CONTENT
}

export async function writeContent(content: SiteContent, store: KeyValueStore = useStorage('data')): Promise<void> {
  await store.setItem(CONTENT_KEY, content)
}
