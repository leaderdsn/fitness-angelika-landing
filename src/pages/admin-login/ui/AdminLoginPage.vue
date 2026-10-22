<script setup lang="ts">
import { navigateTo, useHead } from '#app'

import { LoginForm } from '@/features/admin-auth'

useHead({ title: 'Вход в админку', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>

<template>
  <main class="admin-login-page">
    <div class="admin-login-page__card">
      <p class="admin-login-page__eyebrow">Админка сайта</p>
      <h1 class="admin-login-page__title">Вход</h1>
      <LoginForm @success="navigateTo('/admin')" />
      <a href="/" class="admin-login-page__back">← На сайт</a>
    </div>
  </main>
</template>

<style lang="sass" scoped>
@use './AdminLoginPage'
</style>
