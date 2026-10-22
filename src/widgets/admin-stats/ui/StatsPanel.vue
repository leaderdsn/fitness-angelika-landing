<script setup lang="ts">
import { computed } from 'vue'

import { formatDay, useClickStats } from '@/entities/click-stats'
import { AppButton, AppIcon } from '@/shared/ui'

const RECENT_DAYS = 14

const { data: stats, status, refresh } = useClickStats()

const recentDays = computed(() => (stats.value?.daily ?? []).slice(-RECENT_DAYS).reverse())
const total = computed(() => (stats.value ? stats.value.totals.telegram + stats.value.totals.instagram : 0))
</script>

<template>
  <section class="stats-panel" aria-labelledby="stats-title">
    <header class="stats-panel__header">
      <h2 id="stats-title" class="stats-panel__title">Переходы за {{ stats?.days ?? 30 }} дней</h2>
      <AppButton variant="ghost" size="sm" :disabled="status === 'pending'" @click="refresh()">Обновить</AppButton>
    </header>

    <p v-if="status === 'error'" class="stats-panel__error">Не удалось загрузить статистику</p>

    <template v-else-if="stats">
      <div class="stats-panel__tiles">
        <div class="stats-panel__tile">
          <span class="stats-panel__tile-label"><AppIcon name="telegram" :size="16" /> Telegram</span>
          <span class="stats-panel__tile-value">{{ stats.totals.telegram }}</span>
        </div>
        <div class="stats-panel__tile">
          <span class="stats-panel__tile-label"><AppIcon name="instagram" :size="16" /> Instagram</span>
          <span class="stats-panel__tile-value">{{ stats.totals.instagram }}</span>
        </div>
        <div class="stats-panel__tile">
          <span class="stats-panel__tile-label">Всего</span>
          <span class="stats-panel__tile-value">{{ total }}</span>
        </div>
      </div>

      <table class="stats-panel__table">
        <caption class="stats-panel__caption">Последние {{ RECENT_DAYS }} дней</caption>
        <thead>
          <tr>
            <th scope="col">День</th>
            <th scope="col">Telegram</th>
            <th scope="col">Instagram</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in recentDays" :key="day.date">
            <th scope="row">{{ formatDay(day.date) }}</th>
            <td>{{ day.telegram }}</td>
            <td>{{ day.instagram }}</td>
          </tr>
        </tbody>
      </table>
      <p class="stats-panel__hint">Считаются нажатия на кнопки Telegram и Instagram на сайте.</p>
    </template>
  </section>
</template>

<style lang="sass" scoped>
@use './StatsPanel'
</style>
