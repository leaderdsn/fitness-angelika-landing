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
