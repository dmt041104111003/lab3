'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function XuHuongTuongLaiPage() {
  useEffect(() => {
    document.title = 'Xu hướng tương lai - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá blockchain, công nghệ xanh, metaverse và các xu hướng công nghệ tương lai. Dự đoán và phân tích công nghệ của ngày mai.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá blockchain, công nghệ xanh, metaverse và các xu hướng công nghệ tương lai. Dự đoán và phân tích công nghệ của ngày mai.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryMainPage 
      categoryId="xu-huong-tuong-lai"
      title="Xu hướng tương lai"
      basePath="xu-huong-tuong-lai"
    />
  )
}