<script setup lang="ts">
import { computed } from 'vue'
import { useHead, useRuntimeConfig, useSeoMeta } from '#app'

import { DEFAULT_CONTENT, useSiteContent } from '@/entities/site-content'
import { AboutSection } from '@/widgets/about-section'
import { DirectionsSection } from '@/widgets/directions-section'
import { FaqSection } from '@/widgets/faq-section'
import { FinalCtaSection } from '@/widgets/final-cta-section'
import { HeroSection } from '@/widgets/hero-section'
import { MobileCtaBar } from '@/widgets/mobile-cta-bar'
import { PricingSection } from '@/widgets/pricing-section'
import { ProblemsSection } from '@/widgets/problems-section'
import { ReviewsSection } from '@/widgets/reviews-section'
import { SiteFooter } from '@/widgets/site-footer'
import { SiteHeader } from '@/widgets/site-header'
import { StepsSection } from '@/widgets/steps-section'

import { buildPersonJsonLd, toAbsoluteUrl } from '../lib/seo'

const { data } = await useSiteContent()
const { siteUrl } = useRuntimeConfig().public

// The API always answers with content; defaults keep the page alive if the request itself fails.
const content = computed(() => data.value ?? DEFAULT_CONTENT)
const ogImage = computed(() => {
  const photo = content.value.hero.photo || content.value.about.photo
  return photo ? toAbsoluteUrl(photo, siteUrl) : undefined
})

useSeoMeta({
  title: () => content.value.seo.title,
  description: () => content.value.seo.description,
  ogTitle: () => content.value.seo.title,
  ogDescription: () => content.value.seo.description,
  ogType: 'website',
  ogLocale: 'ru_RU',
  ogUrl: siteUrl,
  ogImage,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => buildPersonJsonLd(content.value, siteUrl),
    },
  ],
})
</script>

<template>
  <div class="landing-page">
    <SiteHeader :contacts="content.contacts" />
    <main>
      <HeroSection :hero="content.hero" :contacts="content.contacts" />
      <ProblemsSection v-if="content.problems.items.length" :problems="content.problems" />
      <DirectionsSection v-if="content.directions.items.length" :directions="content.directions" />
      <StepsSection v-if="content.steps.items.length" :steps="content.steps" />
      <PricingSection v-if="content.pricing.items.length" :pricing="content.pricing" :contacts="content.contacts" />
      <AboutSection :about="content.about" />
      <ReviewsSection :reviews="content.reviews" :instagram-url="content.contacts.instagramUrl" />
      <FaqSection v-if="content.faq.items.length" :faq="content.faq" />
      <FinalCtaSection :final-cta="content.finalCta" :contacts="content.contacts" />
    </main>
    <SiteFooter :contacts="content.contacts" />
    <MobileCtaBar :contacts="content.contacts" />
  </div>
</template>
