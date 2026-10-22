<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { ContactButton } from '@/features/contact-link'

import { resolvePrimaryContact } from '#shared/links'

import { NAV_LINKS } from '../config/navLinks'

import type { SiteContent } from '@/entities/site-content'

const { contacts } = defineProps<{ contacts: SiteContent['contacts'] }>()

const scrolled = ref(false)

const primary = computed(() => resolvePrimaryContact(contacts))

function onScroll(): void {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header :class="['site-header', { 'site-header--scrolled': scrolled }]">
    <div class="site-header__inner">
      <a href="#top" class="site-header__brand" aria-label="Анжелика Александрова — в начало страницы">
        <span class="site-header__name">Анжелика Александрова</span>
        <span class="site-header__role">фитнес-терапевт · хореограф</span>
      </a>
      <nav class="site-header__nav" aria-label="Разделы">
        <a v-for="link in NAV_LINKS" :key="link.href" :href="link.href" class="site-header__link">{{ link.label }}</a>
      </nav>
      <ContactButton :channel="primary.channel" :href="primary.href" size="sm">
        <span class="site-header__cta-label">Записаться</span>
      </ContactButton>
    </div>
  </header>
</template>

<style lang="sass" scoped>
@use './SiteHeader'
</style>
