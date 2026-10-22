import { computed, ref } from 'vue'

import { fetchSiteContent, siteContentSchema } from '@/entities/site-content'
import { getErrorMessage } from '@/shared/lib'

import { issuesToErrors } from '../lib/issuesToErrors'

import type { SiteContent } from '@/entities/site-content'

type ValidationIssue = { path: PropertyKey[]; message: string }

export function useContentEditor() {
  const draft = ref<SiteContent | null>(null)
  const savedSnapshot = ref('')
  const loading = ref(false)
  const saving = ref(false)
  const loadError = ref('')
  const saveError = ref('')
  const savedAt = ref<Date | null>(null)
  const errors = ref<Record<string, string>>({})

  const isDirty = computed(() => draft.value !== null && JSON.stringify(draft.value) !== savedSnapshot.value)

  function applySaved(content: SiteContent): void {
    savedSnapshot.value = JSON.stringify(content)
    draft.value = JSON.parse(savedSnapshot.value) as SiteContent
  }

  async function load(): Promise<void> {
    loading.value = true
    loadError.value = ''
    try {
      applySaved(await fetchSiteContent())
    } catch (error) {
      loadError.value = getErrorMessage(error, 'Не удалось загрузить контент')
    } finally {
      loading.value = false
    }
  }

  async function save(): Promise<boolean> {
    if (!draft.value) return false
    saveError.value = ''

    const parsed = siteContentSchema.safeParse(draft.value)
    if (!parsed.success) {
      errors.value = issuesToErrors(parsed.error.issues)
      saveError.value = 'Проверьте поля, отмеченные красным'
      return false
    }

    errors.value = {}
    saving.value = true
    try {
      applySaved(await $fetch<SiteContent>('/api/admin/content', { method: 'PUT', body: parsed.data }))
      savedAt.value = new Date()
      return true
    } catch (error) {
      const issues = (error as { data?: { data?: ValidationIssue[] } }).data?.data
      if (Array.isArray(issues)) errors.value = issuesToErrors(issues)
      saveError.value = getErrorMessage(error, 'Не удалось сохранить')
      return false
    } finally {
      saving.value = false
    }
  }

  function discard(): void {
    if (savedSnapshot.value) draft.value = JSON.parse(savedSnapshot.value) as SiteContent
    errors.value = {}
    saveError.value = ''
  }

  function errorFor(path: string): string | undefined {
    return errors.value[path]
  }

  return { draft, loading, saving, loadError, saveError, savedAt, errors, isDirty, load, save, discard, errorFor }
}

export type ContentEditor = ReturnType<typeof useContentEditor>
