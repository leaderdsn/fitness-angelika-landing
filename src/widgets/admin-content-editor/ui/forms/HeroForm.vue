<script setup lang="ts">
import { ImageUploadField } from '@/features/upload-image'
import { FormField, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const hero = defineModel<SiteContent['hero']>({ required: true })
</script>

<template>
  <EditorGroup title="Главный экран" description="Первое, что видит посетитель.">
    <FormField v-model="hero.badge" label="Плашка над заголовком" :error="errorFor('hero.badge')" />
    <FormField v-model="hero.title" label="Заголовок" multiline :rows="2" :error="errorFor('hero.title')" />
    <FormField v-model="hero.subtitle" label="Подзаголовок" multiline :error="errorFor('hero.subtitle')" />
    <ImageUploadField v-model="hero.photo" label="Фото" />
  </EditorGroup>

  <EditorGroup title="Обещания" description="Короткие пункты под заголовком, до 5 штук.">
    <FormField v-model="hero.promisesTitle" label="Заголовок списка" :error="errorFor('hero.promisesTitle')" />
    <ListEditor
      v-model="hero.promises"
      :create-item="() => ''"
      :item-title="(_, index) => `Пункт ${index + 1}`"
      :max="5"
      add-label="Добавить пункт"
    >
      <template #default="{ index }">
        <FormField
          v-model="hero.promises[index]!"
          label="Текст"
          :error="errorFor(`hero.promises.${index}`)"
        />
      </template>
    </ListEditor>
  </EditorGroup>
</template>
