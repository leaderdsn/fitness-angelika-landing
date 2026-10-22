<script setup lang="ts">
import { vReveal } from '@/shared/lib'
import { PageSection, SectionHeading } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { problems } = defineProps<{ problems: SiteContent['problems'] }>()

const number = (index: number): string => String(index + 1).padStart(2, '0')
</script>

<template>
  <PageSection id="problems" labelledby="problems-title">
    <SectionHeading title-id="problems-title" eyebrow="Знакомо?" :title="problems.title" />
    <ul class="problems" role="list">
      <li v-for="(item, index) in problems.items" :key="item.title" v-reveal class="problems__card">
        <span class="problems__number" aria-hidden="true">{{ number(index) }}</span>
        <h3 class="problems__title">{{ item.title }}</h3>
        <p v-if="item.text" class="problems__text">{{ item.text }}</p>
      </li>
    </ul>
    <p class="problems__outro">Всё это можно исправить — мягко, без боли и изнурительных тренировок.</p>
  </PageSection>
</template>

<style lang="sass" scoped>
@use './ProblemsSection'
</style>
