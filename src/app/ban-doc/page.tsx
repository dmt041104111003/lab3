'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function BanDocPage() {
  useEffect(() => {
    document.title = 'Bạn đọc - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Chuyên mục dành cho bạn đọc - câu hỏi thường gặp, hướng dẫn sử dụng, góc nhìn bạn đọc và phản hồi từ cộng đồng TechNova.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Chuyên mục dành cho bạn đọc - câu hỏi thường gặp, hướng dẫn sử dụng, góc nhìn bạn đọc và phản hồi từ cộng đồng TechNova.'
      document.head.appendChild(meta)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Bạn đọc - TechNova')
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = 'Bạn đọc - TechNova'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryMainPage 
      categoryId="ban-doc"
      title="Bạn đọc"
      basePath="ban-doc"
    />
  )
}
