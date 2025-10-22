'use client'

import { useEffect } from 'react'
import CategoryMainPage from '@/components/CategoryMainPage'

export default function TinTucPage() {
  useEffect(() => {
    document.title = 'Tin tức công nghệ - TechNova'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cập nhật tin tức công nghệ mới nhất từ Việt Nam và thế giới. Theo dõi xu hướng công nghệ, phát minh mới và tác động của chúng tới đời sống.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Cập nhật tin tức công nghệ mới nhất từ Việt Nam và thế giới. Theo dõi xu hướng công nghệ, phát minh mới và tác động của chúng tới đời sống.'
      document.head.appendChild(meta)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Tin tức công nghệ - TechNova')
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = 'Tin tức công nghệ - TechNova'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryMainPage 
      categoryId="tin-tuc"
      title="Tin tức"
      basePath="tin-tuc"
    />
  )
}
