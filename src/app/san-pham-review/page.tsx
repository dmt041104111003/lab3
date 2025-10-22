'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function SanPhamReviewPage() {
  useEffect(() => {
    document.title = 'Sản phẩm & Review - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Đánh giá thiết bị mới, ứng dụng phần mềm và sản phẩm công nghệ. Review chi tiết, so sánh và hướng dẫn sử dụng.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Đánh giá thiết bị mới, ứng dụng phần mềm và sản phẩm công nghệ. Review chi tiết, so sánh và hướng dẫn sử dụng.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryMainPage 
      categoryId="san-pham-review"
      title="Sản phẩm & Review"
      basePath="san-pham-review"
    />
  )
}