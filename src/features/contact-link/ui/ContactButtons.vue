<script setup lang="ts">
import { computed } from 'vue'

import { resolvePrimaryContact } from '#shared/links'

import ContactButton from './ContactButton.vue'

import type { SiteContent } from '#shared/content'

const {
  contacts,
  size = 'lg',
  inverted = false,
} = defineProps<{
  contacts: SiteContent['contacts']
  size?: 'md' | 'lg'
  /** Light buttons for dark backgrounds. */
  inverted?: boolean
}>()

const primary = computed(() => resolvePrimaryContact(contacts))
const primaryLabel = computed(() =>
  primary.value.channel === 'telegram' ? contacts.ctaLabel : 'Написать в Instagram',
)
</script>

<template>
  <div class="contact-buttons">
    <ContactButton
      :channel="primary.channel"
      :href="primary.href"
      :variant="inverted ? 'light' : 'primary'"
      :size="size"
    >
      {{ primaryLabel }}
    </ContactButton>
    <ContactButton
      v-if="primary.channel === 'telegram'"
      channel="instagram"
      :href="contacts.instagramUrl"
      :variant="inverted ? 'light' : 'secondary'"
      :size="size"
    >
      Instagram
    </ContactButton>
  </div>
</template>

<style lang="sass" scoped>
@use './ContactButtons'
</style>
