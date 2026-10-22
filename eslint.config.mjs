// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

/**
 * Feature-Sliced Design boundaries.
 * Layers are listed top to bottom: a layer may import only from the layers below it.
 */
const LAYERS = /** @type {const} */ (['app', 'pages', 'widgets', 'features', 'entities', 'shared'])
const SLICED_LAYERS = new Set(['pages', 'widgets', 'features', 'entities'])

const deepImportPatterns = [
  {
    group: ['@/pages/*/**', '@/widgets/*/**', '@/features/*/**', '@/entities/*/**'],
    message: 'FSD: import a slice only through its public API (index.ts), e.g. "@/entities/site-content".',
  },
  {
    group: ['@/shared/*/**'],
    message: 'FSD: import shared only through a segment public API, e.g. "@/shared/ui".',
  },
  {
    group: ['@/app', '@/app/**'],
    message: 'FSD: the app layer must not be imported by other modules.',
  },
]

/** @param {(typeof LAYERS)[number]} layer */
function layerBoundaries(layer) {
  const index = LAYERS.indexOf(layer)
  const upperLayers = LAYERS.slice(0, index)
  const patterns = [...deepImportPatterns]

  if (upperLayers.length > 0) {
    patterns.push({
      group: upperLayers.flatMap((upper) => [`@/${upper}`, `@/${upper}/**`]),
      message: `FSD: "${layer}" may import only from lower layers (${LAYERS.slice(index + 1).join(', ') || '—'}).`,
    })
  }

  if (SLICED_LAYERS.has(layer)) {
    patterns.push({
      group: [`@/${layer}/*`],
      message: `FSD: slices of "${layer}" must not import each other; inside a slice use relative imports.`,
    })
  }

  return {
    name: `fsd/${layer}`,
    files: [`src/${layer}/**/*.{ts,vue}`],
    rules: {
      'no-restricted-imports': ['error', { patterns }],
    },
  }
}

export default withNuxt(
  {
    name: 'app/rules',
    files: ['**/*.{ts,vue}'],
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/block-lang': ['error', { script: { lang: 'ts' }, style: { lang: 'sass' } }],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits', 'defineModel'] }],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      // Optional props get defaults via props destructuring, so explicit `withDefaults` is not required.
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'always', component: 'always' } }],
    },
  },
  {
    // Nuxt route files are named after URL segments (index.vue, login.vue).
    name: 'app/routes',
    files: ['src/app/routes/**/*.vue', 'src/app/App.vue', 'src/app/AppError.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  ...LAYERS.map(layerBoundaries),
)
