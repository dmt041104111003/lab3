interface AdminErrorAlertProps {
  message: string
  className?: string
}

export default function AdminErrorAlert({ message, className = '' }: AdminErrorAlertProps) {
  if (!message) return null
  
  return (
    <div className={`mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded ${className}`}>
      {message}
    </div>
  )
}
