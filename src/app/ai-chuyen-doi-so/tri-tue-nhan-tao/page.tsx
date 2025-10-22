'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function TriTueNhanTaoPage() {
  useEffect(() => {
    document.title = 'Trí tuệ nhân tạo (AI) - AI & Chuyển đổi số - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá trí tuệ nhân tạo, machine learning và ứng dụng AI trong đời sống. Cập nhật xu hướng AI mới nhất.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá trí tuệ nhân tạo, machine learning và ứng dụng AI trong đời sống. Cập nhật xu hướng AI mới nhất.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Trí tuệ nhân tạo (AI)" 
      subcategory="tri-tue-nhan-tao"
      basePath="ai-chuyen-doi-so"
    />
  )
}