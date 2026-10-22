<script setup lang="ts">
import { ref } from 'vue'

import { navigateTo, useHead } from '#app'

import { ForgotPasswordForm, LoginForm } from '@/features/admin-auth'
import { AuthCard } from '@/shared/ui'

useHead({ title: 'Вход в админку', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const forgotPassword = ref(false)
</script>

<template>
  <AuthCard eyebrow="Админка сайта" :title="forgotPassword ? 'Восстановление пароля' : 'Вход'">
    <ForgotPasswordForm v-if="forgotPassword" />
    <LoginForm v-else @success="navigateTo('/admin')" />
    <button type="button" class="admin-login-page__link" @click="forgotPassword = !forgotPassword">
      {{ forgotPassword ? '← Вернуться ко входу' : 'Забыли пароль?' }}
    </button>
    <a href="/" class="admin-login-page__link">← На сайт</a>
  </AuthCard>
</template>

<style lang="sass" scoped>
@use './AdminLoginPage'
</style>
