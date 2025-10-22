export interface User {
  id: string
  name: string
  email: string
  role: string
}

export const getSession = (): User | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const session = localStorage.getItem('user_session')
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

export const setSession = (user: User) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('user_session', JSON.stringify(user))
  try {
    window.dispatchEvent(new CustomEvent('session:update'))
  } catch {}
}

export const clearSession = () => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('user_session')
  try {
    window.dispatchEvent(new CustomEvent('session:update'))
  } catch {}
}

export const isAdmin = (): boolean => {
  const user = getSession()
  return user?.role === 'ADMIN'
}

export const setServerSession = (user: User) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('user_session', JSON.stringify(user))
  document.cookie = `user_session=${JSON.stringify(user)}; path=/; max-age=86400; secure; samesite=strict`
}

export const clearServerSession = () => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('user_session')
  document.cookie = 'user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
