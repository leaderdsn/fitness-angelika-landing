<script setup lang="ts">
import { BaseIcon } from '@/shared/ui'

import { DIRECTION_ICON_MARKUP } from '../config/directionIcons'

import type { DirectionIcon } from '#shared/content'

const { icon, size = 28 } = defineProps<{ icon: DirectionIcon; size?: number }>()
</script>

<template>
  <BaseIcon :markup="DIRECTION_ICON_MARKUP[icon]" :size="size" />
</template>
