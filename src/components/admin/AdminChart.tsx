'use client'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

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
  const chartData = data.map(item => item.value)
  const labels = data.map(item => item.label)
  
  const brandColors = ['#B06C3B', '#8C522B', '#C38C63', '#E8D4C2', '#6B3C20']
  const colors = data.map((_, index) => brandColors[index % brandColors.length])

  const options: any = {
    chart: {
      type: 'donut',
      height: 350,
      fontFamily: 'Roboto, sans-serif'
    },
    labels: labels,
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: function(val: number) {
        return val.toFixed(1) + '%'
      },
      style: {
        fontSize: '12px',
        fontWeight: 600
      },
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: false
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: '#1f2937',
              formatter: function(val: string) {
                return total.toString()
              }
            },
            total: {
              show: true,
              label: title,
              fontSize: '13px',
              fontWeight: 500,
              color: '#6b7280',
              formatter: function() {
                return title
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value: number) {
          return value.toLocaleString('vi-VN')
        }
      }
    },
    legend: {
      show: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        }
      }
    }]
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <Chart
          options={options}
          series={chartData}
          type="donut"
          height={350}
        />
      </div>
      <div className="w-full space-y-3 px-2 mt-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          return (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-light transition-colors">
              <div className="flex items-center flex-1">
                <div 
                  className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-gray-900">{item.value}</span>
                <span className="text-xs text-brand-dark bg-brand-muted px-2 py-1 rounded">
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
  const brandColors = ['#B06C3B', '#8C522B', '#C38C63', '#E8D4C2', '#6B3C20']
  const colors = data.map((_, index) => brandColors[index % brandColors.length])

  const options: any = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      fontFamily: 'Roboto, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#1f2937']
      },
      formatter: function(val: number) {
        return val.toLocaleString('vi-VN')
      }
    },
    xaxis: {
      categories: data.map(item => item.label),
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        },
        rotate: -45,
        rotateAlways: false
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
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        },
        formatter: function(val: number) {
          return val.toLocaleString('vi-VN')
        }
      },
      axisBorder: {
        show: true,
        color: '#e5e7eb'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: colors.map(color => {
          if (color === '#B06C3B') return '#8C522B'
          if (color === '#8C522B') return '#6B3C20'
          if (color === '#C38C63') return '#B06C3B'
          if (color === '#E8D4C2') return '#C38C63'
          if (color === '#6B3C20') return '#4A2815'
          return '#8C522B'
        }),
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 100]
      }
    },
    colors: colors,
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
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function(val: number) {
          return val.toLocaleString('vi-VN')
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            rotate: -45
          }
        }
      }
    }]
  }

  const series = [{
    name: 'Giá trị',
    data: data.map(item => item.value)
  }]

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-800 mb-6 text-center">{title}</h3>
      <div className="h-[350px]">
        <Chart
          options={options}
          series={series}
          type="bar"
          height={350}
          width="100%"
        />
      </div>
    </div>
  )
}

