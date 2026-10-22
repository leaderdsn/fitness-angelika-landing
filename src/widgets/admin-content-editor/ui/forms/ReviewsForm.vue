<script setup lang="ts">
import { FormField, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const reviews = defineModel<SiteContent['reviews']>({ required: true })
</script>

<template>
  <EditorGroup
    title="Отзывы"
    description="Пока список пуст, на сайте показывается ссылка на отзывы в Instagram. Добавляйте только реальные отзывы с согласия учениц."
  >
    <FormField v-model="reviews.title" label="Заголовок блока" :error="errorFor('reviews.title')" />
    <ListEditor
      v-model="reviews.items"
      :create-item="() => ({ author: '', text: '' })"
      :item-title="(item, index) => item.author || `Отзыв ${index + 1}`"
      :max="12"
      add-label="Добавить отзыв"
    >
      <template #default="{ item, index }">
        <FormField
          v-model="item.author"
          label="Автор"
          placeholder="Имя, например: Мария"
          :error="errorFor(`reviews.items.${index}.author`)"
        />
        <FormField
          v-model="item.text"
          label="Текст отзыва"
          multiline
          :rows="4"
          :error="errorFor(`reviews.items.${index}.text`)"
        />
      </template>
    </ListEditor>
  </EditorGroup>
</template>
