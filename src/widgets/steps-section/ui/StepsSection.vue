<script setup lang="ts">
import { vReveal } from '@/shared/lib'
import { PageSection, SectionHeading } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { steps } = defineProps<{ steps: SiteContent['steps'] }>()
</script>

<template>
  <PageSection id="steps" labelledby="steps-title">
    <SectionHeading title-id="steps-title" eyebrow="Путь к результату" :title="steps.title" />
    <ol class="steps" role="list">
      <li v-for="(item, index) in steps.items" :key="item.title" v-reveal class="steps__item">
        <span class="steps__number" aria-hidden="true">{{ index + 1 }}</span>
        <div class="steps__body">
          <h3 class="steps__title">{{ item.title }}</h3>
          <p v-if="item.text" class="steps__text">{{ item.text }}</p>
        </div>
      </li>
    </ol>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './StepsSection'
</style>
