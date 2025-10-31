'use client'

interface ChartData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: ChartData[]
  total: number
  title: string
}

export function DonutChart({ data, total, title }: DonutChartProps) {
  const size = 160
  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativeOffset = 0

  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const segmentLength = (percentage / 100) * circumference
    const gap = circumference - segmentLength
    const offset = -cumulativeOffset
    cumulativeOffset += segmentLength

    return {
      ...item,
      percentage,
      segmentLength,
      gap,
      offset
    }
  })

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative mb-6" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                strokeDasharray: `${segment.segmentLength} ${segment.gap}`,
                strokeDashoffset: segment.offset
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600 font-medium">{title}</div>
        </div>
      </div>
      <div className="w-full space-y-3 px-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center flex-1">
              <div 
                className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm font-medium text-gray-700">{segment.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-900">{segment.value}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface BarChartProps {
  data: ChartData[]
  title: string
  maxValue?: number
}

export function BarChart({ data, title, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1)
  const maxHeight = 150

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-800 mb-6 text-center">{title}</h3>
      <div className="flex items-end justify-between gap-3 h-40 px-4">
        {data.map((item, index) => {
          const height = max > 0 ? (item.value / max) * maxHeight : 0
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full mb-2" style={{ height: maxHeight }}>
                <div 
                  className="w-full rounded-t-lg shadow-md transition-all duration-500 hover:shadow-lg hover:scale-105"
                  style={{
                    height: `${height}px`,
                    backgroundColor: item.color,
                    minHeight: item.value > 0 ? '8px' : '0'
                  }}
                />
                {item.value > 0 && height > 20 && (
                  <div className="absolute top-2 left-0 right-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                      {item.value}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center w-full">
                <div className="text-lg font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-600 font-medium mt-1 truncate w-full" title={item.label}>
                  {item.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

