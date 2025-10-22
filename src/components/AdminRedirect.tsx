'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingState from '@/components/LoadingState'

export default function AdminRedirect() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/check-admin')
        const data = await response.json()
        
        if (data.isAdmin) {
          window.location.href = '/admin'
          return
        }
        
        setIsChecking(false)
      } catch (error) {
        setIsChecking(false)
      }
    }

    checkAdmin()
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Đang kiểm tra quyền truy cập..." />
      </div>
    )
  }

  return null
}
