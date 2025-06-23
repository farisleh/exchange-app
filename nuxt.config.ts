// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt', '@nuxt/test-utils/module'],
  nitro: {
    imports: {
      dirs: ['server/types', 'server/services']
    }
  }
})