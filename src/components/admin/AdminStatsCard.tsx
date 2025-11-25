interface AdminStatsCardProps {
  title: string
  value: number
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  className?: string
}

export default function AdminStatsCard({ title, value, color, className = '' }: AdminStatsCardProps) {
  const colorClasses = {
    blue: 'text-tech-blue',
    green: 'text-green-600', 
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  }

  return (
    <div className={`text-center ${className}`}>
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  )
}
