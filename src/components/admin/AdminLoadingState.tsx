import LoadingState from '@/components/LoadingState'

interface AdminLoadingStateProps {
  message?: string
  className?: string
}

export default function AdminLoadingState({ 
  message = 'Đang tải...', 
  className = '' 
}: AdminLoadingStateProps) {
  return <LoadingState message={message} className={className} />
}
