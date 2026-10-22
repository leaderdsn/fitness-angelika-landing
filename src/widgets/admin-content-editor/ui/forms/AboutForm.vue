<script setup lang="ts">
import { ImageUploadField } from '@/features/upload-image'
import { FormField, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const about = defineModel<SiteContent['about']>({ required: true })
</script>

<template>
  <EditorGroup title="Обо мне">
    <FormField v-model="about.title" label="Заголовок (имя)" :error="errorFor('about.title')" />
    <FormField
      v-model="about.text"
      label="Текст"
      hint="Абзацы разделяйте пустой строкой."
      multiline
      :rows="8"
      :error="errorFor('about.text')"
    />
    <ImageUploadField v-model="about.photo" label="Фото" />
  </EditorGroup>

  <EditorGroup title="Факты" description="Короткие цифры или факты под текстом, до 4 штук.">
    <ListEditor
      v-model="about.facts"
      :create-item="() => ({ value: '', label: '' })"
      :item-title="(item, index) => item.value || `Факт ${index + 1}`"
      :max="4"
      add-label="Добавить факт"
    >
      <template #default="{ item, index }">
        <FormField
          v-model="item.value"
          label="Значение"
          placeholder="Например: 10 лет"
          :error="errorFor(`about.facts.${index}.value`)"
        />
        <FormField v-model="item.label" label="Подпись" :error="errorFor(`about.facts.${index}.label`)" />
      </template>
    </ListEditor>
  </EditorGroup>
</template>
