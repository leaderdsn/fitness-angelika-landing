<script setup lang="ts">
import { computed, ref } from 'vue'

import { getErrorMessage } from '@/shared/lib'
import { AppButton, FormField } from '@/shared/ui'

import { resetPassword } from '../api/adminAuthApi'

const { token } = defineProps<{ token: string }>()

const emit = defineEmits<{ success: [] }>()

const MIN_LENGTH = 8

const password = ref('')
const confirmation = ref('')
const pending = ref(false)
const error = ref('')

const passwordError = computed(() =>
  password.value && password.value.length < MIN_LENGTH ? `Не короче ${MIN_LENGTH} символов` : '',
)
const confirmationError = computed(() =>
  confirmation.value && confirmation.value !== password.value ? 'Пароли не совпадают' : '',
)
const canSubmit = computed(
  () => password.value.length >= MIN_LENGTH && confirmation.value === password.value && !pending.value,
)

async function submit(): Promise<void> {
  if (!canSubmit.value) return
  pending.value = true
  error.value = ''
  try {
    await resetPassword(token, password.value)
    emit('success')
  } catch (cause) {
    error.value = getErrorMessage(cause, 'Не удалось сменить пароль')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <FormField
      v-model="password"
      label="Новый пароль"
      type="password"
      :hint="`Не короче ${MIN_LENGTH} символов`"
      :error="passwordError"
    />
    <FormField v-model="confirmation" label="Повторите пароль" type="password" :error="confirmationError" />
    <p v-if="error" class="login-form__error" role="alert">{{ error }}</p>
    <AppButton type="submit" block :disabled="!canSubmit">
      {{ pending ? 'Сохраняем…' : 'Сохранить и войти' }}
    </AppButton>
  </form>
</template>

<style lang="sass" scoped>
@use './LoginForm'
</style>
