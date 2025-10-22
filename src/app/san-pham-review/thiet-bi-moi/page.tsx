'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function ThietBiMoiPage() {
  useEffect(() => {
    document.title = 'Thiết bị mới - Sản phẩm & Review - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá các thiết bị công nghệ mới nhất. Cập nhật sản phẩm mới, tính năng nổi bật và xu hướng thiết bị công nghệ.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá các thiết bị công nghệ mới nhất. Cập nhật sản phẩm mới, tính năng nổi bật và xu hướng thiết bị công nghệ.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Thiết bị mới" 
      subcategory="thiet-bi-moi"
      basePath="san-pham-review"
    />
  )
}