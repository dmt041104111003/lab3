'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function CongNgheVietNamPage() {
  useEffect(() => {
    document.title = 'Công nghệ Việt Nam - Tin tức - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cập nhật tin tức công nghệ Việt Nam mới nhất. Theo dõi các startup, doanh nghiệp công nghệ và xu hướng đổi mới trong nước.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Cập nhật tin tức công nghệ Việt Nam mới nhất. Theo dõi các startup, doanh nghiệp công nghệ và xu hướng đổi mới trong nước.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Công nghệ Việt Nam"
      subcategory="cong-nghe-viet-nam"
      basePath="tin-tuc"
    />
  )
}
