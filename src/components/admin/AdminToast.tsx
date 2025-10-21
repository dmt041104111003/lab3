import React from 'react'

interface AdminToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export default function AdminToast({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose,
  autoClose = true,
  duration = 3000
}: AdminToastProps) {
  if (!isVisible) return null

  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose, duration])

  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${typeClasses[type]}`}>
      {message}
    </div>
  )
}
