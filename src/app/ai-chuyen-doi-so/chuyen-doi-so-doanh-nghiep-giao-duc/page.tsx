'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function ChuyenDoiSoDoanhNghiepGiaoDucPage() {
  useEffect(() => {
    document.title = 'Chuyển đổi số trong doanh nghiệp và giáo dục - AI & Chuyển đổi số - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá chuyển đổi số trong doanh nghiệp và giáo dục. Cập nhật xu hướng số hóa, công nghệ giáo dục và quản lý doanh nghiệp.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá chuyển đổi số trong doanh nghiệp và giáo dục. Cập nhật xu hướng số hóa, công nghệ giáo dục và quản lý doanh nghiệp.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Chuyển đổi số trong doanh nghiệp và giáo dục" 
      subcategory="chuyen-doi-so-doanh-nghiep-giao-duc"
      basePath="ai-chuyen-doi-so"
    />
  )
}
