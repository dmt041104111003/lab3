export interface SessionCookieUser {
  id: string
  name?: string
  email?: string
  role?: string
}

export const parseSessionCookie = (cookieValue?: string | null): SessionCookieUser | null => {
  if (!cookieValue) return null

  try {
    const decoded = decodeURIComponent(cookieValue)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

