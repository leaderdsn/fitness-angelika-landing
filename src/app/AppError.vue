<script setup lang="ts">
import type { NuxtError } from '#app'

import { NotFoundPage } from '@/pages/not-found'

const { error } = defineProps<{ error: NuxtError }>()
</script>

<template>
  <NotFoundPage :status-code="error.statusCode" />
</template>
