<script setup lang="ts">
import { FormField, ListEditor } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const pricing = defineModel<SiteContent['pricing']>({ required: true })

function createPlan(): SiteContent['pricing']['items'][number] {
  return { title: '', format: '', price: '', features: [], featured: false }
}
</script>

<template>
  <EditorGroup
    title="Форматы и цены"
    description="Если цена не указана, на сайте будет «Стоимость — по запросу» и кнопка «Узнать стоимость»."
  >
    <FormField v-model="pricing.title" label="Заголовок блока" :error="errorFor('pricing.title')" />
    <FormField v-model="pricing.subtitle" label="Подзаголовок" :error="errorFor('pricing.subtitle')" />
    <ListEditor
      v-model="pricing.items"
      :create-item="createPlan"
      :item-title="(item, index) => item.title || `Формат ${index + 1}`"
      :max="6"
      add-label="Добавить формат"
    >
      <template #default="{ item, index }">
        <FormField v-model="item.title" label="Название" :error="errorFor(`pricing.items.${index}.title`)" />
        <FormField
          v-model="item.format"
          label="Формат проведения"
          placeholder="Онлайн или в зале"
          :error="errorFor(`pricing.items.${index}.format`)"
        />
        <FormField
          v-model="item.price"
          label="Цена"
          placeholder="Например: 3 000 ₽ / занятие"
          :error="errorFor(`pricing.items.${index}.price`)"
        />
        <label class="pricing-form__checkbox">
          <input v-model="item.featured" type="checkbox" />
          Выделить карточку
        </label>
        <ListEditor
          v-model="item.features"
          :create-item="() => ''"
          :item-title="(_, featureIndex) => `Пункт ${featureIndex + 1}`"
          :max="8"
          add-label="Добавить пункт"
        >
          <template #default="{ index: featureIndex }">
            <FormField
              v-model="item.features[featureIndex]!"
              label="Что входит"
              :error="errorFor(`pricing.items.${index}.features.${featureIndex}`)"
            />
          </template>
        </ListEditor>
      </template>
    </ListEditor>
  </EditorGroup>
</template>

<style lang="sass" scoped>
@use './PricingForm'
</style>
