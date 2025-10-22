'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function YTuongHayPage() {
  useEffect(() => {
    document.title = 'Ý tưởng hay - Đổi mới sáng tạo - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá các ý tưởng hay, sáng kiến mới và góc nhìn sáng tạo. Cập nhật xu hướng đổi mới và tư duy sáng tạo trong công nghệ.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá các ý tưởng hay, sáng kiến mới và góc nhìn sáng tạo. Cập nhật xu hướng đổi mới và tư duy sáng tạo trong công nghệ.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Ý tưởng hay" 
      subcategory="y-tuong-hay"
      basePath="doi-moi-sang-tao"
    />
  )
}
