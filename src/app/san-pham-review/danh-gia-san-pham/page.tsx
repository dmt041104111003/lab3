'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function DanhGiaSanPhamPage() {
  useEffect(() => {
    document.title = 'Đánh giá sản phẩm - Sản phẩm & Review - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Đánh giá chi tiết các sản phẩm công nghệ mới nhất. Review chuyên sâu, so sánh và hướng dẫn lựa chọn sản phẩm phù hợp.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Đánh giá chi tiết các sản phẩm công nghệ mới nhất. Review chuyên sâu, so sánh và hướng dẫn lựa chọn sản phẩm phù hợp.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Đánh giá sản phẩm" 
      subcategory="danh-gia-san-pham"
      basePath="san-pham-review"
    />
  )
}