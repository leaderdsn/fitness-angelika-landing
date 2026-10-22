<script setup lang="ts">
import { FormField } from '@/shared/ui'

import EditorGroup from '../EditorGroup.vue'

import type { SiteContent } from '@/entities/site-content'
import type { ErrorLookup } from '../../model/types'

const { errorFor } = defineProps<{ errorFor: ErrorLookup }>()

const contacts = defineModel<SiteContent['contacts']>('contacts', { required: true })
const seo = defineModel<SiteContent['seo']>('seo', { required: true })
const finalCta = defineModel<SiteContent['finalCta']>('finalCta', { required: true })
</script>

<template>
  <EditorGroup
    title="Контакты"
    description="Куда ведут кнопки на сайте. Если Telegram не указан, основная кнопка откроет личные сообщения в Instagram."
  >
    <FormField
      v-model="contacts.telegramUrl"
      label="Ссылка на Telegram"
      type="url"
      placeholder="https://t.me/username"
      :error="errorFor('contacts.telegramUrl')"
    />
    <FormField
      v-model="contacts.instagramUrl"
      label="Ссылка на Instagram"
      type="url"
      placeholder="https://www.instagram.com/username/"
      :error="errorFor('contacts.instagramUrl')"
    />
    <FormField
      v-model="contacts.ctaLabel"
      label="Текст основной кнопки"
      :maxlength="40"
      :error="errorFor('contacts.ctaLabel')"
    />
  </EditorGroup>

  <EditorGroup title="Финальный призыв" description="Последний блок перед подвалом.">
    <FormField v-model="finalCta.title" label="Заголовок" :error="errorFor('finalCta.title')" />
    <FormField v-model="finalCta.text" label="Текст" multiline :error="errorFor('finalCta.text')" />
  </EditorGroup>

  <EditorGroup title="SEO" description="Как сайт выглядит в поиске и в превью ссылок в мессенджерах.">
    <FormField v-model="seo.title" label="Заголовок страницы" :maxlength="80" :error="errorFor('seo.title')" />
    <FormField
      v-model="seo.description"
      label="Описание"
      multiline
      :maxlength="200"
      :error="errorFor('seo.description')"
    />
  </EditorGroup>
</template>
