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

  useEffect(() => {
    fetchData()
  }, [days])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/analytics?days=${days}`)
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
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    )
  }

  // Reduce data density for better visibility
  const step = Math.max(1, Math.floor(data.length / 15)) // Show max 15 points
  const filteredData = data.filter((_, index) => index % step === 0 || index === data.length - 1)
  
  const dates = filteredData.map(d => {
    const date = new Date(d.date)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  })
  const viewsData = filteredData.map(d => d.views)
  const commentsData = filteredData.map(d => d.comments)
  const postsData = filteredData.map(d => d.posts)

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
          fontSize: '11px'
        },
        rotate: -45,
        rotateAlways: false,
        showDuplicates: false,
        hideOverlappingLabels: true,
        minHeight: 60
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
        format: 'dd/MM/yyyy'
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
      ? ['#10b981', '#3b82f6'] 
      : ['#f59e0b', '#ef4444'],
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
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Phân tích bài đăng</h2>
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi lượt xem, bình luận và bài viết mới
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric('views')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'views'
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lượt xem
            </button>
            <button
              onClick={() => setSelectedMetric('comments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'comments'
                  ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bình luận
            </button>
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

