type SessionState = { authenticated: boolean }

export function login(password: string): Promise<SessionState> {
  return $fetch<SessionState>('/api/admin/login', { method: 'POST', body: { password } })
}

export function logout(): Promise<SessionState> {
  return $fetch<SessionState>('/api/admin/logout', { method: 'POST' })
}

export async function isAuthenticated(): Promise<boolean> {
  const { authenticated } = await $fetch<SessionState>('/api/admin/session')
  return authenticated
}

/** Sends a one-time reset link to the admin's Telegram. */
export async function requestPasswordReset(): Promise<void> {
  await $fetch('/api/admin/password-reset/request', { method: 'POST' })
}

/** Sets a new password by a reset link token and signs in. */
export function resetPassword(token: string, password: string): Promise<SessionState> {
  return $fetch<SessionState>('/api/admin/password-reset/confirm', { method: 'POST', body: { token, password } })
}
