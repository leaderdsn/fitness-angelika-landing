<script setup lang="ts">
import { ContactButtons } from '@/features/contact-link'
import { PageSection } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { finalCta, contacts } = defineProps<{
  finalCta: SiteContent['finalCta']
  contacts: SiteContent['contacts']
}>()
</script>

<template>
  <PageSection id="contact" labelledby="final-cta-title" tone="accent">
    <div class="final-cta">
      <div class="final-cta__circle final-cta__circle--one" aria-hidden="true" />
      <div class="final-cta__circle final-cta__circle--two" aria-hidden="true" />
      <h2 id="final-cta-title" class="final-cta__title">{{ finalCta.title }}</h2>
      <p v-if="finalCta.text" class="final-cta__text">{{ finalCta.text }}</p>
      <ContactButtons :contacts="contacts" inverted class="final-cta__actions" />
    </div>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './FinalCtaSection'
</style>
