import { siteContentSchema } from '#shared/content'
import { DEFAULT_CONTENT } from '#shared/defaultContent'

import type { SiteContent } from '#shared/content'

const CONTENT_KEY = 'content'

export async function readContent(): Promise<SiteContent> {
  const stored = await useStorage('data').getItem(CONTENT_KEY)
  if (stored === null) return DEFAULT_CONTENT

  const parsed = siteContentSchema.safeParse(stored)
  if (parsed.success) return parsed.data

  console.error('[content] stored content does not match the schema, serving defaults', parsed.error.issues)
  return DEFAULT_CONTENT
}

export async function writeContent(content: SiteContent): Promise<void> {
  await useStorage('data').setItem(CONTENT_KEY, content)
}
