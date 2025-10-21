'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirect() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/check-admin')
        const data = await response.json()
        
        console.log('AdminRedirect - API response:', data)
        
        if (data.isAdmin) {
          console.log('AdminRedirect - Redirecting to admin')
          window.location.href = '/admin'
          return
        }
        
        setIsChecking(false)
      } catch (error) {
        console.log('AdminRedirect - Error:', error)
        setIsChecking(false)
      }
    }

    checkAdmin()
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-blue"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  return null
}
