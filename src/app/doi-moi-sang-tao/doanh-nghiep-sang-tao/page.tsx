'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function DoanhNghiepSangTaoPage() {
  useEffect(() => {
    document.title = 'Doanh nghiệp sáng tạo - Đổi mới sáng tạo - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá các doanh nghiệp sáng tạo, mô hình kinh doanh mới và tinh thần đổi mới. Cập nhật xu hướng doanh nghiệp sáng tạo và tư duy đổi mới.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá các doanh nghiệp sáng tạo, mô hình kinh doanh mới và tinh thần đổi mới. Cập nhật xu hướng doanh nghiệp sáng tạo và tư duy đổi mới.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Doanh nghiệp sáng tạo" 
      subcategory="doanh-nghiep-sang-tao"
      basePath="doi-moi-sang-tao"
    />
  )
}