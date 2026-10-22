<script setup lang="ts">
import { AppIcon, PageSection, SectionHeading } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { faq } = defineProps<{ faq: SiteContent['faq'] }>()
</script>

<template>
  <PageSection id="faq" labelledby="faq-title" tone="sand">
    <div class="faq">
      <SectionHeading title-id="faq-title" eyebrow="Вопросы" :title="faq.title" />
      <div class="faq__list">
        <details v-for="item in faq.items" :key="item.question" class="faq__item">
          <summary class="faq__question">
            {{ item.question }}
            <AppIcon name="plus" class="faq__toggle" />
          </summary>
          <p class="faq__answer">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './FaqSection'
</style>
