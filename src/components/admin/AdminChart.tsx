'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

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
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value
  }))

  const colors = data.map(item => item.color)

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-600 font-medium">{title}</div>
        </div>
      </div>
      <div className="w-full space-y-3 px-2">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          return (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center flex-1">
                <div 
                  className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
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
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value,
    color: item.color
  }))

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-800 mb-6 text-center">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

