<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import AppIcon from './AppIcon.vue'

const {
  label,
  hint,
  error,
  multiline = false,
  rows = 3,
  type = 'text',
  placeholder,
  maxlength,
} = defineProps<{
  label: string
  hint?: string
  error?: string
  multiline?: boolean
  rows?: number
  type?: 'text' | 'url' | 'password'
  placeholder?: string
  maxlength?: number
}>()

const value = defineModel<string>({ required: true })

const id = useId()

const isPassword = computed(() => type === 'password')
const passwordVisible = ref(false)
const inputType = computed(() => (isPassword.value && passwordVisible.value ? 'text' : type))
</script>

<template>
  <div :class="['form-field', { 'form-field--invalid': error }]">
    <label class="form-field__label" :for="id">{{ label }}</label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="value"
      class="form-field__control"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="hint || error ? `${id}-note` : undefined"
    />
    <div v-else :class="['form-field__input', { 'form-field__input--password': isPassword }]">
      <input
        :id="id"
        v-model="value"
        class="form-field__control"
        :type="inputType"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="hint || error ? `${id}-note` : undefined"
      />
      <button
        v-if="isPassword"
        type="button"
        class="form-field__toggle"
        :aria-label="passwordVisible ? 'Скрыть пароль' : 'Показать пароль'"
        :aria-pressed="passwordVisible"
        :aria-controls="id"
        @click="passwordVisible = !passwordVisible"
      >
        <AppIcon :name="passwordVisible ? 'eye-off' : 'eye'" :size="18" />
      </button>
    </div>
    <p v-if="error || hint" :id="`${id}-note`" class="form-field__note">{{ error || hint }}</p>
  </div>
</template>

<style lang="sass" scoped>
@use './FormField'
</style>
