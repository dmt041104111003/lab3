interface LoadingStateProps {
  message?: string
  className?: string
}

export default function LoadingState({ 
  message = 'Đang tải...', 
  className = '' 
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
      <div className="relative mb-8">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-60 w-60 object-contain animate-pulse"
        />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
      <p className="text-gray-600 text-sm mt-2">{message}</p>
    </div>
  )
}
