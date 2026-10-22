<script setup lang="ts">
import { reloadNuxtApp, useHead } from '#app'

import { LogoutButton } from '@/features/admin-auth'
import { BackupPanel } from '@/features/site-backup'
import { AppIcon } from '@/shared/ui'
import { ContentEditor } from '@/widgets/admin-content-editor'
import { StatsPanel } from '@/widgets/admin-stats'

useHead({ title: 'Админка', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>

<template>
  <div class="admin-dashboard">
    <header class="admin-dashboard__header">
      <div class="admin-dashboard__header-inner">
        <p class="admin-dashboard__brand">Админка сайта</p>
        <a href="/" target="_blank" rel="noopener" class="admin-dashboard__site-link">
          Открыть сайт <AppIcon name="external" :size="16" />
        </a>
        <LogoutButton />
      </div>
    </header>
    <main class="admin-dashboard__main">
      <ContentEditor class="admin-dashboard__editor" />
      <aside class="admin-dashboard__aside">
        <StatsPanel />
        <BackupPanel class="admin-dashboard__backup" @restored="reloadNuxtApp()" />
      </aside>
    </main>
  </div>
</template>

<style lang="sass" scoped>
@use './AdminDashboardPage'
</style>
