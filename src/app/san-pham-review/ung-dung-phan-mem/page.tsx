'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function UngDungPhanMemPage() {
  useEffect(() => {
    document.title = 'Ứng dụng & phần mềm - Sản phẩm & Review - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Đánh giá ứng dụng và phần mềm mới nhất. Review chi tiết, hướng dẫn sử dụng và so sánh các ứng dụng công nghệ.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Đánh giá ứng dụng và phần mềm mới nhất. Review chi tiết, hướng dẫn sử dụng và so sánh các ứng dụng công nghệ.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Ứng dụng & phần mềm" 
      subcategory="ung-dung-phan-mem"
      basePath="san-pham-review"
    />
  )
}
