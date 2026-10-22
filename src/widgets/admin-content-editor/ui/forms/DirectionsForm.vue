<script setup lang="ts">
import { DIRECTION_ICON_OPTIONS } from '@/entities/site-content'
import { FormField, FormSelect, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const directions = defineModel<SiteContent['directions']>({ required: true })
</script>

<template>
  <EditorGroup title="Направления" description="Карточки с иконками: с чем вы работаете.">
    <FormField v-model="directions.title" label="Заголовок блока" :error="errorFor('directions.title')" />
    <FormField v-model="directions.subtitle" label="Подзаголовок" :error="errorFor('directions.subtitle')" />
    <ListEditor
      v-model="directions.items"
      :create-item="() => ({ icon: 'posture', title: '', text: '' })"
      :item-title="(item, index) => item.title || `Направление ${index + 1}`"
      :max="8"
      add-label="Добавить направление"
    >
      <template #default="{ item, index }">
        <FormSelect v-model="item.icon" label="Иконка" :options="DIRECTION_ICON_OPTIONS" />
        <FormField v-model="item.title" label="Название" :error="errorFor(`directions.items.${index}.title`)" />
        <FormField
          v-model="item.text"
          label="Описание"
          multiline
          :error="errorFor(`directions.items.${index}.text`)"
        />
      </template>
    </ListEditor>
  </EditorGroup>
</template>
