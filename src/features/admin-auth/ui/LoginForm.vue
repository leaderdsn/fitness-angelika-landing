<script setup lang="ts">
import { ref } from 'vue'

import { getErrorMessage } from '@/shared/lib'
import { AppButton, FormField } from '@/shared/ui'

import { login } from '../api/adminAuthApi'

const emit = defineEmits<{ success: [] }>()

const password = ref('')
const pending = ref(false)
const error = ref('')

async function submit(): Promise<void> {
  if (!password.value || pending.value) return
  pending.value = true
  error.value = ''
  try {
    await login(password.value)
    emit('success')
  } catch (cause) {
    error.value = getErrorMessage(cause, 'Не удалось войти')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <FormField v-model="password" label="Пароль" type="password" :error="error" />
    <AppButton type="submit" block :disabled="pending || !password">
      {{ pending ? 'Входим…' : 'Войти' }}
    </AppButton>
  </form>
</template>

<style lang="sass" scoped>
@use './LoginForm'
</style>
