<script setup lang="ts">
const { markup, size = 24, label } = defineProps<{
  /** Trusted inner SVG markup from a static icon map. */
  markup: string
  size?: number
  label?: string
}>()
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- markup comes only from static icon maps in the code -->
  <svg
    class="base-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="markup"
  />
</template>

<style lang="sass" scoped>
@use './BaseIcon'
</style>
