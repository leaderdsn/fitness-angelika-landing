<script setup lang="ts">
const {
  src,
  alt,
  monogram = 'А',
  shape = 'arch',
  eager = false,
} = defineProps<{
  src: string
  alt: string
  monogram?: string
  shape?: 'arch' | 'rounded'
  eager?: boolean
}>()
</script>

<template>
  <figure :class="['photo-frame', `photo-frame--${shape}`]">
    <img
      v-if="src"
      class="photo-frame__image"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
    />
    <div v-else class="photo-frame__placeholder" role="img" :aria-label="alt">
      <svg class="photo-frame__lines" viewBox="0 0 200 260" fill="none" aria-hidden="true">
        <path d="M30 230C60 150 70 90 100 40c30 50 40 110 70 190" />
        <path d="M55 230c20-55 28-95 45-130 17 35 25 75 45 130" />
        <circle cx="100" cy="28" r="10" />
      </svg>
      <span class="photo-frame__monogram" aria-hidden="true">{{ monogram }}</span>
    </div>
  </figure>
</template>

<style lang="sass" scoped>
@use './PhotoFrame'
</style>
