<script setup lang="ts">
import { AppButton, AppIcon } from '@/shared/ui'

import { trackClick } from '../model/trackClick'

import type { ContactChannel } from '#shared/links'

const {
  channel,
  href,
  variant = 'primary',
  size = 'md',
  block = false,
} = defineProps<{
  channel: ContactChannel
  href: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'light'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}>()
</script>

<template>
  <AppButton :href="href" external :variant="variant" :size="size" :block="block" @click="trackClick(channel)">
    <AppIcon :name="channel" :size="size === 'sm' ? 16 : 20" />
    <slot />
  </AppButton>
</template>
