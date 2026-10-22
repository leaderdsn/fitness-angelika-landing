import { fileURLToPath } from 'node:url'


export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },

  // Feature-Sliced Design lives in src/; Nuxt's own directories are moved into the app layer.
  srcDir: 'src',
  dir: {
    pages: 'app/routes',
    layouts: 'app/layouts',
    middleware: 'app/middleware',
    plugins: 'app/plugins',
  },
  serverDir: 'server',

  // Everything is imported explicitly through slice public APIs; only Vue/Nuxt APIs stay auto-imported.
  components: { dirs: [] },
  imports: { scan: false },


  modules: ['@nuxt/eslint'],

  css: ['@/app/styles/main.sass'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#f7f1ea' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  routeRules: {
    '/admin/**': { ssr: false },
    '/admin': { ssr: false },
  },

  runtimeConfig: {
    // Overridden by NUXT_ADMIN_PASSWORD / NUXT_SESSION_SECRET at runtime.
    adminPassword: '',
    sessionSecret: '',
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },

  nitro: {
    storage: {
      data: { driver: 'fs', base: './.data/db' },
      media: { driver: 'fs', base: './.data/media' },
    },
    devStorage: {
      data: { driver: 'fs', base: './.data/db' },
      media: { driver: 'fs', base: './.data/media' },
    },
  },

  hooks: {
    // The root component belongs to the FSD app layer instead of src/app.vue.
    'app:resolve'(app) {
      app.mainComponent = fileURLToPath(new URL('./src/app/App.vue', import.meta.url))
      app.errorComponent = fileURLToPath(new URL('./src/app/AppError.vue', import.meta.url))
    },
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
      },
    },
  },
})
