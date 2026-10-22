<script setup lang="ts">
const { title, description } = defineProps<{ title: string; description?: string }>()
</script>

<template>
  <fieldset class="editor-group">
    <legend class="editor-group__title">{{ title }}</legend>
    <p v-if="description" class="editor-group__description">{{ description }}</p>
    <div class="editor-group__body">
      <slot />
    </div>
  </fieldset>
</template>

<style lang="sass" scoped>
@use './EditorGroup'
</style>
