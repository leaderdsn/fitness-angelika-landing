<script setup lang="ts">
import { AppButton } from '@/shared/ui'

const { statusCode = 404 } = defineProps<{ statusCode?: number }>()
</script>

<template>
  <main class="not-found-page">
    <p class="not-found-page__code">{{ statusCode }}</p>
    <h1 class="not-found-page__title">
      {{ statusCode === 404 ? 'Такой страницы нет' : 'Что-то пошло не так' }}
    </h1>
    <AppButton href="/">На главную</AppButton>
  </main>
</template>

<style lang="sass" scoped>
@use './NotFoundPage'
</style>
