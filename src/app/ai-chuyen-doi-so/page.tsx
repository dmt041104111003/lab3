'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function AiChuyenDoiSoPage() {
  useEffect(() => {
    document.title = 'AI & Chuyển đổi số - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá trí tuệ nhân tạo, dữ liệu lớn, IoT và chuyển đổi số trong doanh nghiệp, giáo dục. Cập nhật xu hướng AI mới nhất.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá trí tuệ nhân tạo, dữ liệu lớn, IoT và chuyển đổi số trong doanh nghiệp, giáo dục. Cập nhật xu hướng AI mới nhất.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryMainPage 
      categoryId="ai-chuyen-doi-so"
      title="AI – Chuyển đổi số"
      basePath="ai-chuyen-doi-so"
    />
  )
}