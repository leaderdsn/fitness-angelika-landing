import { getPasswordStamp } from './adminCredentials'

import type { H3Event } from 'h3'

type AdminSessionData = { authenticated?: boolean; passwordStamp?: number }

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

function getSessionSecret(): string {
  const { sessionSecret } = useRuntimeConfig()
  if (sessionSecret.length < 32) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_SESSION_SECRET is not configured (at least 32 characters)',
    })
  }
  return sessionSecret
}

export function useAdminSession(event: H3Event) {
  return useSession<AdminSessionData>(event, {
    name: 'admin_session',
    password: getSessionSecret(),
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: !import.meta.dev,
      path: '/',
    },
  })
}

export async function signIn(event: H3Event, passwordStamp: number): Promise<void> {
  const session = await useAdminSession(event)
  await session.update({ authenticated: true, passwordStamp })
}

export async function isAdmin(event: H3Event): Promise<boolean> {
  const session = await useAdminSession(event)
  if (session.data.authenticated !== true) return false
  return (session.data.passwordStamp ?? 0) === (await getPasswordStamp(useStorage('data')))
}
