'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function BlockchainPage() {
  useEffect(() => {
    document.title = 'Blockchain - Xu hướng tương lai - TechNova'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Khám phá blockchain, tiền điện tử và công nghệ chuỗi khối. Cập nhật xu hướng blockchain mới nhất.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Khám phá blockchain, tiền điện tử và công nghệ chuỗi khối. Cập nhật xu hướng blockchain mới nhất.'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <CategoryPage 
      title="Blockchain" 
      subcategory="blockchain"
      basePath="xu-huong-tuong-lai"
    />
  )
}