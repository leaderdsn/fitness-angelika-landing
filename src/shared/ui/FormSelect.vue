<script setup lang="ts" generic="T extends string">
import { useId } from 'vue'

const { label, options } = defineProps<{
  label: string
  options: readonly { value: T; label: string }[]
}>()

const value = defineModel<T>({ required: true })

const id = useId()
</script>

<template>
  <div class="form-select">
    <label class="form-select__label" :for="id">{{ label }}</label>
    <select :id="id" v-model="value" class="form-select__control">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</template>

<style lang="sass" scoped>
@use './FormSelect'
</style>
