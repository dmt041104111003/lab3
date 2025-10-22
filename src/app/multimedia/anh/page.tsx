'use client'

import { useEffect } from 'react'
import CategoryPage from '@/components/CategoryPage'

export default function AnhPage() {
  useEffect(() => {
    document.title = 'Ảnh - Multimedia - TechNova'
  }, [])

  return (
    <CategoryPage 
      title="Ảnh"
      subcategory="anh"
      basePath="multimedia"
    />
  )
}


