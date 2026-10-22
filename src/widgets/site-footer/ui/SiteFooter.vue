<script setup lang="ts">
import { AppIcon } from '@/shared/ui'

import { isTelegramUrl } from '#shared/links'

import type { SiteContent } from '@/entities/site-content'

const { contacts } = defineProps<{ contacts: SiteContent['contacts'] }>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <p class="site-footer__name">Анжелика Александрова</p>
        <p class="site-footer__role">Фитнес-терапевт и хореограф</p>
      </div>
      <ul class="site-footer__links" role="list">
        <li v-if="isTelegramUrl(contacts.telegramUrl)">
          <a :href="contacts.telegramUrl" target="_blank" rel="noopener noreferrer" class="site-footer__link">
            <AppIcon name="telegram" :size="18" /> Telegram
          </a>
        </li>
        <li>
          <a :href="contacts.instagramUrl" target="_blank" rel="noopener noreferrer" class="site-footer__link">
            <AppIcon name="instagram" :size="18" /> Instagram
          </a>
        </li>
      </ul>
      <p class="site-footer__note">
        Занятия не являются медицинской услугой. При хронических заболеваниях, после операций и в период беременности
        проконсультируйтесь с врачом.
      </p>
      <p class="site-footer__copy">© {{ year }} Анжелика Александрова</p>
    </div>
  </footer>
</template>

<style lang="sass" scoped>
@use './SiteFooter'
</style>
