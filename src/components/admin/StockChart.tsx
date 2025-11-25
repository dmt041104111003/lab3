'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface AnalyticsData {
  date: string
  views: number
  comments: number
  posts: number
}

interface StockChartProps {
  days?: number
}

export default function StockChart({ days = 30 }: StockChartProps) {
  const [data, setData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'comments'>('views')
  const [viewType, setViewType] = useState<'day' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchData()
  }, [viewType])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/analytics?viewType=${viewType}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <div className="h-96 flex items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    )
  }

  const dates = data.map(d => {
    if (viewType === 'year') {
      return d.date 
    } else if (viewType === 'month') {
      const [year, month] = d.date.split('-')
      return `${month}/${year}`
    } else {
      const date = new Date(d.date)
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }
  })
  
  const viewsData = data.map(d => d.views)
  const commentsData = data.map(d => d.comments)
  const postsData = data.map(d => d.posts)

  const chartOptions: any = {
    chart: {
      type: 'area',
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    xaxis: {
      type: 'category',
      categories: dates,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: viewType === 'year' ? '13px' : viewType === 'month' ? '12px' : '11px'
        },
        rotate: viewType === 'day' ? -45 : 0,
        rotateAlways: false,
        showDuplicates: false,
        hideOverlappingLabels: viewType === 'day',
        minHeight: viewType === 'day' ? 60 : 40
      },
      axisBorder: {
        show: true,
        color: '#e5e7eb'
      },
      axisTicks: {
        show: true,
        color: '#e5e7eb'
      }
    },
    yaxis: [
      {
        title: {
          text: selectedMetric === 'views' ? 'Lượt xem' : 'Bình luận',
          style: {
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: 600
          }
        },
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          }
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter: (value: any, opts: any) => {
          let index = opts?.dataPointIndex
          
          if (index === undefined || index === null || index < 0) {
            if (typeof value === 'string') {
              index = dates.findIndex(d => d === value)
            } else if (typeof value === 'number' && value >= 0 && value < data.length) {
              index = value
            } else {
              index = 0
            }
          }
          
          if (index < 0 || index >= data.length) {
            return String(value || '')
          }
          
          const dataPoint = data[index]
          if (!dataPoint?.date) {
            return String(value || '')
          }
          
          if (viewType === 'year') {
            return `Năm ${dataPoint.date}`
          } else if (viewType === 'month') {
            const parts = dataPoint.date.split('-')
            if (parts.length >= 2) {
              const [year, month] = parts
              return `Tháng ${month}/${year}`
            }
            return `Tháng ${dataPoint.date}`
          } else {
            try {
              const date = new Date(dataPoint.date)
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
              }
              return dataPoint.date
            } catch {
              return dataPoint.date
            }
          }
        }
      },
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: (value: number) => {
          return value.toLocaleString('vi-VN')
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10
      }
    },
    colors: selectedMetric === 'views' 
      ? ['#B06C3B', '#8C522B'] 
      : ['#C38C63', '#B06C3B'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 500,
      offsetY: 15,
      offsetX: 0,
      itemMargin: {
        horizontal: 30,
        vertical: 8
      },
      markers: {
        width: 10,
        height: 10,
        radius: 5,
        offsetX: -2,
        offsetY: 0
      },
      formatter: function(seriesName: string, opts: any) {
        return seriesName
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
            toolbar: {
              tools: {
                download: false
              }
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }

  const series = [
    {
      name: selectedMetric === 'views' ? 'Lượt xem' : 'Bình luận',
      data: selectedMetric === 'views' ? viewsData : commentsData,
      type: 'area'
    },
    {
      name: 'Bài viết mới',
      data: postsData,
      type: 'column'
    }
  ]

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Phân tích bài đăng</h2>
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi lượt xem, bình luận và bài viết mới
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Type Tabs */}
            <div className="flex gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
              <button
                onClick={() => setViewType('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === 'day'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setViewType('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === 'month'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setViewType('year')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === 'year'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Năm
              </button>
            </div>
            {/* Metric Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('views')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'views'
                    ? 'bg-brand-light text-brand-deep border-2 border-brand-accent'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lượt xem
              </button>
              <button
                onClick={() => setSelectedMetric('comments')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'comments'
                    ? 'bg-brand-muted text-brand-dark border-2 border-brand-accent'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bình luận
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {data.length > 0 ? (
          <Chart
            options={chartOptions}
            series={series}
            type="line"
            height={400}
            width="100%"
          />
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  )
}

