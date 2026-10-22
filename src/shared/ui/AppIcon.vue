<script setup lang="ts">
import { computed } from 'vue'

import BaseIcon from './BaseIcon.vue'
import { ICONS } from './icons'

import type { IconName } from './icons'

const { name, size = 20, label } = defineProps<{ name: IconName; size?: number; label?: string }>()

const markup = computed(() => ICONS[name])
</script>

<template>
  <BaseIcon :markup="markup" :size="size" :label="label" />
</template>
