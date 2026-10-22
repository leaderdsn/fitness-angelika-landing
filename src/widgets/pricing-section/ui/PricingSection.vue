<script setup lang="ts">
import { computed } from 'vue'

import { ContactButton } from '@/features/contact-link'
import { vReveal } from '@/shared/lib'
import { AppIcon, PageSection, SectionHeading } from '@/shared/ui'

import { resolvePrimaryContact } from '#shared/links'

import type { SiteContent } from '@/entities/site-content'

const { pricing, contacts } = defineProps<{
  pricing: SiteContent['pricing']
  contacts: SiteContent['contacts']
}>()

const primary = computed(() => resolvePrimaryContact(contacts))
</script>

<template>
  <PageSection id="pricing" labelledby="pricing-title">
    <SectionHeading
      title-id="pricing-title"
      eyebrow="Форматы"
      :title="pricing.title"
      :subtitle="pricing.subtitle"
      align="center"
    />
    <ul class="pricing" role="list">
      <li
        v-for="plan in pricing.items"
        :key="plan.title"
        v-reveal
        :class="['pricing__card', { 'pricing__card--featured': plan.featured }]"
      >
        <p v-if="plan.featured" class="pricing__flag">Чаще всего выбирают</p>
        <h3 class="pricing__title">{{ plan.title }}</h3>
        <p v-if="plan.format" class="pricing__format">{{ plan.format }}</p>
        <p class="pricing__price">{{ plan.price || 'Стоимость — по запросу' }}</p>
        <ul class="pricing__features" role="list">
          <li v-for="feature in plan.features" :key="feature" class="pricing__feature">
            <AppIcon name="check" :size="18" class="pricing__check" />
            {{ feature }}
          </li>
        </ul>
        <ContactButton
          :channel="primary.channel"
          :href="primary.href"
          :variant="plan.featured ? 'light' : 'primary'"
          block
          class="pricing__action"
        >
          {{ plan.price ? 'Записаться' : 'Узнать стоимость' }}
        </ContactButton>
      </li>
    </ul>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './PricingSection'
</style>
