<script setup lang="ts">
import { ContactButtons } from '@/features/contact-link'
import { AppIcon, PhotoFrame } from '@/shared/ui'

import type { SiteContent } from '@/entities/site-content'

const { hero, contacts } = defineProps<{
  hero: SiteContent['hero']
  contacts: SiteContent['contacts']
}>()
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero__inner">
      <div class="hero__content">
        <p v-if="hero.badge" class="hero__badge">{{ hero.badge }}</p>
        <h1 id="hero-title" class="hero__title">{{ hero.title }}</h1>
        <p v-if="hero.subtitle" class="hero__subtitle">{{ hero.subtitle }}</p>

        <div v-if="hero.promises.length" class="hero__promises">
          <p v-if="hero.promisesTitle" class="hero__promises-title">{{ hero.promisesTitle }}</p>
          <ul class="hero__promise-list" role="list">
            <li v-for="promise in hero.promises" :key="promise" class="hero__promise">
              <span class="hero__promise-mark"><AppIcon name="check" :size="16" /></span>
              {{ promise }}
            </li>
          </ul>
        </div>

        <ContactButtons :contacts="contacts" class="hero__actions" />
      </div>

      <div class="hero__visual">
        <div class="hero__halo" aria-hidden="true" />
        <PhotoFrame :src="hero.photo" alt="Анжелика Александрова, фитнес-терапевт" eager class="hero__photo" />
        <p class="hero__chip hero__chip--top" aria-hidden="true">Диастаз</p>
        <p class="hero__chip hero__chip--bottom" aria-hidden="true">Осанка</p>
      </div>
    </div>
  </section>
</template>

<style lang="sass" scoped>
@use './HeroSection'
</style>
