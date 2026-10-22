<script setup lang="ts">
import { computed } from 'vue'

import { splitParagraphs, vReveal } from '@/shared/lib'
import { PageSection, PhotoFrame } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { about } = defineProps<{ about: SiteContent['about'] }>()

const paragraphs = computed(() => splitParagraphs(about.text))
</script>

<template>
  <PageSection id="about" labelledby="about-title" tone="sand">
    <div class="about">
      <PhotoFrame v-reveal :src="about.photo" :alt="about.title" shape="rounded" class="about__photo" />
      <div class="about__content">
        <p class="about__eyebrow">Обо мне</p>
        <h2 id="about-title" class="about__title">{{ about.title }}</h2>
        <div class="about__text">
          <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
        </div>
        <dl v-if="about.facts.length" class="about__facts">
          <div v-for="fact in about.facts" :key="fact.label" class="about__fact">
            <dt class="about__fact-value">{{ fact.value }}</dt>
            <dd class="about__fact-label">{{ fact.label }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './AboutSection'
</style>
