<script setup lang="ts">
import { ref } from 'vue'

import { getErrorMessage } from '@/shared/lib'
import { AppButton } from '@/shared/ui'

import { requestPasswordReset } from '../api/adminAuthApi'

const pending = ref(false)
const sent = ref(false)
const error = ref('')

async function submit(): Promise<void> {
  if (pending.value) return
  pending.value = true
  error.value = ''
  try {
    await requestPasswordReset()
    sent.value = true
  } catch (cause) {
    error.value = getErrorMessage(cause, 'Не удалось отправить ссылку')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <p v-if="sent" class="login-form__text" role="status">
      Ссылка для смены пароля отправлена в Telegram. Она действует 30 минут.
    </p>
    <p v-else class="login-form__text">
      Мы отправим в Telegram администратора ссылку, по которой можно задать новый пароль.
    </p>
    <p v-if="error" class="login-form__error" role="alert">{{ error }}</p>
    <AppButton type="submit" :variant="sent ? 'secondary' : 'primary'" block :disabled="pending">
      {{ pending ? 'Отправляем…' : sent ? 'Отправить ещё раз' : 'Отправить ссылку' }}
    </AppButton>
  </form>
</template>

<style lang="sass" scoped>
@use './LoginForm'
</style>
