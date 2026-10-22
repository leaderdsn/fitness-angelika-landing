<script setup lang="ts">
import { computed } from 'vue'

const {
  href,
  variant = 'primary',
  size = 'md',
  block = false,
  external = false,
  type = 'button',
  disabled = false,
} = defineProps<{
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'light' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  external?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const classes = computed(() => [
  'app-button',
  `app-button--${variant}`,
  `app-button--${size}`,
  { 'app-button--block': block },
])
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="classes"
    @click="emit('click', $event)"
  >
    <slot />
  </a>
  <button v-else :type="type" :disabled="disabled" :class="classes" @click="emit('click', $event)">
    <slot />
  </button>
</template>

<style lang="sass" scoped>
@use './AppButton'
</style>
