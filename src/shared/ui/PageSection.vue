<script setup lang="ts">
const { id, labelledby, tone = 'default' } = defineProps<{
  id?: string
  labelledby?: string
  tone?: 'default' | 'sand' | 'accent'
}>()
</script>

<template>
  <section :id="id" :aria-labelledby="labelledby" :class="['page-section', `page-section--${tone}`]">
    <div class="page-section__inner">
      <slot />
    </div>
  </section>
</template>

<style lang="sass" scoped>
@use './PageSection'
</style>
