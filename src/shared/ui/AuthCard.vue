<script setup lang="ts">
const { eyebrow, title } = defineProps<{ eyebrow: string; title: string }>()
</script>

<template>
  <main class="auth-card">
    <div class="auth-card__card">
      <p class="auth-card__eyebrow">{{ eyebrow }}</p>
      <h1 class="auth-card__title">{{ title }}</h1>
      <slot />
    </div>
  </main>
</template>

<style lang="sass" scoped>
@use './AuthCard'
</style>
