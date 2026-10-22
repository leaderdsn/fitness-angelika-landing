<script setup lang="ts">
import { FormField, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const faq = defineModel<SiteContent['faq']>({ required: true })
</script>

<template>
  <EditorGroup title="Частые вопросы">
    <FormField v-model="faq.title" label="Заголовок блока" :error="errorFor('faq.title')" />
    <ListEditor
      v-model="faq.items"
      :create-item="() => ({ question: '', answer: '' })"
      :item-title="(item, index) => item.question || `Вопрос ${index + 1}`"
      :max="12"
      add-label="Добавить вопрос"
    >
      <template #default="{ item, index }">
        <FormField v-model="item.question" label="Вопрос" :error="errorFor(`faq.items.${index}.question`)" />
        <FormField
          v-model="item.answer"
          label="Ответ"
          multiline
          :rows="4"
          :error="errorFor(`faq.items.${index}.answer`)"
        />
      </template>
    </ListEditor>
  </EditorGroup>
</template>
