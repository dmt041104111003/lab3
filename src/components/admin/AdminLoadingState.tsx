interface AdminLoadingStateProps {
  message?: string
  className?: string
}

export default function AdminLoadingState({ 
  message = 'Đang tải...', 
  className = '' 
}: AdminLoadingStateProps) {
  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-blue"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  )
}
