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
  const typeClasses = {
    success: 'bg-green-50 border border-green-200 text-green-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border border-blue-200 text-blue-800'
  }

  React.useEffect(() => {
    if (isVisible && autoClose && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, onClose, duration])

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${typeClasses[type]}`}>
      <div className="flex items-center">
        <div className="flex-1">
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
