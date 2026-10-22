<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

import { getErrorMessage } from '@/shared/lib'
import { AppButton, AppIcon } from '@/shared/ui'

const { label } = defineProps<{ label: string }>()

const src = defineModel<string>({ required: true })

const input = useTemplateRef<HTMLInputElement>('input')
const uploading = ref(false)
const error = ref('')

async function onChange(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''
  try {
    const body = new FormData()
    body.append('file', file)
    const result = await $fetch<{ src: string }>('/api/admin/upload', { method: 'POST', body })
    src.value = result.src
  } catch (cause) {
    error.value = getErrorMessage(cause, 'Не удалось загрузить фото')
  } finally {
    uploading.value = false
    if (input.value) input.value.value = ''
  }
}
</script>

<template>
  <div class="image-upload">
    <span class="image-upload__label">{{ label }}</span>
    <div class="image-upload__row">
      <div class="image-upload__preview">
        <img v-if="src" :src="src" alt="" />
        <span v-else>Нет фото</span>
      </div>
      <div class="image-upload__actions">
        <AppButton variant="secondary" size="sm" :disabled="uploading" @click="input?.click()">
          <AppIcon name="upload" :size="16" />
          {{ uploading ? 'Загрузка…' : src ? 'Заменить' : 'Загрузить' }}
        </AppButton>
        <AppButton v-if="src" variant="ghost" size="sm" @click="src = ''">Убрать</AppButton>
        <p class="image-upload__hint" :class="{ 'image-upload__hint--error': error }">
          {{ error || 'JPG, PNG или WebP до 5 МБ. Лучше вертикальное фото 4:5.' }}
        </p>
      </div>
    </div>
    <input
      ref="input"
      class="image-upload__input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      tabindex="-1"
      aria-hidden="true"
      @change="onChange"
    />
  </div>
</template>

<style lang="sass" scoped>
@use './ImageUploadField'
</style>
