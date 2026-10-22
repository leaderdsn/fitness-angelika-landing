<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

import { getErrorMessage } from '@/shared/lib'
import { AppButton, AppIcon } from '@/shared/ui'

import { BACKUP_DOWNLOAD_URL, restoreBackup } from '../api/backupApi'

const emit = defineEmits<{ restored: [] }>()

const input = useTemplateRef<HTMLInputElement>('input')
const restoring = ref(false)
const error = ref('')

async function onChange(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (input.value) input.value.value = ''
  if (!file) return

  const confirmed = window.confirm(
    `Восстановить данные из «${file.name}»?\n\nТексты сайта и статистика будут заменены данными из файла.`,
  )
  if (!confirmed) return

  restoring.value = true
  error.value = ''
  try {
    await restoreBackup(file)
    emit('restored')
  } catch (cause) {
    error.value = getErrorMessage(cause, cause instanceof Error ? cause.message : 'Не удалось восстановить данные')
  } finally {
    restoring.value = false
  }
}
</script>

<template>
  <section class="backup-panel" aria-labelledby="backup-title">
    <h2 id="backup-title" class="backup-panel__title">Резервная копия</h2>
    <p class="backup-panel__text">
      Файл с текстами сайта и статистикой. Сохраняйте его перед крупными правками. Фото в копию не входят.
    </p>
    <div class="backup-panel__actions">
      <AppButton :href="BACKUP_DOWNLOAD_URL" variant="secondary" size="sm">
        <AppIcon name="download" :size="16" />
        Скачать копию
      </AppButton>
      <AppButton variant="ghost" size="sm" :disabled="restoring" @click="input?.click()">
        <AppIcon name="upload" :size="16" />
        {{ restoring ? 'Восстанавливаем…' : 'Восстановить из файла' }}
      </AppButton>
    </div>
    <p v-if="error" class="backup-panel__error" role="alert">{{ error }}</p>
    <input
      ref="input"
      class="backup-panel__input"
      type="file"
      accept="application/json,.json"
      tabindex="-1"
      aria-hidden="true"
      @change="onChange"
    />
  </section>
</template>

<style lang="sass" scoped>
@use './BackupPanel'
</style>
