<script setup lang="ts">
import { FormField, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { ErrorLookup } from '../../model/types'

type TitledListSection = { title: string; items: { title: string; text: string }[] }

const {
  path,
  heading,
  description,
  max,
  errorFor,
} = defineProps<{
  /** Content key used for error lookup, e.g. "problems". */
  path: string
  heading: string
  description?: string
  max: number
  errorFor: ErrorLookup
}>()

const section = defineModel<TitledListSection>({ required: true })
</script>

<template>
  <EditorGroup :title="heading" :description="description">
    <FormField v-model="section.title" label="Заголовок блока" :error="errorFor(`${path}.title`)" />
    <ListEditor
      v-model="section.items"
      :create-item="() => ({ title: '', text: '' })"
      :item-title="(item, index) => item.title || `Пункт ${index + 1}`"
      :max="max"
    >
      <template #default="{ item, index }">
        <FormField v-model="item.title" label="Заголовок" :error="errorFor(`${path}.items.${index}.title`)" />
        <FormField v-model="item.text" label="Текст" multiline :error="errorFor(`${path}.items.${index}.text`)" />
      </template>
    </ListEditor>
  </EditorGroup>
</template>
