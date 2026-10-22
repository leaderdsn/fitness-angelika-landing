<script setup lang="ts" generic="T">
import { moveItem } from '@/shared/lib'

import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'

const {
  createItem,
  itemTitle,
  addLabel = 'Добавить',
  max = Infinity,
} = defineProps<{
  createItem: () => T
  itemTitle: (item: T, index: number) => string
  addLabel?: string
  max?: number
}>()

const items = defineModel<T[]>({ required: true })

function add(): void {
  items.value = [...items.value, createItem()]
}

function remove(index: number): void {
  items.value = items.value.filter((_, i) => i !== index)
}

function move(from: number, to: number): void {
  items.value = moveItem(items.value, from, to)
}
</script>

<template>
  <div class="list-editor">
    <ol class="list-editor__list" role="list">
      <li v-for="(item, index) in items" :key="index" class="list-editor__item">
        <div class="list-editor__toolbar">
          <span class="list-editor__title">{{ itemTitle(item, index) }}</span>
          <div class="list-editor__actions">
            <button
              type="button"
              class="list-editor__action"
              :disabled="index === 0"
              aria-label="Переместить выше"
              @click="move(index, index - 1)"
            >
              <AppIcon name="arrow-up" :size="16" />
            </button>
            <button
              type="button"
              class="list-editor__action"
              :disabled="index === items.length - 1"
              aria-label="Переместить ниже"
              @click="move(index, index + 1)"
            >
              <AppIcon name="arrow-down" :size="16" />
            </button>
            <button
              type="button"
              class="list-editor__action list-editor__action--danger"
              aria-label="Удалить"
              @click="remove(index)"
            >
              <AppIcon name="trash" :size="16" />
            </button>
          </div>
        </div>
        <div class="list-editor__body">
          <slot :item="item" :index="index" />
        </div>
      </li>
    </ol>
    <AppButton v-if="items.length < max" variant="ghost" size="sm" @click="add">
      <AppIcon name="plus" :size="16" />
      {{ addLabel }}
    </AppButton>
  </div>
</template>

<style lang="sass" scoped>
@use './ListEditor'
</style>
