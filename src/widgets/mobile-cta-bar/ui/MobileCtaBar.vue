<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { ContactButton, trackClick } from '@/features/contact-link'
import { AppIcon } from '@/shared/ui'

import { resolvePrimaryContact } from '#shared/links'

import type { SiteContent } from '@/entities/site-content'

const { contacts } = defineProps<{ contacts: SiteContent['contacts'] }>()

/** The bar appears once the hero buttons have scrolled out of view. */
const SHOW_AFTER_PX = 560

const visible = ref(false)

const primary = computed(() => resolvePrimaryContact(contacts))

function onScroll(): void {
  visible.value = window.scrollY > SHOW_AFTER_PX
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div :class="['mobile-cta', { 'mobile-cta--visible': visible }]" :inert="visible ? undefined : true">
    <ContactButton :channel="primary.channel" :href="primary.href" block>
      {{ primary.channel === 'telegram' ? contacts.ctaLabel : 'Написать в Instagram' }}
    </ContactButton>
    <a
      v-if="primary.channel === 'telegram'"
      :href="contacts.instagramUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mobile-cta__instagram"
      aria-label="Instagram"
      @click="trackClick('instagram')"
    >
      <AppIcon name="instagram" :size="22" />
    </a>
  </div>
</template>

<style lang="sass" scoped>
@use './MobileCtaBar'
</style>
