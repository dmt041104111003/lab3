'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function MetaversePage() {
  useEffect(() => {
    document.title = 'Metaverse - Xu hướng tương lai - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá metaverse, thế giới ảo 3D và tương lai của internet. Cập nhật xu hướng metaverse mới nhất.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá metaverse, thế giới ảo 3D và tương lai của internet. Cập nhật xu hướng metaverse mới nhất.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Metaverse" 
      subcategory="metaverse" 
    />
  )
}
