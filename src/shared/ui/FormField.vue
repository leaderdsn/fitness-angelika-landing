<script setup lang="ts">
import { useId } from 'vue'

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
    <input
      v-else
      :id="id"
      v-model="value"
      class="form-field__control"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="hint || error ? `${id}-note` : undefined"
    />
    <p v-if="error || hint" :id="`${id}-note`" class="form-field__note">{{ error || hint }}</p>
  </div>
</template>

<style lang="sass" scoped>
@use './FormField'
</style>
