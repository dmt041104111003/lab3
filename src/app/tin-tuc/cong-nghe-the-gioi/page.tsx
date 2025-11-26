'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function CongNgheTheGioiPage() {
  useEffect(() => {
    document.title = 'Công nghệ thế giới - Tin tức - LAB3'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cập nhật tin tức công nghệ thế giới mới nhất. Theo dõi các xu hướng công nghệ toàn cầu, phát minh mới và tác động của chúng.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Cập nhật tin tức công nghệ thế giới mới nhất. Theo dõi các xu hướng công nghệ toàn cầu, phát minh mới và tác động của chúng.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Công nghệ thế giới"
      subcategory="cong-nghe-the-gioi"
    />
  )
}
