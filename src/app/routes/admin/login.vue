<script setup lang="ts">
import { AdminLoginPage } from '@/pages/admin-login'

definePageMeta({ middleware: 'admin-auth' })
</script>

<template>
  <AdminLoginPage />
</template>
