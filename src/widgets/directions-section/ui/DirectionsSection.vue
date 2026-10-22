<script setup lang="ts">
import { DirectionGlyph } from '@/entities/site-content'
import { vReveal } from '@/shared/lib'
import { PageSection, SectionHeading } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { directions } = defineProps<{ directions: SiteContent['directions'] }>()
</script>

<template>
  <PageSection id="directions" labelledby="directions-title" tone="sand">
    <SectionHeading
      title-id="directions-title"
      eyebrow="Направления"
      :title="directions.title"
      :subtitle="directions.subtitle"
    />
    <ul class="directions" role="list">
      <li v-for="item in directions.items" :key="item.title" v-reveal class="directions__card">
        <span class="directions__icon"><DirectionGlyph :icon="item.icon" /></span>
        <h3 class="directions__title">{{ item.title }}</h3>
        <p v-if="item.text" class="directions__text">{{ item.text }}</p>
      </li>
    </ul>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './DirectionsSection'
</style>
