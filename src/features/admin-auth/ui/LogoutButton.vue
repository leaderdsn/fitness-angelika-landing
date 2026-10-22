<script setup lang="ts">
import { navigateTo } from '#app'

import { AppButton, AppIcon } from '@/shared/ui'

import { logout } from '../api/adminAuthApi'

async function onLogout(): Promise<void> {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<template>
  <AppButton variant="ghost" size="sm" @click="onLogout">
    <AppIcon name="logout" :size="16" />
    Выйти
  </AppButton>
</template>
