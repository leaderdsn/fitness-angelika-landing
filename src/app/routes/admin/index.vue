<script setup lang="ts">
import { AdminDashboardPage } from '@/pages/admin-dashboard'

definePageMeta({ middleware: 'admin-auth' })
</script>

<template>
  <AdminDashboardPage />
</template>
