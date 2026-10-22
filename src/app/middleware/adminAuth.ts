import { defineNuxtRouteMiddleware, navigateTo } from '#app'

import { isAuthenticated } from '@/features/admin-auth'

const LOGIN_PATH = '/admin/login'

export default defineNuxtRouteMiddleware(async (to) => {
  const authenticated = await isAuthenticated().catch(() => false)

  if (to.path === LOGIN_PATH) {
    return authenticated ? navigateTo('/admin') : undefined
  }
  return authenticated ? undefined : navigateTo(LOGIN_PATH)
})
