'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function StartupVietPage() {
  useEffect(() => {
    document.title = 'Startup Việt - Đổi mới sáng tạo - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá startup Việt Nam, các dự án khởi nghiệp và tinh thần đổi mới sáng tạo. Cập nhật câu chuyện thành công và xu hướng startup.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá startup Việt Nam, các dự án khởi nghiệp và tinh thần đổi mới sáng tạo. Cập nhật câu chuyện thành công và xu hướng startup.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Startup Việt" 
      subcategory="startup-viet"
      basePath="doi-moi-sang-tao"
    />
  )
}
