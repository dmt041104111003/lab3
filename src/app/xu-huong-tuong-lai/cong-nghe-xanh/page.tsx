'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function CongNgheXanhPage() {
  useEffect(() => {
    document.title = 'Công nghệ xanh (GreenTech) - Xu hướng tương lai - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá công nghệ xanh, năng lượng tái tạo và phát triển bền vững. Cập nhật xu hướng GreenTech mới nhất.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá công nghệ xanh, năng lượng tái tạo và phát triển bền vững. Cập nhật xu hướng GreenTech mới nhất.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Công nghệ xanh (GreenTech)" 
      subcategory="cong-nghe-xanh"
      basePath="xu-huong-tuong-lai"
    />
  )
}