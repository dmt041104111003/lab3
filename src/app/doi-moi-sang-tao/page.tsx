'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function DoiMoiSangTaoPage() {
  useEffect(() => {
    document.title = 'Đổi mới sáng tạo - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá startup Việt Nam, ý tưởng hay, doanh nghiệp sáng tạo. Cập nhật xu hướng đổi mới và sáng tạo trong công nghệ.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá startup Việt Nam, ý tưởng hay, doanh nghiệp sáng tạo. Cập nhật xu hướng đổi mới và sáng tạo trong công nghệ.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryMainPage 
      categoryId="doi-moi-sang-tao"
      title="Đổi mới sáng tạo"
      basePath="doi-moi-sang-tao"
    />
  )
}