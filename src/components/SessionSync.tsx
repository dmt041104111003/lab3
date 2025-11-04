'use client'

import { useEffect } from 'react'
import { getSession } from '@/lib/session'

export default function SessionSync() {
  useEffect(() => {
    const syncSession = async () => {
      const session = getSession()
      if (session) {
        try {
          await fetch('/api/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: session }),
            credentials: 'include', 
          })
        } catch (error) {
        }
      }
    }
    
    syncSession()
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user_session') {
        syncSession()
      }
    }
    
    window.addEventListener('storage', handleStorage)
    
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return null
}
