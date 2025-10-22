'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function DuLieuLonIotPage() {
  useEffect(() => {
    document.title = 'Dữ liệu lớn & IoT - AI & Chuyển đổi số - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá dữ liệu lớn, IoT và các công nghệ kết nối. Cập nhật xu hướng Big Data, Internet of Things và phân tích dữ liệu.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá dữ liệu lớn, IoT và các công nghệ kết nối. Cập nhật xu hướng Big Data, Internet of Things và phân tích dữ liệu.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Dữ liệu lớn & IoT" 
      subcategory="du-lieu-lon-iot"
      basePath="ai-chuyen-doi-so"
    />
  )
}
