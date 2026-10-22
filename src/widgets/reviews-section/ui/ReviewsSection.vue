<script setup lang="ts">
import { ContactButton } from '@/features/contact-link'
import { vReveal } from '@/shared/lib'
import { AppIcon, PageSection, SectionHeading } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { reviews, instagramUrl } = defineProps<{
  reviews: SiteContent['reviews']
  instagramUrl: string
}>()
</script>

<template>
  <PageSection id="reviews" labelledby="reviews-title">
    <SectionHeading title-id="reviews-title" eyebrow="Результаты" :title="reviews.title" align="center" />

    <ul v-if="reviews.items.length" class="reviews" role="list">
      <li v-for="review in reviews.items" :key="review.author + review.text" v-reveal class="reviews__card">
        <figure class="reviews__figure">
          <AppIcon name="quote" :size="28" class="reviews__quote" />
          <blockquote class="reviews__text">{{ review.text }}</blockquote>
          <figcaption class="reviews__author">{{ review.author }}</figcaption>
        </figure>
      </li>
    </ul>

    <div v-if="reviews.items.length" class="reviews__more">
      <ContactButton channel="instagram" :href="instagramUrl" variant="secondary">
        Больше отзывов в Instagram
      </ContactButton>
    </div>

    <div v-else v-reveal class="reviews__empty">
      <AppIcon name="quote" :size="36" class="reviews__quote" />
      <p class="reviews__empty-text">
        Живые отзывы и истории учениц собраны в Instagram — в закреплённых историях «Отзывы».
      </p>
      <ContactButton channel="instagram" :href="instagramUrl" variant="secondary">
        Смотреть отзывы
      </ContactButton>
    </div>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './ReviewsSection'
</style>
