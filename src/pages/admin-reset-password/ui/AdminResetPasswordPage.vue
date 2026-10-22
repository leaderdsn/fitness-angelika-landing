<script setup lang="ts">
import { computed } from 'vue'

import { navigateTo, useHead, useRoute } from '#app'

import { ResetPasswordForm } from '@/features/admin-auth'
import { AuthCard } from '@/shared/ui'

useHead({ title: 'Новый пароль', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
</script>

<template>
  <AuthCard eyebrow="Админка сайта" title="Новый пароль">
    <ResetPasswordForm v-if="token" :token="token" @success="navigateTo('/admin')" />
    <p v-else class="admin-reset-password-page__text">
      В ссылке нет кода восстановления. Запросите новую ссылку на странице входа.
    </p>
    <a href="/admin/login" class="admin-reset-password-page__link">← Ко входу</a>
  </AuthCard>
</template>

<style lang="sass" scoped>
@use './AdminResetPasswordPage'
</style>
