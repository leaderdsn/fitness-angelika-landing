<script setup lang="ts">
const {
  title,
  titleId,
  eyebrow,
  subtitle,
  align = 'left',
} = defineProps<{
  title: string
  titleId?: string
  eyebrow?: string
  subtitle?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <header :class="['section-heading', `section-heading--${align}`]">
    <p v-if="eyebrow" class="section-heading__eyebrow">{{ eyebrow }}</p>
    <h2 :id="titleId" class="section-heading__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-heading__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style lang="sass" scoped>
@use './SectionHeading'
</style>
