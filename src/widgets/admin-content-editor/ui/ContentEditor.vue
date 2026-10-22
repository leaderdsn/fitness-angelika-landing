<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useContentEditor } from '@/features/edit-content'
import { AppButton, AppIcon } from '@/shared/ui'

import { EDITOR_TABS } from '../config/tabs'
import { tabHasErrors } from '../model/tabErrors'
import AboutForm from './forms/AboutForm.vue'
import ContactsForm from './forms/ContactsForm.vue'
import DirectionsForm from './forms/DirectionsForm.vue'
import FaqForm from './forms/FaqForm.vue'
import HeroForm from './forms/HeroForm.vue'
import PricingForm from './forms/PricingForm.vue'
import ReviewsForm from './forms/ReviewsForm.vue'
import TitledListForm from './forms/TitledListForm.vue'

import type { EditorTabId } from '../config/tabs'

const editor = useContentEditor()
const { draft, loading, saving, loadError, saveError, savedAt, errors, isDirty, errorFor } = editor

const activeTab = ref<EditorTabId>('contacts')

async function save(): Promise<void> {
  const saved = await editor.save()
  if (saved) return
  const tabWithError = EDITOR_TABS.find((tab) => tabHasErrors(tab, errors.value))
  if (tabWithError) activeTab.value = tabWithError.id
}

function onBeforeUnload(event: BeforeUnloadEvent): void {
  if (isDirty.value) event.preventDefault()
}

onBeforeRouteLeave(() => !isDirty.value || window.confirm('Есть несохранённые изменения. Уйти без сохранения?'))

onMounted(() => {
  void editor.load()
  window.addEventListener('beforeunload', onBeforeUnload)
})

onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>

<template>
  <section class="content-editor" aria-label="Редактор контента">
    <p v-if="loading" class="content-editor__state">Загружаем контент…</p>
    <div v-else-if="loadError" class="content-editor__state content-editor__state--error">
      {{ loadError }}
      <AppButton size="sm" variant="secondary" @click="editor.load()">Повторить</AppButton>
    </div>

    <template v-else-if="draft">
      <nav class="content-editor__tabs" aria-label="Разделы сайта">
        <button
          v-for="tab in EDITOR_TABS"
          :key="tab.id"
          type="button"
          :class="[
            'content-editor__tab',
            {
              'content-editor__tab--active': tab.id === activeTab,
              'content-editor__tab--invalid': tabHasErrors(tab, errors),
            },
          ]"
          :aria-current="tab.id === activeTab ? 'page' : undefined"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="content-editor__panel">
        <ContactsForm
          v-if="activeTab === 'contacts'"
          v-model:contacts="draft.contacts"
          v-model:seo="draft.seo"
          v-model:final-cta="draft.finalCta"
          :error-for="errorFor"
        />
        <HeroForm v-else-if="activeTab === 'hero'" v-model="draft.hero" :error-for="errorFor" />
        <TitledListForm
          v-else-if="activeTab === 'problems'"
          v-model="draft.problems"
          path="problems"
          heading="Узнаёте себя?"
          description="Боли и ситуации, с которыми к вам приходят."
          :max="8"
          :error-for="errorFor"
        />
        <DirectionsForm v-else-if="activeTab === 'directions'" v-model="draft.directions" :error-for="errorFor" />
        <TitledListForm
          v-else-if="activeTab === 'steps'"
          v-model="draft.steps"
          path="steps"
          heading="Как проходит работа"
          description="Шаги от первого сообщения до результата."
          :max="6"
          :error-for="errorFor"
        />
        <PricingForm v-else-if="activeTab === 'pricing'" v-model="draft.pricing" :error-for="errorFor" />
        <AboutForm v-else-if="activeTab === 'about'" v-model="draft.about" :error-for="errorFor" />
        <ReviewsForm v-else-if="activeTab === 'reviews'" v-model="draft.reviews" :error-for="errorFor" />
        <FaqForm v-else-if="activeTab === 'faq'" v-model="draft.faq" :error-for="errorFor" />
      </div>

      <div class="content-editor__bar" role="status">
        <p class="content-editor__status">
          <template v-if="saveError">
            <span class="content-editor__status--error">{{ saveError }}</span>
          </template>
          <template v-else-if="isDirty">Есть несохранённые изменения</template>
          <template v-else-if="savedAt">
            <AppIcon name="check" :size="16" /> Сохранено, изменения уже на сайте
          </template>
          <template v-else>Изменений нет</template>
        </p>
        <div class="content-editor__actions">
          <AppButton variant="ghost" size="sm" :disabled="!isDirty || saving" @click="editor.discard()">
            Отменить
          </AppButton>
          <AppButton size="sm" :disabled="!isDirty || saving" @click="save">
            {{ saving ? 'Сохраняем…' : 'Сохранить' }}
          </AppButton>
        </div>
      </div>
    </template>
  </section>
</template>

<style lang="sass" scoped>
@use './ContentEditor'
</style>
